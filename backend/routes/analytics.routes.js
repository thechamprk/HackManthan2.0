const express = require('express');
const { z } = require('zod');
const { listInteractions } = require('../services/hindsight.service');
const {
  calculateDashboardMetrics,
  calculateDetailedMetrics
} = require('../services/analytics.service');
const { validateQuery } = require('../middleware/validator');
const { successResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

const router = express.Router();
const interactionsQuerySchema = z.object({
  customer_id: z.string().optional(),
  issue_type: z.string().optional(),
  query: z.string().optional(),
  limit: z.string().optional()
});

router.get('/dashboard', async (req, res, next) => {
  try {
    const interactions = await listInteractions({ limit: 500 });
    const metrics = calculateDashboardMetrics(interactions);

    res.status(HTTP_STATUS.OK).json(successResponse(metrics));
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
});

router.get('/interactions', validateQuery(interactionsQuerySchema), async (req, res, next) => {
  try {
    const { customer_id, issue_type, query, limit } = req.validated.query;
    const interactions = await listInteractions({ customer_id, issue_type, query, limit });

    res.status(HTTP_STATUS.OK).json(successResponse(interactions, { count: interactions.length }));
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
});

router.get('/metrics', async (_req, res, next) => {
  try {
    const interactions = await listInteractions({ limit: 1000 });
    const detailed = calculateDetailedMetrics(interactions);

    res.status(HTTP_STATUS.OK).json(successResponse(detailed));
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
});

module.exports = router;
