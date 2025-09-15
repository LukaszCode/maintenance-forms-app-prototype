import { db } from "../sqlite.ts";

// ----- SCHEMA -----
db.exec(`
  PRAGMA foreign_keys = ON;
  
  -- USERS
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Engineer','Manager','Admin')),
    email TEXT NOT NULL UNIQUE
  );

  -- SITES
  CREATE TABLE IF NOT EXISTS sites (
    site_id INTEGER PRIMARY KEY,
    site_name TEXT NOT NULL,
    site_address TEXT
  );

  -- ZONES
  CREATE TABLE IF NOT EXISTS zones (
    zone_id INTEGER PRIMARY KEY,
    zone_name TEXT NOT NULL,
    zone_description TEXT,
    site_id INTEGER NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(site_id) ON DELETE CASCADE
  );

  -- ITEM TYPES (Used in templates)
  CREATE TABLE IF NOT EXISTS item_types (
    item_type_id INTEGER PRIMARY KEY,
    item_type_label TEXT NOT NULL UNIQUE
  );

  -- ITEMS
  CREATE TABLE IF NOT EXISTS items (
    item_id INTEGER PRIMARY KEY,
    item_type TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_description TEXT,
    zone_id INTEGER NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE CASCADE,
    FOREIGN KEY (item_type) REFERENCES item_types(item_type_label) ON DELETE CASCADE
  );

  -- INSPECTIONS
  CREATE TABLE IF NOT EXISTS inspections (
    inspection_id INTEGER PRIMARY KEY,
    inspection_date TEXT NOT NULL,
    inspection_category TEXT NOT NULL CHECK (inspection_category IN ('Facility', 'Machine Safety')),
    item_id INTEGER NOT NULL,
    engineer_id INTEGER NOT NULL,
    site_id INTEGER NOT NULL,
    zone_id INTEGER NOT NULL,
    comment TEXT,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE RESTRICT,
    FOREIGN KEY (engineer_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (site_id) REFERENCES sites(site_id) ON DELETE CASCADE,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE CASCADE
  );

  -- SUBCHECK TEMPLATES
  CREATE TABLE IF NOT EXISTS subcheck_templates (
    subcheck_template_id INTEGER PRIMARY KEY,
    item_type TEXT NOT NULL,
    subcheck_name TEXT NOT NULL,
    subcheck_description TEXT,
    value_type TEXT NOT NULL CHECK (value_type IN ('string','number','boolean')),
    pass_criteria TEXT,
    FOREIGN KEY (item_type) REFERENCES item_types(item_type_label)
  );

  -- SUBCHECK RESULTS
  CREATE TABLE IF NOT EXISTS subchecks (
    subcheck_id INTEGER PRIMARY KEY,
    inspection_id INTEGER NOT NULL,
    subcheck_name TEXT NOT NULL,
    subcheck_description TEXT,
    value_type TEXT NOT NULL CHECK (value_type IN ('string','number','boolean')),
    pass_criteria TEXT,
    status TEXT NOT NULL CHECK (status IN ('pass', 'fail')),
    FOREIGN KEY (inspection_id) REFERENCES inspections(inspection_id) ON DELETE CASCADE
  );

  -- RESULTS (caching result per inspection)
  CREATE TABLE IF NOT EXISTS results (
    result_id INTEGER PRIMARY KEY,
    inspection_id INTEGER NOT NULL UNIQUE,
    overall_status TEXT NOT NULL CHECK (overall_status IN ('pass', 'fail')),
    FOREIGN KEY (inspection_id) REFERENCES inspections(inspection_id) ON DELETE CASCADE
  );

  -- READINGS
  CREATE TABLE IF NOT EXISTS readings (
    reading_id INTEGER PRIMARY KEY,
    inspection_id INTEGER NOT NULL,
    parameter_id INTEGER NOT NULL,  -- e.g. subcheck_id or parameter template
    value TEXT NOT NULL,
    unit TEXT NOT NULL,
    FOREIGN KEY (inspection_id) REFERENCES inspections(inspection_id) ON DELETE CASCADE
  );

  -- ATTACHMENTS
  CREATE TABLE IF NOT EXISTS attachments (
    attachment_id INTEGER PRIMARY KEY,
    inspection_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    caption TEXT,
    FOREIGN KEY (inspection_id) REFERENCES inspections(inspection_id) ON DELETE CASCADE
  );
`);

console.log("Database schema created.");
