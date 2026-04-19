const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    service: 'hindsight-expert-backend'
  }
});

function requestLogger(req, res, next) {
  const start = Date.now();
  req.log = logger.child({
    method: req.method,
    path: req.originalUrl
  });

  res.on('finish', () => {
    req.log.info({
      statusCode: res.statusCode,
      durationMs: Date.now() - start
    }, 'request completed');
  });

  next();
}

module.exports = {
  logger,
  requestLogger
};
