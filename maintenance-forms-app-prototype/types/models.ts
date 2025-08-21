// Domain models for the app to keep modularity and make them reusable

export interface User {
  userId: number;
  username: string;
  fullName: string;
  role: "Engineer" | "Manager" | "Admin";
  email: string;
}

export interface Inspection {
  inspectionId: number;
  inspectionDate: Date;
  inspectionCategory: "Facilities" | "Machine Safety";
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

export interface InspectionResult {
  resultId: number;
  subcheckId: number;
  outcome: "Pass" | "Fail";
  comment?: string | null;
}

export interface Site {
  siteId: number;
  siteName: string;
}

export interface Zone {
  zoneId: number;
  zoneName: string;
  zoneDescription?: string | null;
  siteId: number;
}

export interface InspectionParameter {
  parameterId: number;
  itemType: string;
  description: string;
  inspectionMethod: string;
  valueType: "string" | "number" | "boolean";
}

export interface Reading {
  readingId: number;
  itemId: Inspection["inspectionId"];
  parameterId: InspectionParameter["parameterId"];
  value: string | number | boolean;
  unit: string;
}

export interface Attachment {
  attachmentId: number;
  attachmentData: string;
  filePath: string;
  caption: string;
  resultId: InspectionResult["resultId"];
}
