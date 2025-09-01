/*
    SQLite Database Connection
    This module provides a connection to the SQLite database for the maintenance checks application.

    Author: Lukasz Brzozowski
    Created: 21/07/2025
    Edited: 26/07/2025
            30/07/2025
            02/08/2025
            14/08/2025
*/

import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.join(
  process.cwd(), 
  "maintenance_service", 
  "data-layer", "db", 
  "maintenance_checks.sqlite"
);

let db;

try {
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");

} catch (error) {
  console.error("Error connecting to the database:", error);
  process.exit(1);
}
