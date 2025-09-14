import { db } from "./data-layer/db/sqlite.js";

// ----- SCHEMA -----
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_hash TEXT,              -- optional for later
    role TEXT 
    NOT NULL CHECK (role IN ('Engineer','Manager','Admin')) DEFAULT 'Engineer',
    email TEXT
  );

  -- Sites are unique by (site_name, building_number)
  CREATE TABLE IF NOT EXISTS sites (
    site_id INTEGER PRIMARY KEY,
    site_name TEXT NOT NULL,
    building_number TEXT,
    site_address TEXT,
    UNIQUE (site_name, building_number)
  );

  -- Zones: keep zone_name; unique per site
  CREATE TABLE IF NOT EXISTS zones (
    zone_id INTEGER PRIMARY KEY,
    zone_name TEXT NOT NULL,
    zone_description TEXT,
    site_id INTEGER NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS item_types (
    item_type_id INTEGER PRIMARY KEY,
    inspection_category TEXT NOT NULL CHECK (inspection_category IN ('Facility','Machine Safety')),
    item_type_label TEXT NOT NULL,
    item_type_description TEXT
  );
  
  -- Items: item_type references item_types(item_type_label) for easier reading
  CREATE TABLE IF NOT EXISTS items (
    item_id INTEGER PRIMARY KEY,
    item_type TEXT NOT NULL REFERENCES item_types(item_type_label) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_description TEXT,
    zone_id INTEGER NOT NULL REFERENCES zones(zone_id) ON DELETE CASCADE
  );

  -- Column name 'category' matches your backend code
  CREATE TABLE IF NOT EXISTS inspections (
    inspection_id INTEGER PRIMARY KEY,
    inspection_date TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Facility','Machine Safety')),
    item_id INTEGER NOT NULL REFERENCES items(item_id) ON DELETE RESTRICT,
    engineer_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    comment TEXT,
    overall_result TEXT CHECK (overall_result IN ('pass','fail','incomplete'))
  );

  CREATE TABLE IF NOT EXISTS subcheck_templates (
    sub_template_id INTEGER PRIMARY KEY,
    item_type_id INTEGER NOT NULL REFERENCES item_types(item_type_id) ON DELETE CASCADE,
    sub_template_label TEXT NOT NULL,
    sub_template_description TEXT,
    value_type TEXT NOT NULL CHECK (value_type IN ('boolean','number','TEXT')),
    sub_template_mandatory INTEGER NOT NULL DEFAULT 1 CHECK (sub_template_mandatory IN (0,1)),
    pass_criteria TEXT
  );

  CREATE TABLE IF NOT EXISTS subcheck_results (
    sub_result_id INTEGER PRIMARY KEY,
    inspection_id INTEGER NOT NULL REFERENCES inspections(inspection_id) ON DELETE CASCADE,
    sub_template_id INTEGER REFERENCES subcheck_templates(sub_template_id) ON DELETE SET NULL,
    sub_result_label TEXT NOT NULL,
    sub_result_description TEXT,
    value_type TEXT NOT NULL CHECK (value_type IN ('boolean','number','TEXT')),
    sub_result_mandatory INTEGER NOT NULL CHECK (sub_result_mandatory IN (0,1)),
    pass_criteria TEXT,
    result TEXT CHECK (result IN ('pass','fail','na')),
    comment TEXT,
    reading_number REAL,
    reading_text TEXT
  );

  -- Indexes / uniqueness
  CREATE UNIQUE INDEX IF NOT EXISTS uq_zones_descr_site_name ON zones(site_id, zone_name, zone_description COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_zones_site       ON zones(site_id);
  CREATE INDEX IF NOT EXISTS idx_items_zone       ON items(zone_id);
  CREATE INDEX IF NOT EXISTS idx_items_type       ON items(item_type);
  CREATE INDEX IF NOT EXISTS idx_items_name       ON items(item_name COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_items_desc       ON items(item_description COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_inspections_eng  ON inspections(engineer_id);
  CREATE INDEX IF NOT EXISTS idx_inspections_item ON inspections(item_id);
  CREATE INDEX IF NOT EXISTS idx_inspections_date ON inspections(inspection_date);
  CREATE INDEX IF NOT EXISTS idx_subchecks_insp   ON subcheck_results(inspection_id);
`);

console.log("Migration (schema) OK.");