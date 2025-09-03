// maintenance_service/seed.ts
import { db } from "./data-layer/db/sqlite.js";

db.exec("PRAGMA foreign_keys=ON;");

// 1) Users (log in with this full name in the app)
db.prepare(`
  INSERT OR IGNORE INTO users (user_id, username, full_name, role, email)
  VALUES (1,'demo','Demo Engineer','Engineer','demo@example.com')
`).run();

// 2) Site + Zone
db.prepare(`INSERT OR IGNORE INTO sites (site_id, site_name) VALUES (1,'HQ')`).run();
db.prepare(`
  INSERT OR IGNORE INTO zones (zone_id, zone_name, zone_description, site_id)
  VALUES (1,'Warehouse A','Main warehouse area',1)
`).run();

// 3) Item Type for Facility (Option A stores TEXT label in items.item_type)
db.prepare(`
  INSERT OR IGNORE INTO item_types (item_type_id, inspection_category, item_type_label, item_type_description)
  VALUES (1,'Facility','Emergency Lights','Monthly EL test')
`).run();

// 4) Items (note: item_type is TEXT label and must match item_types.item_type_label)
db.prepare(`
  INSERT OR IGNORE INTO items (item_id, item_type, item_name, description, zone_id)
  VALUES (1,'Emergency Lights','EL-01','Twin-head near exit 1',1)
`).run();

// 5) Subcheck templates for that item type
const subchecks = [
  ['Function test – all luminaires illuminate','Quick push test', 'boolean', 1, 'Illuminate on test'],
  ['Recharge indicator working','LED is visible and steady', 'boolean', 0, 'Indicator OK'],
  ['Labels/ID present and legible','Asset label readable', 'boolean', 0, 'Label present'],
  ['No visible damage or faults','Housing intact, cables tidy', 'boolean', 0, 'No damage'],
] as const;

for (const [label, desc, vt, mandatory, pass] of subchecks) {
  db.prepare(`
    INSERT OR IGNORE INTO subcheck_templates
      (sub_template_id, item_type_id, sub_template_label, sub_template_description, value_type, sub_template_mandatory, pass_criteria)
    VALUES (NULL, 1, ?, ?, ?, ?, ?)
  `).run(label, desc, vt, mandatory, pass);
}

console.log("Seed OK.");
