/* 
  Title: Domain models for the inspection management system

  Description: This file defines the various types and interfaces used throughout the application
  And it serves as a central location for managing data structures and types.
  The file is based on classes and attributes documentation 
  but extends it with additional types and interfaces specific to the application.

  Author: Lukasz Brzozowski
  Date: 2025-07-15
  Updated: 2025-07-28
  Version: 1.3

*/

export type InspectionCategory = "Facility" | "Machine Safety";
export type SubcheckStatus = "pass" | "fail" | "not applicable";
export type ValueType = "string" | "number" | "boolean";

export interface User {
  userId: number;
  username: string;
  fullName: string;
  role: "Engineer" | "Manager" | "Admin";
  email: string;
}

// Inspection details
export interface Inspection {
  inspectionId: number;
  inspectionDate: string;
  inspectionCategory: InspectionCategory;
  itemId: number; // <-- Foreign Key to item
  inspectedBy: number; // <-- Foreign Key to user
  siteId: number; // <-- Foreign Key to site
  zoneId: number; // <-- Foreign Key to zone
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

// Item details
export interface Item {
  itemId: number;
  itemType: string; // "Emergency Lighting" | "Die-Cut" etc.
  itemName: string; // "EL-01" | "Bobst DC-01"
  description: string;
  zoneId: number; // <-- Foreign Key to zone
}

// Subcheck within an inspection
export interface Subcheck {
  subcheckId: number;
  inspectionId: number; // Foreign Key to Inspection
  subcheckName: string;
  subcheckDescription: string;
  valueType: ValueType;
  passCriteria: string;
  status: SubcheckStatus; // "pass" | "fail" | "not applicable"
}

// Result of an inspection (overall pass/fail)
export interface Result {
  resultId: number;
  inspectionId: number; // Foreign Key to Inspection
  overallStatus: "pass" | "fail";
}

// Optional readings
export interface Reading {
  readingId: number;
  inspectionId: number; // Foreign Key to Inspection
  parameterId: number;
  value: string | number | boolean;
  unit: string;
}

// Attachments related to the inspection
export interface Attachment {
  attachmentId: number;
  inspectionId: number; // Foreign Key to Inspection
  filePath: string;
  caption: string;
  // resultId?: number; // Foreign Key to Result
}
