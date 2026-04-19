const { z } = require('zod');

function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.query || {});
      req.validated = req.validated || {};
      req.validated.query = parsed;
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid query parameters',
            details: error.flatten()
          }
        });
      }

      return next(error);
    }
  };
}

module.exports = {
  validateQuery
};
