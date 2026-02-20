const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "data", "auth.db");

let db;

const initDB = () => {
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  console.log(`SQLite connected: ${DB_PATH}`);
  return db;
};

const getDB = () => {
  if (!db) throw new Error("Database not initialized. Call initDB() first.");
  return db;
};

module.exports = { initDB, getDB };
