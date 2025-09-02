import { db } from "../data-layer/db/sqlite.js";
import { InspectionForm, SubcheckInput, ValueType } from "./InspectionForm.js";

/**
 * The DB backed inspection manager which is responsible for handling inspection forms.
 * @export
 * @class InspectionManager
 * @description Manages inspection forms and their associated data.
 *
 */
export class InspectionManager {

    /**
     * Creates a new inspection form.
     * @param {InspectionForm} form - The inspection form to create.
     * @returns {InspectionForm} - The created inspection form.
     */
    createInspection(form: InspectionForm): InspectionForm {
        if (!form.inspectionDate) throw new Error("inspectionDate is required (ISO string).");
        if (!form.inspectionCategory) throw new Error("inspectionCategory is required.");
        if (!Number.isInteger(form.itemId)) throw new Error("itemId must be an integer.");
        if (!form.subchecks || !Array.isArray(form.subchecks) || form.subchecks.length === 0) {
            throw new Error("At least one subcheck is required.");
        }

        // Allow either engineerId or engineerName
        const engineerId = this.resolveEngineerId(form);
        if (!Number.isInteger(engineerId)) {
            throw new Error("engineerId must be an integer.");
        }

        // Compute overall result
        const overallResult = this.computeOverallResult(form.subchecks);

        const transaction = db.transaction((field: InspectionForm, inspectorId: number) => {
            const info = db
            .prepare(
                `
                INSERT INTO inspections
                (inspection_id, 
                inspection_date, 
                category, 
                item_id, 
                engineer_id, 
                comment, 
                overall_result, 
                subchecks) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `
            )
            .run(field.inspectionId, 
                field.inspectionDate, 
                field.inspectionCategory, 
                field.itemId, 
                field.engineerId, 
                field.comment ?? null, 
            );
            const inspectionId = Number(info.lastInsertRowid);

            for (const subcheck of field.subchecks as SubcheckInput[]) {
                if (!subcheck.subcheckName.trim()) {
                    throw new Error("Subcheck name is required and must be a non-empty string.");
                }
                if (!["string", "number", "boolean"].includes(typeof subcheck.valueType)) {
                    throw new Error("Subcheck value must be a string, number, or boolean.");
                }
                if (!["pass", "fail", "na"].includes(subcheck.status)) {
                    throw new Error("Subcheck status must be one of: pass, fail, or na.");
                }
                db.prepare(
                    `
                    INSERT INTO subchecks
                    (subcheck_name, value_type, status, inspection_id)
                    VALUES (?, ?, ?, ?)
                    `
                ).run(
                    subcheck.subcheckName,
                    subcheck.subcheckDescription,
                    subcheck.valueType,
                    subcheck.passCriteria,
                    subcheck.status,
                );
            }
            return inspectionId;
        });

        const newId = transaction(form, form.engineerId);
        return { ...form, inspectionId: newId };
    }

    /**
     * Resolves the engineer ID from the form data.
     * @param {InspectionForm} form - The inspection form containing engineer information.
     * @returns {number | undefined} - The resolved engineer ID.
     */
    private resolveEngineerId(form: InspectionForm): number | undefined {
        if (Number.isInteger((form as any).engineerId)) {
            return (form as any).engineerId as number;
        }
        if (form.engineerName && form.engineerName.trim()) {
            const user = db
                .prepare(`SELECT user_id FROM users WHERE full_name = ?`)
                .get(form.engineerName.trim()) as { user_id: number } | undefined;
            return user?.user_id;
        }
        return undefined;
    }

    /**
     * Computes the overall result of the inspection based on subcheck results.
     * @param {SubcheckInput[]} subchecks - The array of subchecks.
     * @returns {string} - The overall result ("pass", "fail", "incomplete").
     */
    private computeOverallResult(subchecks: SubcheckInput[]): "pass" | "fail" {
        return subchecks.every(subcheck => subcheck.status === "pass" || subcheck.status === "na") ? "pass" : "fail";
    }

    
}