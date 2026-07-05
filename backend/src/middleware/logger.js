const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', '..', 'app.log');

function writeLog(level, message, meta) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    message,
    ...(meta || {}),
  });
  console[level === 'error' ? 'error' : 'log'](line);
  fs.appendFile(logFilePath, line + '\n', () => {});
}

const log = {
  info: (msg, meta) => writeLog('info', msg, meta),
  warn: (msg, meta) => writeLog('warn', msg, meta),
  error: (msg, meta) => writeLog('error', msg, meta),
};

function reqLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    log.info(`${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      ms: Date.now() - start,
      ip: req.ip,
    });
  });
  next();
}

module.exports = { log, reqLogger };
