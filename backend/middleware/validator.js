const { z } = require('zod');
const { HTTP_STATUS } = require('../utils/constants');
const { errorResponse } = require('../utils/response');

function validate(schema, source) {
  return (req, res, next) => {
    try {
      req.validated = req.validated || {};
      req.validated[source] = schema.parse(req[source]);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse('Invalid request', error.flatten()));
      }

      return next(error);
    }
  };
}

const validateBody = (schema) => validate(schema, 'body');
const validateParams = (schema) => validate(schema, 'params');
const validateQuery = (schema) => validate(schema, 'query');

module.exports = {
  validateBody,
  validateParams,
  validateQuery
};
