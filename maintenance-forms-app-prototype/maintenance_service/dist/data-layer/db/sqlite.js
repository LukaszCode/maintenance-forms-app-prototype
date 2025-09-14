/*
    SQLite Database Connection
    This module provides a connection to the SQLite database for the maintenance checks application.

    Author: Lukasz Brzozowski
    Created: 21/07/2025
    Edited: 26/07/2025
            30/07/2025
            02/08/2025
            14/08/2025
            18/08/2025: Added path handling for database file
*/
// maintenance_service/data-layer/db/sqlite.ts
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";
// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// DB file sits next to this file
const dbPath = path.join(__dirname, "maintenance_checks.sqlite");
export const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
