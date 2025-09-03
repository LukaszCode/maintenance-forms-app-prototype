import type { Subcheck as RuleSubcheck } from "../../data-types/models";
import {
    validateSubcheck,
    calculateOverallStatus,
    requireCommentIfFailed
} from "./subcheckValidation";

type IdName = { id: number; name: string };
type ItemRow = { id: number; name: string; item_type: string };

export type SubcheckUI = {
    id: number;
    name: string; // This will be shown on the form
    status: "pass" | "fail";

    meta: {       // This will be hidden but sent to backend
        description: string; 
        valueType: "string" | "number" | "boolean";
        mandatory: boolean;
        passCriteria: string | null;
        
    };
};

export type BuildParams = {
    dateString: string; // ISO date string
    category: "Facility" | "Machine Safety";
    engineerName: string;
    siteName: string;
    zoneName: string;
    itemType: string;
    itemName: string;
    comment?: string;
    subchecks: SubcheckUI[];
    
    // lookup data fetched from backend
    sites: IdName[];
    zones: IdName[];
    items: ItemRow[];
};

type Ok<T> = { ok: true; data: T };
type Err = { ok: false; errors: string[] };

/**
 * Convert UI toggle row to subcheck rules
 * 
 */
