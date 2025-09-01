import { db } from "./data-layer/db/sqlite.js";

db.exec(`
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('Engineer', 'Manager', 'Admin')),
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );

    CREATE TABLE IF NOT EXISTS sites (
        site_id INTEGER PRIMARY KEY,
        site_name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS zones (
        zone_id INTEGER PRIMARY KEY,
        zone_name TEXT NOT NULL UNIQUE,
        zone_description TEXT NOT NULL,
        site_id INTEGER NOT NULL REFERENCES sites (site_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS items (
        item_id INTEGER PRIMARY KEY,
        item_type TEXT NOT NULL,
        item_name TEXT NOT NULL,
        description TEXT NOT NULL,
        zone_id INTEGER NOT NULL REFERENCES zones (zone_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inspections (
        inspection_id INTEGER PRIMARY KEY,
        inspection_date TEXT NOT NULL,
        inspection_category TEXT NOT NULL CHECK (inspection_category IN ('Facility','Machine Safety')),
        item_id INTEGER NOT NULL REFERENCES items(item_id),
        inspected_by INTEGER NOT NULL REFERENCES users(user_id),
        site_id INTEGER NOT NULL REFERENCES sites(site_id),
        zone_id INTEGER NOT NULL REFERENCES zones(zone_id),
        comment TEXT
    );

    CREATE TABLE IF NOT EXISTS subchecks (
        subcheck_id INTEGER PRIMARY KEY,
        inspection_id INTEGER NOT NULL REFERENCES inspections(inspection_id) ON DELETE CASCADE,
        subcheck_name TEXT NOT NULL,
        description TEXT NOT NULL,
        value_type TEXT NOT NULL CHECK (value_type IN ('string', 'number', 'boolean')),
        pass_criteria TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('Pass', 'Fail', 'NA'))
    );
`);

console.log("Database migration completed successfully.");
