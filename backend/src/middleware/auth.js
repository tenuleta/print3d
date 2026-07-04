const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const db = require('../config/db');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env('JWT_SECRET'));
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(payload.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authenticate;
