const db = require('../config/db');

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function findById(id) {
  return db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(id);
}

function create({ name, email, passwordHash, role = 'customer' }) {
  const result = db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(name, email, passwordHash, role);
  return findById(result.lastInsertRowid);
}

function findAll() {
  return db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all();
}

module.exports = { findByEmail, findById, create, findAll };
