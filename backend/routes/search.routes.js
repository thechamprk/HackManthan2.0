const express = require('express');
const { z } = require('zod');
const { projects, tasks, grantsDataset, activity, milestones } = require('../data/store');
const { successResponse } = require('../utils/response');

const router = express.Router();

const querySchema = z.object({
  q: z.string().trim().min(1),
  type: z.enum(['all', 'projects', 'tasks', 'grants', 'ai']).default('all')
});

function includesQuery(value, query) {
  return String(value || '').toLowerCase().includes(query.toLowerCase());
}

router.get('/', (req, res) => {
  try {
    const parsed = querySchema.parse({
      q: req.query.q,
      type: req.query.type || 'all'
    });

    const { q, type } = parsed;
    const results = [];

    if (type === 'all' || type === 'projects') {
      projects.forEach((item) => {
        if (includesQuery(item.name, q) || includesQuery(item.description, q) || includesQuery(item.tag, q)) {
          results.push({
            id: item.id,
            type: 'projects',
            icon: '📁',
            title: item.name,
            snippet: item.description,
            source: 'Project Hub',
            timestamp: item.createdAt
          });
        }
      });
    }

    if (type === 'all' || type === 'tasks') {
      tasks.forEach((item) => {
        if (includesQuery(item.text, q) || includesQuery(item.tag, q)) {
          results.push({
            id: item.id,
            type: 'tasks',
            icon: '✅',
            title: item.text,
            snippet: `Priority: ${item.priority || 'medium'} • Tag: ${item.tag}`,
            source: 'Task Engine',
            timestamp: item.createdAt
          });
        }
      });
    }

    if (type === 'all' || type === 'grants') {
      grantsDataset.forEach((item) => {
        if (includesQuery(item.name, q) || includesQuery(item.description, q) || includesQuery(item.organization, q)) {
          results.push({
            id: item.id,
            type: 'grants',
            icon: '🎯',
            title: item.name,
            snippet: item.description,
            source: item.organization,
            timestamp: item.deadline
          });
        }
      });
    }

    if (type === 'all' || type === 'ai') {
      [...activity, ...milestones].forEach((item) => {
        const text = item.text || item.title;
        if (includesQuery(text, q)) {
          results.push({
            id: item.id,
            type: 'ai',
            icon: '🤖',
            title: text,
            snippet: 'AI Insight generated from project activity trends.',
            source: 'AI Insights',
            timestamp: item.timestamp || item.dueDate
          });
        }
      });
    }

    return res.status(200).json(successResponse(results));
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: error?.errors?.[0]?.message || error.message || 'Invalid query parameters'
      }
    });
  }
});

module.exports = router;
