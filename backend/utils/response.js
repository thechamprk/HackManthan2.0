function successResponse(data, meta) {
  return {
    success: true,
    data,
    ...(meta ? { meta } : {})
  };
}

function errorResponse(message, details) {
  return {
    success: false,
    error: {
      message,
      ...(details ? { details } : {})
    }
  };
}

module.exports = {
  successResponse,
  errorResponse
};
