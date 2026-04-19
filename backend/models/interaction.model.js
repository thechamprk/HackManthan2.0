const { z } = require('zod');

const interactionSchema = z.object({
  interaction_id: z.string().min(3),
  customer_id: z.string().min(1),
  issue_type: z.string().min(1),
  customer_message: z.string().min(1),
  agent_response: z.string().min(1),
  effectiveness_score: z.number().min(0).max(1),
  confidence_score: z.number().min(0).max(1).optional(),
  timestamp: z.date(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional()
});

const supportRequestSchema = z.object({
  customer_id: z.string().min(1, 'customer_id is required'),
  message: z.string().trim().min(1, 'message is required').max(4000, 'message too long'),
  conversation_context: z.array(z.record(z.any())).optional()
});

module.exports = {
  interactionSchema,
  supportRequestSchema
};
