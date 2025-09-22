import { db } from "../sqlite.ts";

// ----- SCHEMA -----
db.exec(`

  PRAGMA foreign_keys = ON;
  
  -- USERS
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Engineer','Manager','Admin', 'engineer', 'manager', 'admin')),
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
    FOREIGN KEY (site_id) REFERENCES sites(site_id) ON DELETE CASCADE,
    UNIQUE (zone_name, site_id)  -- Ensure unique zone names within a site
  );

  -- ITEM TYPES (Used in templates)
  CREATE TABLE IF NOT EXISTS item_types (
    item_type_id INTEGER PRIMARY KEY,
    item_type_label TEXT NOT NULL UNIQUE
    inspection_category TEXT NOT NULL CHECK (inspection_category IN ('Facility', 'Machine Safety')),
    item_type_label TEXT NOT NULL,
    item_type_description TEXT,
    UNIQUE (item_type_label)
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
    comment TEXT,
    overall_result TEXT NOT NULL CHECK (overall_result IN ('pass', 'fail')),
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE RESTRICT,
    FOREIGN KEY (engineer_id) REFERENCES users(user_id) ON DELETE RESTRICT
  );

  -- SUBCHECK TEMPLATES
  CREATE TABLE IF NOT EXISTS subcheck_templates (
    subcheck_template_id INTEGER PRIMARY KEY,
    item_type_id INTEGER NOT NULL,
    subcheck_template_label TEXT NOT NULL,
    subcheck_template_description TEXT,
    value_type TEXT NOT NULL CHECK (value_type IN ('TEXT','number','boolean')),
    subcheck_template_mandatory INTEGER NOT NULL DEFAULT 1 CHECK (subcheck_template_mandatory IN (0,1)),
    pass_criteria TEXT,
    FOREIGN KEY (item_type_id) REFERENCES item_types(item_type_id) ON DELETE CASCADE,
    UNIQUE (item_type_id, subcheck_template_label)
  );

  -- SUBCHECK RESULTS
  CREATE TABLE IF NOT EXISTS subcheck_results (
    subcheck_result_id INTEGER PRIMARY KEY,
    inspection_id INTEGER NOT NULL,
    subcheck_template_id INTEGER NOT NULL,
    subcheck_result_label TEXT NOT NULL,
    subcheck_result_description TEXT,
    value_type TEXT NOT NULL CHECK (value_type IN ('TEXT','number','boolean')),
    subcheck_result_mandatory INTEGER NOT NULL CHECK (subcheck_result_mandatory IN (0,1)),
    pass_criteria TEXT,
    result TEXT NOT NULL CHECK (result IN ('pass','fail','na')),
    reading_number REAL,
    reading_text TEXT,
    FOREIGN KEY (inspection_id) REFERENCES inspections(inspection_id) ON DELETE CASCADE,
    FOREIGN KEY (subcheck_template_id) REFERENCES subcheck_templates(subcheck_template_id) ON DELETE SET NULL
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
    parameter_id INTEGER NOT NULL,
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
