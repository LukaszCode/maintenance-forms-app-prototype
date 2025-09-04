import { db } from "../data-layer/db/sqlite.js";
import { InspectionForm } from "./InspectionForm.js";
import type { SubcheckInput, ValueType } from "./InspectionForm.js";

/**
 * InspectionManager
 *
 * DB-backed service for creating and reading inspections.
 * - Inserts 1 row into 'inspections'
 * - Inserts N rows into 'subcheck_results'
 * - Optionally links subchecks to templates (by item type + label)
 * @export
 * @class InspectionManager
 * @description This class manages the creation and retrieval of inspections and their subchecks.
 */
export class InspectionManager {
  // -----------------------------
  // Public methods (used by routes)
  // -----------------------------

  /**
   * Create a new inspection and its subchecks (transaction).
   *
   * @param {InspectionForm} form - The inspection form data.
   * @returns {InspectionForm} - Returns the saved inspection reloaded from the database.
   * @throws {Error} - If the inspection data is invalid.
   *
   * This method creates a new inspection and its associated subchecks in the database.
   */
  createInspection(form: InspectionForm): InspectionForm {
    this.assertBasicForm(form);

    /**
     * Resolve the engineer ID from the form data.
     * This can be either the engineer's name (string) or their ID (number).
     * @param {InspectionForm} form - The inspection form data.
     * @returns {number} - The resolved engineer ID.
     */
    const engineerId = this.resolveEngineerId(form);

    if (!Number.isInteger(engineerId)) {
      throw new Error("Engineer ID (or a known engineer name) is required.");
    }

    // Overall result is 'pass' only if every subcheck is pass or na
    const overall = this.computeOverall(form.subchecks);

    /**
     * Run the database transaction for inserting the inspection and its subchecks.
     * This ensures that all inserts are dynamic and can be rolled back if any fail.
     * @param {InspectionForm} formParameter - The inspection form data.
     * @returns {InspectionForm} - The saved inspection reloaded from the database.
     * @throws {Error} - If any part of the transaction fails.
     *
     */
    const runTransaction = db.transaction((formParameter: InspectionForm) => {
      // 1) Insert inspection
      const info = db
        .prepare(
          `INSERT INTO inspections
             (inspection_date, category, item_id, engineer_id, comment, overall_result)
           VALUES (?,?,?,?,?,?)`
        )
        .run(
          formParameter.inspectionDate, // ISO string (TEXT/DATE)
          formParameter.inspectionCategory, // 'Facility' | 'Machine Safety'
          formParameter.itemId,
          engineerId,
          formParameter.comment ?? null,
          overall // 'pass' | 'fail'
        );

      const inspectionId = Number(info.lastInsertRowid);

      // 2) Get the item's text label for its type (Option A design)
      const item = db
        .prepare(
          `SELECT item_type FROM items 
        WHERE item_id = ?`
        )
        .get(formParameter.itemId) as { item_type: string } | undefined;
      if (!item) {
        throw new Error("Invalid itemId (item not found).");
      }
      const itemTypeLabel = item.item_type;

      // Optional: get the numeric item_type_id for template lookup
      const typeRow = db
        .prepare(
          `SELECT item_type_id FROM item_types 
          WHERE item_type_label = ?`
        )
        .get(itemTypeLabel) as { item_type_id: number } | undefined;

      // 3) Prepare subcheck insert
      const insertSubcheck = db.prepare(
        `INSERT INTO subcheck_results
            (inspection_id,
            sub_template_id,
            sub_result_label,
            sub_result_description,
            value_type,
            sub_result_mandatory,
            pass_criteria,
            result,
            reading_number,
            reading_text)
         VALUES (?,?,?,?,?,?,?,?,?,?)`
      );

      // 4) Insert each subcheck (validate each row)
      for (const subcheckParameter of formParameter.subchecks) {
        this.assertSubcheck(subcheckParameter);

        // Try to match a template by (item_type_id, sub_template_label)
        let subcheckTemplate:
          | {
              sub_template_id: number;
              value_type: string; // 'boolean'|'number'|'TEXT'
              sub_template_mandatory: number; // 0/1
              pass_criteria: string | null;
            }
          | undefined;

        if (typeRow) {
          subcheckTemplate = db
            .prepare(
              `SELECT sub_template_id, value_type, sub_template_mandatory, pass_criteria
               FROM subcheck_templates
               WHERE item_type_id = ? 
               AND sub_template_label = ?`
            )
            .get(typeRow.item_type_id, subcheckParameter.subcheckName) as any;
        }
        /**
         * Determine the database value type for the subcheck.
         * This is used to ensure the correct data type is stored in the database.
         * @param {SubcheckInput} subcheckParameter - The subcheck input data.
         * @returns {string} - The database value type.
         *
         */
        const dbValueType =
          subcheckTemplate?.value_type ??
          this.toDbValueType(subcheckParameter.valueType); // 'boolean'|'number'|'TEXT'
        const mandatory = subcheckTemplate?.sub_template_mandatory ?? 1; // default to mandatory
        const passCriteria =
          subcheckParameter.passCriteria ??
          subcheckTemplate?.pass_criteria ??
          null;

        insertSubcheck.run(
          inspectionId,
          subcheckTemplate?.sub_template_id ?? null,
          subcheckParameter.subcheckName,
          subcheckParameter.subcheckDescription ?? "",
          dbValueType,
          mandatory,
          passCriteria,
          subcheckParameter.status, // 'pass'|'fail'|'na'
          null, // reading_number (optional later)
          null // reading_text (optional later)
        );
      }

      return inspectionId;
    });

    const id = runTransaction(form);

    /**
     * Reload the saved inspection form after insert.
     * This ensures that the caller gets the most up-to-date data.
     * @param {number} id - The ID of the inspection to reload.
     * @returns {InspectionForm | undefined} - The reloaded inspection form or undefined if not found.
     *
     */
    const saved = this.getInspectionById(id);
    if (!saved) throw new Error("Failed to reload inspection after insert.");
    return saved;
  }

