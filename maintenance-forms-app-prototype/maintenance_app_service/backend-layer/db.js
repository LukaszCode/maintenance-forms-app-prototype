/*
    This module handles the database connection for the maintenance checks application.
    The file provides a socket connection to the SQLite database.
*/

const Database = require("better-sqlite3");
const db = new Database("../database-layer/maintenanceChecksDB.sqlite");

db.pragma("foreign_keys = ON");

module.exports = db;
