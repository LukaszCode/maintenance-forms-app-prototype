/**
 * InspectionManager.ts
 * This file contains the InspectionManager class, which is responsible for managing inspections.
 * It provides methods to create and retrieve inspections from the database.
 * It ensures data integrity and handles relationships between inspections, subchecks, and templates.
 * It uses transactions to ensure that all related data is inserted correctly.
 * It also includes validation to ensure that the data being inserted is valid.
 *
 * author: Lukasz Brzozowski
 */
import { db } from "../data-layer/db/sqlite.js";
import { InspectionForm } from "../libraries/InspectionForm.js";
import bcrypt from "bcrypt";
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
    /**
     * Create a new inspection and its subchecks (transaction).
     *
     * @param {InspectionForm} form - The inspection form data.
     * @returns {InspectionForm} - Returns the saved inspection reloaded from the database.
     * @throws {Error} - If the inspection data is invalid.
     *
     * This method creates a new inspection and its associated subchecks in the database.
     */
    createInspection(form) {
        this.assertBasicForm(form);
        const runTransaction = db.transaction((formData) => {
            // 1) Find the item type 
            // We need item type because subchecks are added based on item_type of the inspected item
            // e.g. If the item_type is "emergency lights", we look for subchecks related to emergency lights.
            const item = db
                .prepare(`
          SELECT item_type 
          FROM items 
          WHERE item_id = ?`)
                .get(formData.itemId);
            if (!item) {
                throw new Error("Invalid itemId (item not found).");
            }
            const itemTypeLabel = item.item_type;
            // 2) Find or create the item_type_id for this label (if missing)
            let typeRow = db
                .prepare(`
          SELECT item_type_id 
          FROM item_types 
          WHERE item_type_label = ?`)
                .get(itemTypeLabel);
            if (!typeRow) {
                const infoType = db
                    .prepare(`
            INSERT INTO item_types (inspection_category, item_type_label, item_type_description)
            VALUES (?,?,?)`)
                    .run(formData.inspectionCategory, itemTypeLabel, null);
                typeRow = { item_type_id: Number(infoType.lastInsertRowid) };
            }
            // Extract the item_type_id from the typeRow 
            const typeId = typeRow.item_type_id;
            // 3) Build mandatoryMap from templates for this item type
            const mandatoryMap = new Map();
            const mandatoryRows = db
                .prepare(`
          SELECT
            subcheck_template_label, subcheck_template_mandatory 
          FROM subcheck_templates
          WHERE item_type_id = ?`)
                .all(typeId);
            mandatoryRows.forEach(row => mandatoryMap.set(row.subcheck_template_label, row.subcheck_template_mandatory));
            // 4) Compute overall result based on the mandatory subchecks
            const overallResult = this.computeOverall(formData.subchecks, mandatoryMap);
            // 5) Enforce comment if overall is 'fail'
            if (overallResult === "fail" && !formData.comment?.trim()) {
                throw new Error("Comment is required when overall result is 'fail'.");
            }
            // 5) Insert the inspection with the overall result
            const infoInspection = db
                .prepare(`
          INSERT INTO inspections
            (inspection_date,
            inspection_category,
            item_id,
            engineer_id,
            comment,
            overall_result)
          VALUES (?,?,?,?,?,?)`)
                .run(formData.inspectionDate, formData.inspectionCategory, formData.itemId, this.resolveEngineerId(formData), formData.comment ?? null, overallResult);
            const inspectionId = Number(infoInspection.lastInsertRowid);
            // 6) Prepare the subcheck for insert
            const insertSubcheck = db.prepare(`
        INSERT INTO subcheck_results
          (inspection_id,
          subcheck_template_id,
          subcheck_result_label,
          subcheck_result_description,
          value_type,
          subcheck_result_mandatory,
          pass_criteria,
          result,
          reading_number,
          reading_text)
        VALUES (?,?,?,?,?,?,?,?,?,?)`);
            // 7) Insert each subcheck - create template on-the-fly if missing
            for (const subcheck of formData.subchecks) {
                this.assertSubcheck(subcheck);
                // Try to match a template by (item_type_id, subcheck_template_label)
                let subcheckTemplate = db
                    .prepare(`
            SELECT 
              subcheck_template_id, 
              value_type, 
              subcheck_template_mandatory, 
              pass_criteria
            FROM subcheck_templates
            WHERE item_type_id = ? 
            AND subcheck_template_label = ?`)
                    .get(typeId, subcheck.subcheckName);
                // If no template found, create one on the fly
                if (!subcheckTemplate) {
                    const dbValueType = this.toDbValueType(subcheck.valueType);
                    const infoSubTemplate = db
                        .prepare(`
              INSERT INTO subcheck_templates
                (item_type_id, 
                subcheck_template_label, 
                subcheck_template_description, 
                value_type, 
                subcheck_template_mandatory, 
                pass_criteria)
              VALUES (?,?,?,?,?,?)`)
                        .run(typeId, subcheck.subcheckName, subcheck.subcheckDescription ?? "", dbValueType, 1, // mandatory by default
                    subcheck.passCriteria ?? "true");
                    subcheckTemplate = {
                        subcheck_template_id: Number(infoSubTemplate.lastInsertRowid),
                        value_type: this.toDbValueType(subcheck.valueType),
                        subcheck_template_mandatory: 1,
                        pass_criteria: subcheck.passCriteria ?? "true",
                    };
                    // Update the mandatoryMap
                    mandatoryMap.set(subcheck.subcheckName, 1);
                }
                // Insert the subcheck result, linking to the template if available
                // Use template values as defaults if not provided in the subcheck
                const dbValueType = subcheckTemplate.value_type ?? this.toDbValueType(subcheck.valueType);
                const mandatory = subcheckTemplate.subcheck_template_mandatory ?? 1;
                const passCriteria = subcheckTemplate.pass_criteria ?? subcheck.passCriteria ?? "true";
                insertSubcheck.run(inspectionId, subcheckTemplate.subcheck_template_id ?? null, subcheck.subcheckName, subcheck.subcheckDescription ?? "", dbValueType, mandatory, passCriteria, subcheck.status, // 'pass'|'fail'|'na'
                null, // reading_number (optional)
                null // reading_text (optional)
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
        if (!saved)
            throw new Error("Failed to reload inspection after insert.");
        return saved;
    }
    /**
     * Read one inspection (with subchecks), or undefined if not found.
     * @param {number} id - The ID of the inspection to retrieve.
     * @returns {InspectionForm | undefined} - The inspection form or undefined if not found.
     *
     * @description This method retrieves an inspection form by its ID, including all associated subchecks.
     */
    getInspectionById(id) {
        const inspectionRow = db
            .prepare(`SELECT inspection.*,
            u.full_name AS engineer_name
         FROM inspections inspection
         JOIN users u ON u.user_id = inspection.engineer_id
         WHERE inspection.inspection_id = ?`)
            .get(id);
        if (!inspectionRow)
            return undefined;
        const inspectionSubchecks = db
            .prepare(`SELECT 
          subcheck_result_label,
          subcheck_result_description,
          value_type,
          pass_criteria,
          result
        FROM subcheck_results
        WHERE inspection_id = ?
        ORDER BY subcheck_result_id`)
            .all(id);
        const subchecks = inspectionSubchecks.map((resultParameter) => ({
            subcheckName: resultParameter.subcheck_result_label,
            subcheckDescription: resultParameter.subcheck_result_description ?? "",
            valueType: this.fromDbValueType(resultParameter.value_type),
            passCriteria: resultParameter.pass_criteria ?? "",
            status: resultParameter.result,
        }));
        return new InspectionForm({
            inspectionId: inspectionRow.inspection_id,
            engineerId: inspectionRow.engineer_id,
            inspectionDate: inspectionRow.inspection_date, // we will set this to string in InspectionForm.ts
            inspectionCategory: inspectionRow.inspection_category,
            itemId: inspectionRow.item_id,
            subchecks,
            comment: inspectionRow.comment ?? null,
            engineerName: inspectionRow.engineer_name,
        });
    }
    /**
     * List inspections (newest first).
     *
     * @returns {InspectionForm[]} - An array of all inspection forms.
     *
     * @description This method retrieves all inspection forms from the database.
     */
    getAllInspections() {
        const inspectionIDs = db
            .prepare(`SELECT inspection_id 
        FROM inspections 
        ORDER BY inspection_date 
        DESC, inspection_id DESC`)
            .all();
        const out = [];
        for (const resultParameter of inspectionIDs) {
            const one = this.getInspectionById(resultParameter.inspection_id);
            if (one)
                out.push(one);
        }
        return out;
    }
    // Private methods to help with validation and lookups
    /**
     * Assert the basic structure of an inspection form.
     * @param f - The inspection form to validate.
     *
     */
    assertBasicForm(f) {
        if (!f.inspectionDate)
            throw new Error("Inspection date is required (ISO string).");
        if (!f.inspectionCategory)
            throw new Error("Inspection category is required.");
        if (!Number.isInteger(f.itemId))
            throw new Error("Item ID must be an integer.");
        if (!Array.isArray(f.subchecks) || f.subchecks.length === 0) {
            throw new Error("At least one subcheck is required.");
        }
    }
    /**
     * Assert the basic structure of a subcheck.
     * @param subcheckParameter - The subcheck to validate.
     */
    assertSubcheck(subcheckParameter) {
        if (!subcheckParameter.subcheckName ||
            !subcheckParameter.subcheckName.trim()) {
            throw new Error("Subcheck name is required.");
        }
        if (!["string", "number", "boolean"].includes(subcheckParameter.valueType)) {
            throw new Error("Value type must be 'string' | 'number' | 'boolean'.");
        }
        if (!["pass", "fail", "na"].includes(subcheckParameter.status)) {
            throw new Error("Status must be 'pass' | 'fail' | 'na'.");
        }
    }
    /** Resolve engineer id either from form.engineerId or by engineer email lookup.
     * If engineerName not found, auto-create a new user.
     */
    resolveEngineerId(form) {
        if (Number.isInteger(form.engineerId)) {
            return form.engineerId;
        }
        const email = form.engineerEmail?.trim();
        if (!email) {
            throw new Error("Email address is required.");
        }
        // Lookup engineer by email
        const existing = db
            .prepare(`
        SELECT user_id FROM users WHERE email = ?
      `)
            .get(email);
        if (existing) {
            return existing.user_id;
        }
        // Auto-create a new engineer user
        const name = form.engineerName?.trim() || email.split("@")[0];
        const username = name.toLowerCase().replace(/\s+/g, ".");
        const rawPassword = form.engineerPassword?.trim();
        if (!rawPassword) {
            throw new Error("Password is required to create new user.");
        }
        const hashedPassword = bcrypt.hashSync(rawPassword, 10);
        const info = db
            .prepare(`
        INSERT INTO users (username, full_name, role, password_hash, email)
        VALUES (?, ?, ?, ?, ?)
      `)
            .run(username, name, "engineer", hashedPassword, email);
        return Number(info.lastInsertRowid);
    }
    /** 'pass' if all subchecks are 'pass' or 'na', otherwise 'fail'. */
    computeOverall(subchecks, mandatoryMap) {
        const ok = subchecks.every(subcheck => {
            const isMandatory = (mandatoryMap?.get(subcheck.subcheckName) ?? 1) === 1;
            if (isMandatory) {
                // If mandatory, must be 'pass'
                return subcheck.status === "pass";
            }
            // If not mandatory, can be 'pass' or 'na'
            return subcheck.status === "pass" || subcheck.status === "na";
        });
        return ok ? "pass" : "fail";
    }
    /** Map TypeScript value types to the DB CHECK set ('TEXT' vs 'string'). */
    toDbValueType(value) {
        return value === "string" ? "TEXT" : value;
    }
    /** Map DB value types back to the app literals. */
    fromDbValueType(value) {
        return value === "TEXT" ? "string" : value;
    }
}
