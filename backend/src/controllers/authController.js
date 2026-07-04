const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');
const { env } = require('../config/env');
const { log } = require('../middleware/logger');

function generateAccessToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, env('JWT_SECRET'), { expiresIn: '1h' });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = userModel.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = userModel.create({ name, email, passwordHash, role: 'customer' });
    log.info(`User registered: ${email}`);

    const accessToken = generateAccessToken(user);
    const refreshToken = refreshTokenModel.create(user.id);

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = userModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    log.info(`User logged in: ${email}`);

    const accessToken = generateAccessToken(user);
    const refreshToken = refreshTokenModel.create(user.id);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) { next(err); }
};

exports.refresh = (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    const stored = refreshTokenModel.findByToken(refreshToken);
    if (!stored || new Date(stored.expires_at) < new Date()) {
      if (stored) refreshTokenModel.deleteByToken(refreshToken);
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = userModel.findById(stored.user_id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    refreshTokenModel.deleteByToken(refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = refreshTokenModel.create(user.id);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    });
  } catch (err) { next(err); }
};

exports.logout = (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) refreshTokenModel.deleteByToken(refreshToken);
    res.json({ message: 'Logged out' });
  } catch (err) { next(err); }
};
