const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

function create(userId, expiresInDays = 7) {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)'
  ).run(userId, token, expiresAt);
  return { token, expires_at: expiresAt };
}

function findByToken(token) {
  return db.prepare(
    'SELECT rt.*, u.role FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token = ?'
  ).get(token);
}

function deleteByToken(token) {
  db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
}

function deleteByUserId(userId) {
  db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
}

module.exports = { create, findByToken, deleteByToken, deleteByUserId };
