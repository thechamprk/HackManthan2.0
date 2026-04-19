function successResponse(data, meta) {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {})
  };
}

function errorResponse(message, details, statusCode) {
  return {
    success: false,
    statusCode: statusCode || undefined,
    error: {
      message,
      ...(details ? { details } : {})
    },
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  successResponse,
  errorResponse,
  success: successResponse,
  error: errorResponse
};
