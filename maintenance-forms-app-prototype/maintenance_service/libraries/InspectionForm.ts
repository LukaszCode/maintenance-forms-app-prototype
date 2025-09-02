/**
 * Used to represent an inspection form. This class defines the structure of the inspection form data.
 * It includes properties for the engineer ID, category, site ID, zone ID, check type, and subchecks.
 *
 * @class InspectionForm
 * @param {number} inspectionId - The ID of the inspection.
 * @param {Date} date - The date of the inspection.
 * @param {string} category - The category of the inspection.
 * @param {number} siteId - The ID of the site being inspected.
 * @param {number} zoneId - The ID of the zone within the site.
 * @param {string} checkType - The type of check being performed.
 * @param {Subcheck[]} subchecks - An array of subchecks associated with the inspection.
 * @param {string} comment - Additional comments related to the inspection.
 * @param {string} engineerName - The name of the engineer conducting the inspection.
 *
 * @returns {InspectionForm} - The created inspection form.
 *
 * author: Lukasz Brzozowski
 */

export type InspectionCategory = "Facility" | "Machine Safety";
export type ValueType = "string" | "number" | "boolean";
export type SubcheckStatus = "pass" | "fail" | "na";

export interface SubcheckInput {
    subcheckName: string;
    subcheckDescription: string;
    valueType: ValueType;
    passCriteria: string;
    status: SubcheckStatus;
}

export interface SubcheckRow extends SubcheckInput {
    subcheck_id: number;
    inspection_id: number;
}

export class InspectionForm {
  inspectionId?: number;
  engineerId?: number;
  inspectionDate: Date = new Date();
  inspectionCategory: InspectionCategory;
  itemId: number;
  subchecks: SubcheckInput[];
  comment: string;
  engineerName: string;

  /**
   * Creates an instance of the InspectionForm class.
   * @param {InspectionForm} data - The data to initialize the inspection form.
   */

  constructor(params: {
    inspectionId?: number;
    engineerId?: number;
    inspectionDate: Date;
    inspectionCategory: InspectionCategory;
    itemId: number;
    subchecks: SubcheckInput[];
    comment?: string | null;
    engineerName?: string;
  }) {
    Object.assign(this, params);
  }

  static fromDbRow(row: any, subchecks: SubcheckRow[], engineerName?: string) {
    return new InspectionForm({
      inspectionId: row.inspection_id,
      engineerId: row.engineer_id,
      inspectionDate: row.inspection_date,
      inspectionCategory: row.inspection_category,
      itemId: row.item_id,
      subchecks: subchecks.map((s) => ({
        subcheckName: s.subcheckName ?? s.subcheckName,
        subcheckDescription: s.subcheckDescription ?? s.subcheckDescription,
        valueType: (s.valueType ?? s.valueType) as ValueType,
        passCriteria: s.passCriteria ?? s.passCriteria,
        status: (s.status as SubcheckStatus) ?? "pass",
      })),
      comment: row.comment,
      engineerName: row.engineerName,
    });
}

  // overall pass if all subchecks are pass or na
  overall(): "pass" | "fail" {
    return this.subchecks.every((s) => s.status === "pass" || s.status === "na") ? "pass" : "fail";
  }
}