  /**
   * Read one inspection (with subchecks), or undefined if not found.
   * @param {number} id - The ID of the inspection to retrieve.
   * @returns {InspectionForm | undefined} - The inspection form or undefined if not found.
   *
   * @description This method retrieves an inspection form by its ID, including all associated subchecks.
   */
  getInspectionById(id: number): InspectionForm | undefined {
    const inspectionRow = db
      .prepare(
        `SELECT inspection.*,
                u.full_name AS engineer_name
         FROM inspections inspection
         JOIN users u ON u.user_id = inspection.engineer_id
         WHERE inspection.inspection_id = ?`
      )
      .get(id) as any;

    if (!inspectionRow) return undefined;

    const inspectionSubchecks = db
      .prepare(
        `SELECT sub_result_label,
                sub_result_description,
                value_type,
                pass_criteria,
                result
         FROM subcheck_results
         WHERE inspection_id = ?
         ORDER BY sub_result_id`
      )
      .all(id) as Array<{
      sub_result_label: string;
      sub_result_description: string | null;
      value_type: "boolean" | "number" | "TEXT";
      pass_criteria: string | null;
      result: "pass" | "fail" | "na";
    }>;

    const subchecks: SubcheckInput[] = inspectionSubchecks.map(
      (resultParameter) => ({
        subcheckName: resultParameter.sub_result_label,
        subcheckDescription: resultParameter.sub_result_description ?? "",
        valueType: this.fromDbValueType(resultParameter.value_type),
        passCriteria: resultParameter.pass_criteria ?? "",
        status: resultParameter.result,
      })
    );

    return new InspectionForm({
      inspectionId: inspectionRow.inspection_id,
      engineerId: inspectionRow.engineer_id,
      inspectionDate: inspectionRow.inspection_date, // we will set this to string in InspectionForm.ts
      inspectionCategory: inspectionRow.category,
      itemId: inspectionRow.item_id,
      subchecks,
      comment: inspectionRow.comment ?? null,
      engineerName: inspectionRow.engineer_name,
    } as any);
  }

