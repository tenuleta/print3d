const app = require('./app');
const { env } = require('./config/env');
const { log } = require('./middleware/logger');

const PORT = env('PORT', 4000);

app.listen(PORT, () => {
  log.info(`Print3D API running on http://localhost:${PORT}`);
});
