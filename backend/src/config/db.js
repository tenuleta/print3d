const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { env } = require('./env');

const DB_PATH = path.resolve(__dirname, '..', '..', env('DB_PATH', './db/print3d.sqlite'));

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;
