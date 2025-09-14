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

  The file was used to define the data models for the inspection management system.
  It provided foundational data structures for managing inspections, items, and related entities.
  The models are designed to be extensible and adaptable to future requirements and follow classes
  and attributes documentation. 

*/

export type InspectionCategory = "Facility" | "Machine Safety";
export type SubcheckStatus = "pass" | "fail";
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
  inspectorId: number; // <-- Foreign Key to user
  siteId: number; // <-- Foreign Key to site
  zoneId: number; // <-- Foreign Key to zone
  subchecks: Subcheck[]; // Array of subchecks for each inspection
  comment?: string | null;
}

export interface Site {
  siteId: number;
  siteName: string;
  siteAddress?: string | null;
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
  status: SubcheckStatus; // "pass" | "fail"
}

// Additional subcheck template as I want to reuse it across different inspections
export interface SubcheckTemplate {
  subcheckTemplateId: number;
  itemType: string;
  subcheckName: string;
  subcheckDescription: string;
  valueType: ValueType;
  passCriteria: string;
}

// Result of an inspection // cached overall result based on subcheck results
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
