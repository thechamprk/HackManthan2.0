const express = require('express');
const { z } = require('zod');
const { ensureUserOnboarding } = require('../data/store');
const { successResponse } = require('../utils/response');

const router = express.Router();

const patchSchema = z.object({
  done: z.boolean().optional()
});

router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ success: false, error: { message: 'userId is required' } });
  }

  const items = ensureUserOnboarding(userId);
  return res.status(200).json(successResponse(items));
});

router.patch('/:userId/:itemId', (req, res) => {
  try {
    const userId = req.params.userId;
    const itemId = req.params.itemId;

    if (!userId || !itemId) {
      return res.status(400).json({ success: false, error: { message: 'userId and itemId are required' } });
    }

    const parsed = patchSchema.parse(req.body || {});
    const items = ensureUserOnboarding(userId);
    const target = items.find((item) => item.id === itemId);

    if (!target) {
      return res.status(404).json({ success: false, error: { message: 'Onboarding item not found' } });
    }

    target.done = typeof parsed.done === 'boolean' ? parsed.done : !target.done;

    return res.status(200).json(successResponse(target));
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
