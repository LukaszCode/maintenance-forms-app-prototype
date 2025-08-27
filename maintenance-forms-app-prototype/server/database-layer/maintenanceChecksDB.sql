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

CREATE TABLE item_type (
    id INTEGER PRIMARY KEY,
    inspection_category TEXT NOT NULL CHECK (inspection_category IN ('Facility', 'Machine Safety')),
    label TEXT NOT NULL, 
    description TEXT,
    UNIQUE (inspection_category, label)

);

CREATE TABLE item (
    id INTEGER PRIMARY KEY,
    item_type_id INTEGER NOT NULL,
    zone_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    UNIQUE (item_type_id, zone_id, name),
    FOREIGN KEY (item_type_id) REFERENCES item_type(id),
    FOREIGN KEY (zone_id) REFERENCES zone(id)
);

CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Engineer', 'Manager', 'Admin'))
);

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
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (site_id) REFERENCES site(id),
    FOREIGN KEY (zone_id) REFERENCES zone(id),
    FOREIGN KEY (inspector) REFERENCES user(id)
);

