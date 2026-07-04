require('dotenv').config();

function env(key, fallback) {
  const val = process.env[key];
  if (val === undefined) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var: ${key}`);
  }
  return val;
}

module.exports = { env };
