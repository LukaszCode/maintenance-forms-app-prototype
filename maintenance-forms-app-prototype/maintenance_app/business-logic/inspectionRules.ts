/*
  This file contains business logic related to subcheck validation
  It provides functions to validate individual subchecks, calculate overall status,
  and enforce commenting requirements for failed inspections.

  A subcheck is considered valid if it has a name, description, and a valid value type.
  It must also have a status of either "pass" or "fail".

  A subcheck is considered invalid if it has a status of "fail" and is missing a comment.
*/

import { Subcheck } from "../data-types/models";

/*
  This function validates a single subcheck object.
  It checks for the presence of required fields and their types.

  if subcheck does not have a name or description, it is invalid
  if valueType is not one of the allowed types, the subcheck is invalid
  if subcheck status is not pass or fail, the subcheck is invalid
  
*/
export function validateSubcheck(subcheck: Subcheck): boolean {
  if (!subcheck.subcheckName || !subcheck.subcheckDescription) {
    return false;
  }
  if (!["string", "number", "boolean"].includes(subcheck.valueType)) {
    return false;
  }
  if (!["pass", "fail"].includes(subcheck.status)) {
    return false;
  }
  return true;
}

/*
  This function calculates the overall status of a set of subchecks.
  It returns "pass" if all subchecks are "pass", otherwise it returns "fail".
*/
export function calculateOverallStatus(subchecks: Subcheck[]): "pass" | "fail" {
  for (const subcheck of subchecks) {
    if (subcheck.status === "fail") {
      return "fail";
    }
  }
  return "pass";
}

/*
  This function checks if a comment is required for a failed inspection.
  It returns an array of error messages if the comment is missing.
*/
export function requireCommentIfFailed(
  overall: "pass" | "fail",
  comment?: string | null
): string[] {
  const errors: string[] = [];
  if (overall === "fail" && !comment) {
    errors.push("Comment is required when the inspection fails.");
  }
  return errors;
}
