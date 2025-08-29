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

export async function openDB(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync("maintenance_checks.db");
  await db.execAsync("PRAGMA foreign_keys=ON;");
  await migrate(db);
  return db;
}

async function migrate(db: SQLite.SQLiteDatabase) {
  // Check the user_version pragma to determine the current schema version
  const [{ user_version }] = (await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;"
  )) ?? [{ user_version: 0 }];
  if (user_version < 1) {
    await db.execAsync("PRAGMA user_version = 1;");
  }
}
