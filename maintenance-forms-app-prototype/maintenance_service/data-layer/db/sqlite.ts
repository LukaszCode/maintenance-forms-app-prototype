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
import type { Database as BetterSqlite3Database } from "better-sqlite3";

/**
 * ESM-safe __dirname
 * It allows us to construct paths relative to the current module.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "maintenance_checks.sqlite");

// Export a nameable type alias
export type SqliteDb = BetterSqlite3Database;

// This cast keeps runtime correct while giving a nameable exported type
export const db: SqliteDb = new (Database as any)(dbPath);

