/**
 * This file contains business logic related to form validation
 * It provides functions to validate the entire inspection form,
 * including site, zone, item, and subchecks.
 * It ensures that all required fields are filled out correctly
 * and that the data is structured properly for backend submission.
 * 
 * It leverages subcheckValidation.ts for validating individual subchecks
 * and calculating overall status.
 * The main function validateAndBuildInspectionPayload takes the form data
 * and returns a validated payload ready for submission to the backend API.
 * It throws errors with descriptive messages if any validation fails.
 * This helps maintain data integrity and provides feedback to users
 * to correct any issues before submission.
 * 
 * Author: Lukasz Brzozowski
 * Created: 21/07/2025
 * Edited: 22/07/2025
 *         26/07/2025
 *         30/07/2025
 *         02/08/2025
 *         14/08/2025
 */

import {
    validateSubcheck,
    calculateOverallStatus,
    requireCommentIfFailed,
}   from "./subcheckValidation";

type Named = { id: number; name: string };
type ItemRow = {
    id: number;
    name: string;
    item_type: string;
    zone_id?: number;
};

export type SubcheckUI = {
    id: number;
    name: string; // shown in UI
    status: "pass" | "fail"; // shown in UI
    meta: {                 // hidden, still sent to backend
        description?: string;
        valueType: "string" | "number" | "boolean";
        mandatory?: boolean;
        passCriteria?: string | null;
    };
};

/**
 * Validates and builds the data payload for an inspection submission.
 * @param args The arguments that will be used to send to the backend.
 * @returns The validated and built inspection payload.
 */
export function validateAndBuildFormPayload(args: {
    dateString: string;
    engineerName: string;
    category: "Facility" | "Machine Safety";
    //typed or selected from dropdown
    siteName: string;
    zoneName: string;
    itemType: string;
    itemName: string;
    comment: string;
    //lookup lists from API
    sites: Named[];
    zones: Named[];
    items: ItemRow[];
    //subchecks filled in UI
    subchecksUi: SubcheckUI[];
}) {
    const {
        dateString,
        engineerName,
        category,
        siteName,
        zoneName,
        itemType,
        itemName,
        comment,
        sites,
        zones,
        items,
        subchecksUi,
    } = args;
    
    if (!dateString.trim()) {
        throw new Error("Date string is required.");
    }
    if (!engineerName.trim()) {
        throw new Error("Engineer name is required.");
    }
    if (!siteName.trim()) {
        throw new Error("Site name is required.");
    }
    if (!zoneName.trim()) {
        throw new Error("Zone name is required.");
    }
    if (!itemType.trim()) {
        throw new Error("Item type is required.");
    }
    if (!itemName.trim()) {
        throw new Error("Item name is required.");
    }
    if (subchecksUi.length === 0) {
        throw new Error("At least one subcheck is required.");
    }
    
    /**
   * Validate subcheck entries
   * This ensures that all subchecks have been filled out correctly in the UI.
   * If any subcheck is missing required fields, an error is thrown.
   */
  const domainSubchecks = subchecksUi.map((s) => ({
    subcheckName: s.name,
    subcheckDescription: s.meta.description ?? "",
    valueType: s.meta.valueType,
    passCriteria: s.meta.passCriteria ?? "",
    status: s.status,
  }));

  //Frontend validation

  /**
   * Validate each subcheck
   * This ensures that all required fields are filled out correctly.
   * If any subcheck is invalid, an error is thrown.
   * The specific validation rules are defined in the validateSubcheck function.
   */
  const invalidSubcheck = domainSubchecks.filter((sc) => !validateSubcheck(sc as any));
  if (invalidSubcheck.length > 0) {
    throw new Error("Please complete all subcheck fields.");
  }

  /**
   * Calculate overall status
   * This aggregates the status of all subchecks to determine the overall inspection status.
   * If any subcheck is marked as "fail", the overall status will be "fail".
   * If all subchecks are marked as "pass", the overall status will be "pass".
   * If there are mixed statuses, the overall status will be "failed".
   */
  const overallStatus = calculateOverallStatus(domainSubchecks as any); // "pass" | "fail"
  const commentErrors = requireCommentIfFailed(overallStatus, comment);
  if (commentErrors.length > 0) {
    throw new Error(commentErrors.join("\n"));
  }

  /**
   * Validate site
   * This checks that the selected site exists in the list of available sites.
   * If the site is not found, an error is thrown.
   * @param sites The list of available sites.
   * @param siteName The name of the site to validate.
   * @returns The site object if found, otherwise throws an error.
   */
  const site = sites.find((s) => s.name === siteName);
  if (!site) {
    throw new Error(`Site "${siteName}" not found.`);
  }
  /**
   * Validate zone
   * This checks that the selected zone exists in the list of available zones.
   * If the zone is not found, an error is thrown.
   * @param site The site object to which the zone should belong.
   * @param zones The list of available zones.
   * @param zoneName The name of the zone to validate.
   * @returns The zone object if found, otherwise throws an error.
   */
  const zone = zones.find((z) => z.name === zoneName);
  if (!zone) {
    throw new Error(`Zone "${zoneName}" not found.`);
  }

  /**
   * Validate item
   * This checks that the selected item exists in the list of available items.
   * If the item is not found, an error is thrown.
   * @param zone The zone object to which the item should belong.
   * @param items The list of available items.
   * @param itemName The name of the item to validate.
   * @param itemType The type of the item to validate.
   * @returns The item object if found, otherwise throws an error.
   */

  const item = items.find((it) =>
      it.name === itemName &&
      it.item_type === itemType &&
      it.zone_id === zone.id
    );
    if (!item) {
        throw new Error(`Item "${itemName}" of type "${itemType}" not found in zone "${zoneName}".`);
    }

  /**
   * Build the final payload
   * This prepares the data to be sent to the backend by structuring it according to the API requirements.
   */
  const payload = {
    inspectionDate: new Date(dateString).toISOString(),
    inspectionCategory: category,
    itemId: item.id,
    engineerName,
    comment: comment || null,
    subchecks: domainSubchecks,
  };

  return { payload, overallStatus };
}
