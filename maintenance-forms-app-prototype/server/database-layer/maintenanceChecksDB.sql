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

