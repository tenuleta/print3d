const db = require('../src/config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

const { log } = require('../src/middleware/logger');

const hash = bcrypt.hashSync('admin123', 10);
const hash2 = bcrypt.hashSync('customer123', 10);

db.prepare('INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run('Admin', 'admin@print3d.com', hash, 'admin');
db.prepare('INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run('Demo Customer', 'customer@print3d.com', hash2, 'customer');

const materials = [
  { name: 'PLA', color: 'White', price_per_cm3: 5 },
  { name: 'PLA', color: 'Black', price_per_cm3: 5 },
  { name: 'ABS', color: 'White', price_per_cm3: 7 },
  { name: 'ABS', color: 'Black', price_per_cm3: 7 },
  { name: 'PETG', color: 'Transparent', price_per_cm3: 6 },
  { name: 'Resin', color: 'Gray', price_per_cm3: 12 },
];

const insertMat = db.prepare('INSERT OR IGNORE INTO materials (name, color, price_per_cm3) VALUES (?, ?, ?)');
for (const m of materials) {
  insertMat.run(m.name, m.color, m.price_per_cm3);
}

log.info('Database seeded: 2 users, ' + materials.length + ' materials.');
log.info('  Admin: admin@print3d.com / admin123');
log.info('  Customer: customer@print3d.com / customer123');

process.exit(0);
