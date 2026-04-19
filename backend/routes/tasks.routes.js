const express = require('express');
const { z } = require('zod');
const { tasks, createId, activity } = require('../data/store');
const { successResponse } = require('../utils/response');

const router = express.Router();

const taskCreateSchema = z.object({
  projectId: z.string().trim().optional(),
  text: z.string().trim().min(1),
  tag: z.string().trim().default('general'),
  dueDate: z.string().datetime().optional(),
  done: z.boolean().optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  estimatedMinutes: z.number().min(1).max(480).optional()
});

const taskPatchSchema = z
  .object({
    projectId: z.string().trim().optional(),
    text: z.string().trim().min(1).optional(),
    tag: z.string().trim().optional(),
    dueDate: z.string().datetime().optional(),
    done: z.boolean().optional(),
    priority: z.enum(['high', 'medium', 'low']).optional(),
    estimatedMinutes: z.number().min(1).max(480).optional()
  })
  .refine((value) => Object.keys(value).length > 0, { message: 'No fields provided to update' });

router.get('/', (req, res) => {
  const projectFilter = req.query.project || req.query.projectId;
  const dateFilter = req.query.date;

  const filtered = tasks.filter((item) => {
    if (projectFilter && item.projectId !== projectFilter) return false;
    if (dateFilter) {
      if (!item.dueDate) return false;
      const date = new Date(item.dueDate);
      if (Number.isNaN(date.getTime())) return false;
      const normalized = date.toISOString().slice(0, 10);
      if (normalized !== dateFilter) return false;
    }
    return true;
  });

  return res.status(200).json(successResponse(filtered));
});

router.post('/', (req, res) => {
  try {
    const parsed = taskCreateSchema.parse(req.body || {});
    const task = {
      id: createId('task'),
      projectId: parsed.projectId || null,
      text: parsed.text,
      tag: parsed.tag,
      dueDate: parsed.dueDate || new Date().toISOString(),
      done: Boolean(parsed.done),
      createdAt: new Date().toISOString(),
      priority: parsed.priority || 'medium',
      estimatedMinutes: parsed.estimatedMinutes || 30
    };

    tasks.unshift(task);
    activity.unshift({
      id: createId('act'),
      text: `Task added: ${task.text}`,
      timestamp: new Date().toISOString()
    });

    return res.status(201).json(successResponse(task));
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
    const updates = taskPatchSchema.parse(req.body || {});
    const index = tasks.findIndex((item) => item.id === req.params.id);

    if (index < 0) {
      return res.status(404).json({ success: false, error: { message: 'Task not found' } });
    }

    tasks[index] = {
      ...tasks[index],
      ...updates
    };

    activity.unshift({
      id: createId('act'),
      text: `Task updated: ${tasks[index].text}`,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json(successResponse(tasks[index]));
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
