const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const supportRoutes = require('./routes/support.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const { requestLogger, logger } = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: false
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'hindsighthub-backend',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

app.use('/api/support', supportRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  const MAX_PORT_TRIES = 10;

  const startServer = (startPort, attempt = 0) => {
    const targetPort = startPort + attempt;
    const server = app.listen(targetPort, () => {
      logger.info({ port: targetPort }, 'backend listening');
      if (targetPort !== PORT) {
        logger.warn({ defaultPort: PORT, activePort: targetPort }, 'default port busy');
      }
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_TRIES) {
        logger.warn({ busyPort: targetPort, nextPort: targetPort + 1 }, 'port in use');
        startServer(startPort, attempt + 1);
        return;
      }

      if (error.code === 'EADDRINUSE') {
        logger.error({ retries: MAX_PORT_TRIES + 1, startPort: PORT }, 'failed to bind to port');
      }

      throw error;
    });
  };

  startServer(PORT);
}

module.exports = app;
