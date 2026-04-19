require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const supportRoutes = require('./routes/support.routes');
const analyticsRoutes = require('./routes/analytics.routes');

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
  app.listen(PORT, () => {
    console.log(`[Server] HindsightHub backend listening on port ${PORT}`);
  });
}

module.exports = app;
