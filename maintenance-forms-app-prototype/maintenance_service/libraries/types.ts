export type InspectionCategory = "Facility" | "Machine Safety";
export type ValueType = "string" | "number" | "boolean";
export type SubcheckStatus = "pass" | "fail" | "na";

export interface SubcheckDto {
    subcheckName: string;
    subcheckDescription: string;
    valueType: ValueType;
    passCriteria: string;
    status: SubcheckStatus;
}

export interface InspectionFormDto {
    inspectionDate: string;
    inspectionCategory: InspectionCategory;
    itemId: number;
    inspectedBy: number;
    siteId: number;
    zoneId: number;
    comment: string;
    subchecks: SubcheckDto[];
}

export interface InspectionResult {
    inspectionId: number;
    overallStatus: "pass" | "fail";
}