  /**
   * List inspections (simple version: newest first).
   *
   * @returns {InspectionForm[]} - An array of all inspection forms.
   *
   * @description This method retrieves all inspection forms from the database.
   */
  getAllInspections(): InspectionForm[] {
    const inspectionIDs = db
      .prepare(
        `SELECT inspection_id 
        FROM inspections 
        ORDER BY inspection_date 
        DESC, inspection_id DESC`
      )
      .all() as Array<{ inspection_id: number }>;

    const out: InspectionForm[] = [];
    for (const resultParameter of inspectionIDs) {
      const one = this.getInspectionById(resultParameter.inspection_id);
      if (one) out.push(one);
    }
    return out;
  }

  // -----------------------------
  // Private helpers (small & clear)
  // AI Assistant: Copilot
  // -----------------------------

  /**
   * Assert the basic structure of an inspection form.
   * @param f - The inspection form to validate.
   *
   */
  private assertBasicForm(f: InspectionForm) {
    if (!f.inspectionDate)
      throw new Error("inspectionDate is required (ISO string).");
    if (!f.inspectionCategory)
      throw new Error("inspectionCategory is required.");
    if (!Number.isInteger(f.itemId))
      throw new Error("itemId must be an integer.");
    if (!Array.isArray(f.subchecks) || f.subchecks.length === 0) {
      throw new Error("At least one subcheck is required.");
    }
  }
  /**
   * Assert the basic structure of a subcheck.
   * @param subcheckParameter - The subcheck to validate.
   */
  private assertSubcheck(subcheckParameter: SubcheckInput) {
    if (
      !subcheckParameter.subcheckName ||
      !subcheckParameter.subcheckName.trim()
    ) {
      throw new Error("subcheckName is required.");
    }
    if (
      !["string", "number", "boolean"].includes(subcheckParameter.valueType)
    ) {
      throw new Error("valueType must be 'string' | 'number' | 'boolean'.");
    }
    if (!["pass", "fail", "na"].includes(subcheckParameter.status)) {
      throw new Error("status must be 'pass' | 'fail' | 'na'.");
    }
  }

  /** Resolve engineer id either from form.engineerId or by engineerName lookup. */
  private resolveEngineerId(form: InspectionForm): number | undefined {
    if (Number.isInteger((form as any).engineerId)) {
      return (form as any).engineerId as number;
    }
    if (form.engineerName && form.engineerName.trim()) {
      const name = form.engineerName.trim();
      const found = db.prepare(`SELECT user_id FROM users WHERE full_name=?`).get(name) as { user_id: number } | undefined;
      if (found) {
        return found.user_id;
      }
      
      // Prototype convenience: auto-create if missing
      const info = db.prepare(`
        INSERT INTO users(username, full_name, role, email)
        VALUES(?,?, 'Engineer', ?)
      `).run(name.toLowerCase().replace(/\s+/g,'_'), name, `${name.toLowerCase().replace(/\s+/g,'.')}@example.com`);
      return Number(info.lastInsertRowid);
    }
    return undefined;
  }


  /** 'pass' if all subchecks are 'pass' or 'na', otherwise 'fail'. */
  private computeOverall(subs: SubcheckInput[]): "pass" | "fail" {
    return subs.every(
      (subcheck) => subcheck.status === "pass" || subcheck.status === "na"
    )
      ? "pass"
      : "fail";
    // (You can add 'incomplete' later if you support partial saves.)
  }

  /** Map TypeScript value types to the DB CHECK set ('TEXT' vs 'string'). */
  private toDbValueType(value: ValueType): "boolean" | "number" | "TEXT" {
    return value === "string" ? "TEXT" : value;
  }

  /** Map DB value types back to the app literals. */
  private fromDbValueType(value: "boolean" | "number" | "TEXT"): ValueType {
    return value === "TEXT" ? "string" : value;
  }
}
