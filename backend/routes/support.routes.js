const express = require('express');
const { z } = require('zod');
const { handleCustomerInquiry } = require('../services/agent.service');
const { updateEffectiveness } = require('../services/hindsight.service');
const { supportRequestSchema } = require('../models/interaction.model');

const router = express.Router();
const effectivenessUpdateSchema = z.object({
  effectiveness_score: z.number().min(0).max(1)
});

function sanitizeMessage(input) {
  return String(input || '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

router.post('/', async (req, res, next) => {
  try {
    const parsed = supportRequestSchema.parse({
      ...req.body,
      message: sanitizeMessage(req.body?.message)
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('[SupportRoute] Incoming support request', {
        customer_id: parsed.customer_id,
        message_preview: parsed.message.slice(0, 80)
      });
    }

    const result = await handleCustomerInquiry(
      parsed.customer_id,
      parsed.message,
      parsed.conversation_context || []
    );

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid request body',
          details: error.flatten()
        }
      });
    }

    error.statusCode = error.statusCode || 500;
    return next(error);
  }
});

router.put('/:interactionId/effectiveness', async (req, res, next) => {
  try {
    const interactionId = z.string().min(3, 'interactionId is required').parse(req.params?.interactionId);
    const parsedBody = effectivenessUpdateSchema.parse(req.body);

    await updateEffectiveness(interactionId, parsedBody.effectiveness_score);

    return res.status(200).json({
      success: true,
      data: {
        interaction_id: interactionId,
        effectiveness_score: parsedBody.effectiveness_score
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid request',
          details: error.flatten()
        }
      });
    }

    error.statusCode = error.statusCode || 500;
    return next(error);
  }
});

module.exports = router;
