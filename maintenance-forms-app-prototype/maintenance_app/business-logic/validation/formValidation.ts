import {
  validateSubcheck,
  calculateOverallStatus,
  requireCommentIfFailed,
} from "./subcheckValidation";

type IdName = { id: number; name: string };
type ItemRow = { id: number; name: string; item_type: string };

export type SubcheckUI = {
    id: number;
    name: string; // This will be shown on the form
    status: "pass" | "fail";

    meta: {       // This will be hidden but sent to backend
        description: string | undefined;
        valueType: "string" | "number" | "boolean";
        mandatory: boolean;
        passCriteria: string | null;
    };
};

type BuildArgs = {
    id: number;
    dateString: string; // ISO date string
    inspectionCategory: "Facility" | "Machine Safety";
    itemId: number;
    engineerName: string;
    comment?: string | null;
    subchecksUi: SubcheckUI[];
};

/**
 * Validates and builds the data payload for an inspection submission.
 * @param args The arguments that will be used to send to the backend.
 * @returns The validated and built inspection payload.
 */
export function validateAndBuildInspectionPayload(args: BuildArgs) {
    const { dateString, inspectionCategory, itemId, engineerName, comment, subchecksUi } = args;

    if (!dateString.trim()) {
        throw new Error("Date string is required.");
    }
    if (!engineerName.trim()) {
        throw new Error("Engineer name is required.");
    }
    if (!Number.isInteger(itemId)) {
        throw new Error("Item is not selected.");
    }

    // Map to domain-specific subcheck format
    const domainSubchecks = subchecksUi.map(s => ({
        subcheckName: s.name, 
        subcheckDescription: s.meta.description ?? "",
        valueType: s.meta.valueType === "string" ? "text" : (s.meta.valueType as "boolean"|"number"|"string"),
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
    const invalidSubchecks = domainSubchecks.filter(sc => !validateSubcheck(sc as any));
    if (invalidSubchecks.length > 0) {
        throw new Error("Please complete all subcheck fields.");
    }

    /**
     * Calculate overall status
     * This aggregates the status of all subchecks to determine the overall inspection status.
     * If any subcheck is marked as "fail", the overall status will be "fail".
     * If all subchecks are marked as "pass", the overall status will be "pass".
     * If there are mixed statuses, the overall status will be "failed".
     */
    const overallStatus = calculateOverallStatus(domainSubchecks as any);
    const commentErrors = requireCommentIfFailed(overallStatus, comment);
    if (commentErrors.length > 0) {
        throw new Error(commentErrors.join("\n"));
    }

    /**
     * Build the final payload
     * This prepares the data to be sent to the backend by structuring it according to the API requirements.
     */
    const payload = {
        inspectionDate: new Date(dateString).toISOString(),
        inspectionCategory,
        itemId,
        engineerName,
        comment: comment || null,
        subchecks: domainSubchecks,
    };

    return payload;
}
