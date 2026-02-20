const bcrypt = require("bcryptjs");
const { getDB } = require("../config/db");

const SALT_ROUNDS = 12;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const findByEmail = (email) => {
  const db = getDB();
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
};

const findById = (id) => {
  const db = getDB();
  return db.prepare("SELECT id, email, created_at FROM users WHERE id = ?").get(id);
};

const create = async (email, plainPassword) => {
  const normalizedEmail = email.toLowerCase().trim();

  if (!normalizedEmail) throw { statusCode: 400, message: "Email is required." };
  if (!EMAIL_REGEX.test(normalizedEmail)) throw { statusCode: 400, message: "Please provide a valid email address." };
  if (!plainPassword || plainPassword.length < 6) throw { statusCode: 400, message: "Password must be at least 6 characters." };

  const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

  const db = getDB();
  const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  const result = stmt.run(normalizedEmail, hashedPassword);

  return { id: result.lastInsertRowid, email: normalizedEmail, created_at: new Date().toISOString() };
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const sanitize = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

module.exports = { findByEmail, findById, create, comparePassword, sanitize };
