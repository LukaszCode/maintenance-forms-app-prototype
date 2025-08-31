
import { Subcheck } from "../../maintenance_app/data-types/models";

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

export class InspectionForm {
    inspectionId: number;
    date: Date;
    category: string;
    siteId: number;
    zoneId: number;
    checkType: string;
    subchecks: Subcheck[];
    comment: string;
    engineerName: string;

  /**
   * Creates an instance of the InspectionForm class.
   * @param {InspectionForm} data - The data to initialize the inspection form.
   */

  constructor(data: InspectionForm) {
    this.inspectionId = data.inspectionId;
    this.date = data.date;
    this.category = data.category;
    this.siteId = data.siteId;
    this.zoneId = data.zoneId;
    this.checkType = data.checkType;
    this.subchecks = data.subchecks;
    this.comment = data.comment;
    this.engineerName = data.engineerName;
  }

  

}
