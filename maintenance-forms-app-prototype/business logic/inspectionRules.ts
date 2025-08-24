// This file contains business logic related to subcheck validation

import { Subcheck } from "../types/models";

export function validateSubcheck(subcheck: Subcheck): boolean {
  // Basic validation rules
  if (!subcheck.subcheckName || !subcheck.subcheckDescription) {
    return false;
  }
  if (!["string", "number", "boolean"].includes(subcheck.valueType)) {
    return false;
  }
  if (!["pass", "fail", "not applicable"].includes(subcheck.status)) {
    return false;
  }
  return true;
}

export function calculateOverallStatus(subchecks: Subcheck[]): "pass" | "fail" {
  for (const subcheck of subchecks) {
    if (subcheck.status === "fail") {
      return "fail";
    }
  }
  return "pass";
}

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
