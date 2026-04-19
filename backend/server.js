const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const supportRoutes = require('./routes/support.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const insightsRoutes = require('./routes/insights.routes');

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
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'HindsightHub backend is running',
    health: '/health'
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    environment: NODE_ENV
  });
});

app.use('/api/support', supportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/insights', insightsRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`
    }
  });
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isDev = NODE_ENV !== 'production';

  if (isDev) {
    console.error('[GlobalErrorHandler]', {
      message: err.message,
      stack: err.stack,
      statusCode
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.publicMessage || err.message || 'Internal server error',
      ...(isDev ? { details: err.stack } : {})
    }
  });
});

if (require.main === module) {
  const MAX_PORT_TRIES = 10;

  function startServer(startPort, attempt = 0) {
    const targetPort = startPort + attempt;
    const server = app.listen(targetPort, () => {
      console.log(`[Server] HindsightHub backend listening on port ${targetPort}`);
      if (targetPort !== PORT) {
        console.log(`[Server] Default port ${PORT} was busy, using ${targetPort} instead.`);
      }
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_TRIES) {
        console.warn(`[Server] Port ${targetPort} is in use. Trying ${targetPort + 1}...`);
        startServer(startPort, attempt + 1);
        return;
      }

      if (error.code === 'EADDRINUSE') {
        console.error(`[Server] Failed to bind after ${MAX_PORT_TRIES + 1} attempts starting at ${PORT}.`);
      }

      throw error;
    });
  }

  startServer(PORT);
}

module.exports = app;
