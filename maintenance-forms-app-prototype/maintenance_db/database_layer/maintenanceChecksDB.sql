/*
    Maintenance Checks Database Schema
    This schema defines the structure for the maintenance checks database,
    including tables for sites, zones, item types, and inspection categories.

    This schema is designed to support the maintenance checks application by providing
    a structured way to store and retrieve information about various inspection elements.

    Author: Lukasz Brzozowski
    Date: 21/07/2025
*/


PRAGMA foreign_keys=ON;

CREATE TABLE site (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    building_number TEXT, 
    address TEXT,
);

CREATE TABLE zone (
    id INTEGER PRIMARY KEY, 
    site_id INTEGER, 
    label TEXT NOT NULL,
    description TEXT,
    UNIQUE (site_id, label),
    FOREIGN KEY (site_id) REFERENCES site (id)
);
-- Table to store item types e.g Die-Cut Machine or Emergency lights
CREATE TABLE item_type (
    id INTEGER PRIMARY KEY,
    inspection_category TEXT NOT NULL CHECK (inspection_category IN ('Facility', 'Machine Safety')),
    label TEXT NOT NULL, 
    description TEXT,
    UNIQUE (inspection_category, label)

);

-- Table to store item information e.g Bobst, or Twin-head emergency light
CREATE TABLE item (
    id INTEGER PRIMARY KEY,
    item_type_id INTEGER NOT NULL,
    zone_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    UNIQUE (item_type_id, zone_id, name),
    FOREIGN KEY (item_type_id) REFERENCES item_type(id),
    FOREIGN KEY (zone_id) REFERENCES zone(id)
);

-- Table to store user information
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Engineer', 'Manager', 'Admin'))
);

-- Table to store inspection information
CREATE TABLE inspection (
    id INTEGER PRIMARY KEY,
    date TEXT NOT NULL, 
    category TEXT NOT NULL CHECK (category IN ('Facility', 'Machine Safety')),
    item_id INTEGER NOT NULL,
    site_id INTEGER NOT NULL,
    zone_id INTEGER NOT NULL,
    inspector INTEGER NOT NULL, 
    comment TEXT,
    overall_result TEXT CHECK (overall_result IN ('pass', 'fail')),
    started_at TEXT, 
    submitted_at TEXT,
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE RESTRICT,
    FOREIGN KEY (site_id) REFERENCES site(id),
    FOREIGN KEY (zone_id) REFERENCES zone(id),
    FOREIGN KEY (inspector) REFERENCES user(id)
);

-- Table to store subcheck information
CREATE TABLE subcheck (
    id INTEGER PRIMARY KEY,
    inspection_id INTEGER NOT NULL,
    item_type_id INTEGER,
    item_id INTEGER,
    label TEXT NOT NULL,
    description TEXT,
    value_type TEXT NOT NULL CHECK (value_type IN ('boolean', 'number', 'text')),
    mandatory INTEGER NOT NULL CHECK (mandatory IN (0, 1)),
    pass_criteria TEXT,
    result TEXT CHECK (result IN ('pass', 'fail', 'na')),
    reading_number REAL, 
    reading_text TEXT, 

    FOREIGN KEY (inspection_id) REFERENCES inspection(id) ON DELETE CASCADE,
    FOREIGN KEY (item_type_id) REFERENCES item_type(id),
    FOREIGN KEY (item_id) REFERENCES item(id)
);

-- Attachments for subchecks and inspections e.g. photos, documents
CREATE TABLE attachment (
  id INTEGER PRIMARY KEY,
  subcheck_id INTEGER,
  inspection_id INTEGER,
  file_path TEXT NOT NULL,
  caption TEXT,
  timestamp TEXT NOT NULL,
  FOREIGN KEY(subcheck_id)  REFERENCES subcheck(id)  ON DELETE CASCADE,
  FOREIGN KEY(inspection_id) REFERENCES inspection(id) ON DELETE CASCADE
);

-- Ensure attachment references at least one parent
CREATE TRIGGER trg_attachment_has_ref
BEFORE INSERT ON attachment
FOR EACH ROW BEGIN
  SELECT CASE WHEN NEW.subcheck_id IS NULL AND NEW.inspection_id IS NULL
    THEN RAISE(ABORT,'Attachment must reference subcheck or inspection') END;
END;

-- Additional indexes that could be useful to improve query performance
-- These indexes are based on common query patterns and foreign key relationships
CREATE INDEX idx_zone_site         ON zone(site_id);
CREATE INDEX idx_item_type         ON item(item_type_id);
CREATE INDEX idx_item_zone         ON item(zone_id);
CREATE INDEX idx_insp_item         ON inspection(item_id);
CREATE INDEX idx_insp_date         ON inspection(date);
CREATE INDEX idx_sub_insp          ON subcheck(inspection_id);
CREATE INDEX idx_attach_sub        ON attachment(subcheck_id);
CREATE INDEX idx_attach_insp       ON attachment(inspection_id);