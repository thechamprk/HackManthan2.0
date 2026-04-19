const express = require('express');
const { z } = require('zod');
const { successResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');
const {
  listProjects,
  createProject,
  generateAiTodoStructure,
  searchGrants,
  continueOnboarding,
  deepSearchSummary
} = require('../services/insights.service');

const router = express.Router();

const createProjectSchema = z.object({
  name: z.string().trim().min(2),
  goal: z.string().trim().min(5),
  owner: z.string().trim().optional(),
  timeline_weeks: z.number().int().min(1).max(52).optional()
});

const todoSchema = z.object({
  project_id: z.string().min(3).optional(),
  context: z.string().max(500).optional()
});

const grantSearchSchema = z.object({
  query: z.string().max(200).optional(),
  stage: z.string().max(50).optional()
});

const onboardingSchema = z.object({
  project_id: z.string().min(3).optional(),
  current_step: z.string().max(100).optional(),
  team_size: z.number().int().min(1).max(100).optional()
});

const deepSearchSchema = z.object({
  query: z.string().trim().min(2),
  limit: z.number().int().min(1).max(20).optional()
});

router.get('/projects', (_req, res) => {
  const projects = listProjects();
  return res.status(HTTP_STATUS.OK).json(successResponse(projects, { count: projects.length }));
});

router.post('/projects', (req, res, next) => {
  try {
    const parsed = createProjectSchema.parse(req.body || {});
    const project = createProject(parsed);
    return res.status(HTTP_STATUS.OK).json(successResponse(project));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Invalid request body',
          details: error.flatten()
        }
      });
    }
    return next(error);
  }
});

router.post('/projects/:projectId/todos/ai', async (req, res, next) => {
  try {
    const parsedBody = todoSchema.parse(req.body || {});
    const projectId = z.string().min(3).parse(req.params?.projectId);
    const result = await generateAiTodoStructure({
      project_id: parsedBody.project_id || projectId,
      context: parsedBody.context
    });
    return res.status(HTTP_STATUS.OK).json(successResponse(result));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Invalid request body',
          details: error.flatten()
        }
      });
    }
    error.statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return next(error);
  }
});

router.post('/grants/search', (req, res, next) => {
  try {
    const parsed = grantSearchSchema.parse(req.body || {});
    const grants = searchGrants(parsed);
    return res.status(HTTP_STATUS.OK).json(successResponse(grants, { count: grants.length }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Invalid request body',
          details: error.flatten()
        }
      });
    }
    return next(error);
  }
});

router.post('/onboarding/continue', (req, res, next) => {
  try {
    const parsed = onboardingSchema.parse(req.body || {});
    const payload = continueOnboarding(parsed);
    return res.status(HTTP_STATUS.OK).json(successResponse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Invalid request body',
          details: error.flatten()
        }
      });
    }
    return next(error);
  }
});

router.post('/search/summary', async (req, res, next) => {
  try {
    const parsed = deepSearchSchema.parse(req.body || {});
    const summary = await deepSearchSummary(parsed);
    return res.status(HTTP_STATUS.OK).json(successResponse(summary));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Invalid request body',
          details: error.flatten()
        }
      });
    }
    error.statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return next(error);
  }
});

module.exports = router;
