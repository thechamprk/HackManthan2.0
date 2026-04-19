const express = require('express');
const { z } = require('zod');
const { projects, createId, activity } = require('../data/store');
const { successResponse } = require('../utils/response');

const router = express.Router();
const DEFAULT_PROJECT_DURATION_DAYS = 14;
const DAY_MS = 1000 * 60 * 60 * 24;

const projectCreateSchema = z.object({
  name: z.string().trim().min(1),
  tag: z.string().trim().default('general'),
  description: z.string().trim().min(1),
  status: z.enum(['active', 'review', 'planning', 'blocked']).default('planning'),
  progress: z.number().min(0).max(100).default(0),
  team: z.array(z.string().trim()).default([]),
  dueDate: z.string().datetime().optional(),
  color: z.string().optional()
});

const projectPatchSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    tag: z.string().trim().optional(),
    description: z.string().trim().min(1).optional(),
    status: z.enum(['active', 'review', 'planning', 'blocked']).optional(),
    progress: z.number().min(0).max(100).optional(),
    team: z.array(z.string().trim()).optional(),
    dueDate: z.string().datetime().optional(),
    color: z.string().optional()
  })
  .refine((value) => Object.keys(value).length > 0, { message: 'No fields provided to update' });

router.get('/', (_req, res) => {
  const stats = {
    totalProjects: projects.length,
    inProgress: projects.filter((item) => item.status === 'active').length,
    blocked: projects.filter((item) => item.status === 'blocked').length
  };

  return res.status(200).json(successResponse({ projects, stats }));
});

router.post('/', (req, res) => {
  try {
    const parsed = projectCreateSchema.parse(req.body || {});
    const project = {
      id: createId('proj'),
      ...parsed,
      dueDate: parsed.dueDate || new Date(Date.now() + DAY_MS * DEFAULT_PROJECT_DURATION_DAYS).toISOString(),
      color:
        parsed.color ||
        {
          active: '#4caf82',
          review: '#e8a84c',
          planning: '#a3c4e8',
          blocked: '#e86060'
        }[parsed.status],
      createdAt: new Date().toISOString()
    };

    projects.unshift(project);
    activity.unshift({
      id: createId('act'),
      text: `New project created: ${project.name}`,
      timestamp: new Date().toISOString()
    });

    return res.status(201).json(successResponse(project));
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: error?.errors?.[0]?.message || error.message || 'Invalid request body'
      }
    });
  }
});

router.patch('/:id', (req, res) => {
  try {
    const updates = projectPatchSchema.parse(req.body || {});
    const index = projects.findIndex((item) => item.id === req.params.id);

    if (index < 0) {
      return res.status(404).json({ success: false, error: { message: 'Project not found' } });
    }

    projects[index] = {
      ...projects[index],
      ...updates
    };

    activity.unshift({
      id: createId('act'),
      text: `Project updated: ${projects[index].name}`,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json(successResponse(projects[index]));
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: error?.errors?.[0]?.message || error.message || 'Invalid request body'
      }
    });
  }
});

module.exports = router;
