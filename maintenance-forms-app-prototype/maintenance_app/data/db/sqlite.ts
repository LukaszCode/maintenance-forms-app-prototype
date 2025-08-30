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

import * as SQLite from "expo-sqlite";

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync("maintenance_checks.db");
  await db.execAsync("PRAGMA foreign_keys=ON;");
  await migrate(db);
  return db;
}

async function migrate(db: SQLite.SQLiteDatabase) {
  // Check the user_version pragma to determine the current schema version
  
  }
}
