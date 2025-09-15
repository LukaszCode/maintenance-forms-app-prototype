/**
 * Used to represent an inspection form. This class defines the structure of the inspection form data.
 * It includes properties for the engineer ID, category, site ID, zone ID, check type, and subchecks.
 *
 * @class InspectionForm
 * @param {number} inspectionId - The ID of the inspection.
 * @param {string} date - The date of the inspection as a string.
 * @param {string} category - The category of the inspection.
 * @param {number} siteId - The ID of the site being inspected.
 * @param {number} zoneId - The ID of the zone within the site.
 * @param {string} checkType - The type of check being performed.
 * @param {Subcheck[]} subchecks - An array of subchecks associated with the inspection.
 * @param {string} comment - Additional comments related to the inspection.
 * @param {string} engineerName - The name of the engineer conducting the inspection.
 *
 *
 * @returns {InspectionForm} - The created inspection form.
 *
 * author: Lukasz Brzozowski
 */
export class InspectionForm {
    constructor(params) {
        Object.assign(this, params);
    }
    overall() {
        return this.subchecks.every((s) => s.status === "pass" || s.status === "na")
            ? "pass"
            : "fail";
    }
}
