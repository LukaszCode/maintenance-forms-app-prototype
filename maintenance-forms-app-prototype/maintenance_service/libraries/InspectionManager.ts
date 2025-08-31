import { Database } from "sqlite";
import { openDatabase } from "../data-layer/db/sqlite";
import { InspectionForm } from "./InspectionForm";

/**
 * The inspection manager is responsible for handling inspection forms.
 * @export
 * @class InspectionManager
 * @param inspections - The list of inspections to manage.
 *
 */
export class InspectionManager {
    inspections: InspectionForm[] = [];

    /**
     * Creates a new inspection form.
     * @param {InspectionForm} form - The inspection form to create.
     * @returns {InspectionForm} - The created inspection form.
     */
    createInspection(form: InspectionForm): InspectionForm {
        this.inspections.push(form);
        return form;
    }

    /**
     * Retrieves all inspection forms.
     * @returns {InspectionForm[]} - The list of inspection forms.
     */
    getAllInspections(): InspectionForm[] {
        return this.inspections;
    }
    /**
     * Find all inspection forms completed by a specific engineer
     * @param {string} engineerName - The name of the engineer whose inspections to retrieve.
     * @returns {InspectionForm[]} - The list of inspection forms completed by the specified engineer.
     */
    getInspectionsByEngineer(engineerName: string): InspectionForm[] {
        return this.inspections.filter(form => form.engineerName === engineerName);
    }

    /**
     * Retrieves a specific inspection form by its ID.
     * @param {number} id - The ID of the inspection form to retrieve.
     * @returns {InspectionForm | undefined} - The requested inspection form, or undefined if not found.
     */
    getInspectionById(id: number): InspectionForm | undefined {
        return this.inspections.find(form => form.inspectionId === id);
    }
}