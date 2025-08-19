// Domain models for the app to keep modularity and make them reusable

export type InspectionCategory = "Facilities" | "Machine Safety";

export interface User {
  userId: number;
  fullName: string;
}
export interface Site {
  siteId: number;
  siteName: string;
}
export interface Zone {
  zoneId: number;
  zoneName: string;
  siteId: number;
}

export interface Inspection {
  inspectionId: number;
  inspectionDate: Date;
  category: InspectionCategory;
  userId: number;
  siteId: number;
  zoneId: number;
}

export interface Subcheck {
  subcheckId: number;
  inspectionId: number;
  label: string;
  mandatory: boolean;
}

export interface Result {
  resultId: number;
  subcheckId: number;
  outcome: "Pass" | "Fail";
  comment?: string | null;
}
