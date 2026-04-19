const express = require('express');
const { z } = require('zod');
const { handleCustomerInquiry } = require('../services/agent.service');
const { updateEffectiveness } = require('../services/hindsight.service');
const { supportRequestSchema } = require('../models/interaction.model');
const { validateBody, validateParams } = require('../middleware/validator');
const { successResponse, errorResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');
const { logger } = require('../middleware/logger');

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

router.post('/', validateBody(supportRequestSchema), async (req, res, next) => {
  try {
    const parsed = {
      ...req.validated.body,
      message: sanitizeMessage(req.validated.body?.message)
    };

    logger.info(
      {
        customer_id: parsed.customer_id,
        message_preview: parsed.message.slice(0, 80)
      },
      'incoming support request'
    );

    const result = await handleCustomerInquiry(
      parsed.customer_id,
      parsed.message,
      parsed.conversation_context || []
    );

    return res.status(HTTP_STATUS.OK).json(successResponse(result));
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    return next(error);
  }
});

router.put(
  '/:interactionId/effectiveness',
  validateParams(
    z.object({
      interactionId: z.string().min(3, 'interactionId is required')
    })
  ),
  validateBody(effectivenessUpdateSchema),
  async (req, res, next) => {
  try {
    const interactionId = req.validated.params.interactionId;
    const parsedBody = req.validated.body;

    await updateEffectiveness(interactionId, parsedBody.effectiveness_score);

    return res.status(HTTP_STATUS.OK).json(
      successResponse({
        interaction_id: interactionId,
        effectiveness_score: parsedBody.effectiveness_score
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Invalid request', error.flatten()));
    }

    error.statusCode = error.statusCode || 500;
    return next(error);
  }
}
);

module.exports = router;
