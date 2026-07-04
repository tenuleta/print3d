const db = require('../config/db');

function findAll() {
  return db.prepare('SELECT * FROM materials ORDER BY name, color').all();
}

function findById(id) {
  return db.prepare('SELECT * FROM materials WHERE id = ?').get(id);
}

module.exports = { findAll, findById };
