const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_DIR = path.join(__dirname, "..", "..", "data");
const DB_PATH = path.join(DB_DIR, "auth.db");

let db;

const initDB = () => {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

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
