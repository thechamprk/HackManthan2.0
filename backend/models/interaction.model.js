const { z } = require('zod');
const { MAX_MESSAGE_LENGTH } = require('../utils/constants');

const interactionSchema = z.object({
  interaction_id: z.string().min(3),
  customer_id: z.string().min(1),
  issue_type: z.string().min(1),
  customer_message: z.string().min(1),
  message: z.string().min(1).optional(),
  agent_response: z.string().min(1),
  response: z.string().min(1).optional(),
  effectiveness_score: z.number().min(0).max(1),
  confidence_score: z.number().min(0).max(1).optional(),
  timestamp: z.union([z.date(), z.string()]),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional()
});

const supportRequestSchema = z.object({
  customer_id: z.string().min(1, 'customer_id is required'),
  message: z.string().trim().min(1, 'message is required').max(MAX_MESSAGE_LENGTH, 'message too long'),
  conversation_context: z
    .array(
      z.object({
        role: z.string().optional(),
        content: z.string().optional()
      })
    )
    .optional()
});

module.exports = {
  interactionSchema,
  supportRequestSchema
};
