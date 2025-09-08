import { db } from "./data-layer/db/sqlite.js";

// ----- SCHEMA -----
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_hash TEXT,              -- optional for later
    role TEXT NOT NULL CHECK (role IN ('Engineer','Manager','Admin')) DEFAULT 'Engineer',
    email TEXT
  );

  -- Sites are unique by (site_name, building_number) so "GWP Packaging" can exist with 6/20/22/27
  CREATE TABLE IF NOT EXISTS sites (
    site_id INTEGER PRIMARY KEY,
    site_name TEXT NOT NULL,
    building_number TEXT,
    site_address TEXT,
    UNIQUE (site_name, building_number)
  );

  -- Use zone_name 
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
    item_type_description TEXT,
    UNIQUE (inspection_category, item_type_label)
  );

  -- Use item_description (NOT description)
  CREATE TABLE IF NOT EXISTS items (
    item_id INTEGER PRIMARY KEY,
    item_type TEXT NOT NULL,         -- TEXT label (Option A)
    item_name TEXT NOT NULL,
    item_description TEXT,
    zone_id INTEGER NOT NULL REFERENCES zones(zone_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS inspections (
    inspection_id INTEGER PRIMARY KEY,
    inspection_date TEXT NOT NULL,
    inspection_category TEXT NOT NULL CHECK (inspection_category IN ('Facility','Machine Safety')),
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
  CREATE UNIQUE INDEX IF NOT EXISTS uq_zones_site_name ON zones(site_id, zone_name COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_zones_site         ON zones(site_id);
  CREATE INDEX IF NOT EXISTS idx_items_zone         ON items(zone_id);
  DROP INDEX IF EXISTS idx_items_type; -- legacy (for Option B)
  CREATE INDEX IF NOT EXISTS idx_items_type_text    ON items(item_type);
  CREATE INDEX IF NOT EXISTS idx_inspections_item   ON inspections(item_id);
  CREATE INDEX IF NOT EXISTS idx_inspections_date   ON inspections(inspection_date);
  CREATE INDEX IF NOT EXISTS idx_subchecks_insp     ON subcheck_results(inspection_id);
`);

console.log("Migration (schema) OK.");

db.exec(`
  -- Users
  INSERT OR IGNORE INTO users (user_id, username, full_name, role, email)
  VALUES (1, 'LB', 'Lukasz Brzozowski', 'Engineer', 'lukasz.brzozowski@company.com');

  -- Sites (now valid because UNIQUE(site_name,building_number))
  INSERT OR IGNORE INTO sites(site_id, site_name, building_number, site_address)
  VALUES 
    (1, 'GWP Packaging', '6',  'Chelworth Industrial Estate, Cricklade, SN6 6HE'),
    (2, 'GWP Packaging', '20', 'Chelworth Industrial Estate, Cricklade, SN6 6HE'),
    (3, 'GWP Packaging', '22', 'Chelworth Industrial Estate, Cricklade, SN6 6HE'),
    (4, 'GWP Packaging', '27', 'Chelworth Industrial Estate, Cricklade, SN6 6HE');

  -- Zones (use zone_name; give each a distinct name under site_id=2)
  INSERT OR IGNORE INTO zones(zone_id, zone_name, zone_description, site_id)
  VALUES
    (1, 'Boiler Room',                              'Zone A', 2),
    (2, 'External Fire Exit - Supernova',           'Zone A', 2),
    (3, 'Production - Supernova Fire Exit',         'Zone A', 2),
    (4, 'Production - above Emmepi Belt',           'Zone A', 2),
    (5, 'Production - above Bobst machine',         'Zone A', 2),
    (6, 'Production - above blue board pushers',    'Zone A', 2),
    (7, 'Production - above extract duct',          'Zone A', 2),
    (8, 'Production - above pre production desk',   'Zone A', 2);

  -- Item types (avoid duplicates; one canonical 'Emergency Lighting')
  INSERT OR IGNORE INTO item_types(item_type_id, inspection_category, item_type_label, item_type_description)
  VALUES (1, 'Facility', 'Emergency Lighting', 'General emergency lighting');

  -- Items (use item_description column)
  INSERT OR IGNORE INTO items(item_id, item_type, item_name, item_description, zone_id)
  VALUES (1, 'Emergency Lighting', 'EL-01', 'Twin-head', 1);

  -- Subcheck templates for Emergency Lighting
  INSERT OR IGNORE INTO subcheck_templates
    (sub_template_id, item_type_id, sub_template_label, sub_template_description, value_type, sub_template_mandatory, pass_criteria)
  VALUES
    (1, 1, 'Function test – all luminaires illuminate', 'All luminaires must illuminate', 'boolean', 1, 'true'),
    (2, 1, 'Recharge indicator working',                 'Indicator must light when charging', 'boolean', 1, 'true'),
    (3, 1, 'Labels/ID present and legible',             'IDs must be legible', 'boolean', 0, 'true'),
    (4, 1, 'No visible damage or faults',               'No cracks, burns, etc.', 'boolean', 1, 'true');
`);

console.log("Seeding OK.");
