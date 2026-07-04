const db = require('../config/db');

function create({ userId, filename, materialId, quality, infill, color, volumeCm3, quoteCents }) {
  const result = db.prepare(
    `INSERT INTO orders (user_id, filename, material_id, quality, infill, color, volume_cm3, quote_cents)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(userId, filename, materialId, quality, infill, color, volumeCm3, quoteCents);
  return findById(result.lastInsertRowid);
}

function findById(id) {
  return db.prepare(`
    SELECT o.*, m.name AS material_name, m.color AS material_color
    FROM orders o
    JOIN materials m ON o.material_id = m.id
    WHERE o.id = ?
  `).get(id);
}

function findByUserId(userId) {
  return db.prepare(`
    SELECT o.*, m.name AS material_name, m.color AS material_color
    FROM orders o
    JOIN materials m ON o.material_id = m.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `).all(userId);
}

function findAll() {
  return db.prepare(`
    SELECT o.*, u.name AS user_name, u.email AS user_email,
           m.name AS material_name, m.color AS material_color
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN materials m ON o.material_id = m.id
    ORDER BY o.created_at DESC
  `).all();
}

function updateStatus(id, status) {
  db.prepare(
    "UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(status, id);
  return findById(id);
}

module.exports = { create, findById, findByUserId, findAll, updateStatus };
