const express = require('express');
const { z } = require('zod');
const NodeCache = require('node-cache');
const { listInteractions } = require('../services/hindsight.service');
const {
  getDashboardMetrics,
  calculateDetailedMetrics
} = require('../services/analytics.service');
const { validateQuery } = require('../middleware/validator');
const { successResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

const router = express.Router();
const analyticsCache = new NodeCache({
  stdTTL: Number(process.env.ANALYTICS_CACHE_TTL_SECONDS) || 20,
  checkperiod: 30
});

const DASHBOARD_LIMIT = Number(process.env.ANALYTICS_DASHBOARD_LIMIT) || 200;
const METRICS_LIMIT = Number(process.env.ANALYTICS_METRICS_LIMIT) || 300;

const interactionsQuerySchema = z.object({
  customer_id: z.string().optional(),
  issue_type: z.string().optional(),
  query: z.string().optional(),
  limit: z.string().optional()
});

router.get('/dashboard', async (req, res, next) => {
  try {
    const cacheKey = `dashboard:${DASHBOARD_LIMIT}`;
    const cached = analyticsCache.get(cacheKey);

    if (cached) {
      return res.status(HTTP_STATUS.OK).json(successResponse(cached));
    }

    const interactions = await listInteractions({ limit: DASHBOARD_LIMIT });
    const metrics = getDashboardMetrics(interactions);
    analyticsCache.set(cacheKey, metrics);

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
    const cacheKey = `metrics:${METRICS_LIMIT}`;
    const cached = analyticsCache.get(cacheKey);

    if (cached) {
      return res.status(HTTP_STATUS.OK).json(successResponse(cached));
    }

    const interactions = await listInteractions({ limit: METRICS_LIMIT });
    const detailed = calculateDetailedMetrics(interactions);
    analyticsCache.set(cacheKey, detailed);

    res.status(HTTP_STATUS.OK).json(successResponse(detailed));
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
});

module.exports = router;
