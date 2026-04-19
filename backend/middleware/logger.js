const pino = require('pino');
const { randomUUID } = require('crypto');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    service: 'hindsight-expert-backend'
  }
});

function requestLogger(req, res, next) {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || randomUUID();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  req.log = logger.child({
    requestId,
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
