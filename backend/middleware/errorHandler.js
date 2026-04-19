const { HTTP_STATUS } = require('../utils/constants');
const { errorResponse } = require('../utils/response');
const { logger } = require('./logger');

function notFoundHandler(req, res) {
  return res
    .status(HTTP_STATUS.NOT_FOUND)
    .json(errorResponse(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isDev = (process.env.NODE_ENV || 'development') !== 'production';

  logger.error(
    {
      statusCode,
      path: req.originalUrl,
      method: req.method,
      requestId: req.requestId,
      message: err.message,
      stack: err.stack
    },
    'request failed'
  );

  return res.status(statusCode).json(
    errorResponse(
      err.publicMessage || err.message || 'Internal server error',
      isDev ? err.stack : undefined,
      statusCode
    )
  );
}

module.exports = {
  notFoundHandler,
  errorHandler
};
