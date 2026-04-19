const { v4: uuidv4 } = require('uuid');
const { retrieve, storeInteraction, normalizeIssueType, buildTags } = require('./hindsight.service');
const { generateResponse } = require('./llm.service');
const { logger } = require('../middleware/logger');
const { MAX_SIMILAR_CASES } = require('../utils/constants');

function summarizeCases(cases) {
  if (!cases.length) {
    return 'No similar past cases found.';
  }

  return cases
    .slice(0, 5)
    .map((item, index) => {
      const effect = typeof item.effectiveness_score === 'number' ? item.effectiveness_score.toFixed(2) : 'n/a';
      return `${index + 1}. Issue: ${item.issue_type || 'general'} | Resolution: ${item.agent_response || 'n/a'} | Effectiveness: ${effect}`;
    })
    .join('\n');
}

function calculateConfidence(similarCases, llmText) {
  const caseQuality = similarCases.length
    ? similarCases.reduce((sum, item) => sum + (item.effectiveness_score || 0.6), 0) / similarCases.length
    : 0.55;

  const lengthScore = Math.min((llmText?.length || 0) / 500, 1);
  const confidence = 0.6 * caseQuality + 0.4 * lengthScore;
  return Math.max(0, Math.min(1, Number(confidence.toFixed(2))));
}

function averageEffectiveness(similarCases) {
  if (!similarCases.length) return 0;
  const value = similarCases.reduce((sum, item) => sum + (item.effectiveness_score || 0), 0) / similarCases.length;
  return Number(value.toFixed(2));
}

function buildSystemPrompt({ similarCases, conversationContext }) {
  const contextText = Array.isArray(conversationContext)
    ? conversationContext
        .slice(-6)
        .map((m) => `${m.role || 'user'}: ${m.content || ''}`)
        .join('\n')
    : 'No prior conversation context.';

  const pastSolutions = summarizeCases(similarCases);

  return [
    'You are HindsightHub Support AI, a calm and precise customer support expert.',
    'Use the past successful patterns when they are relevant, but never fabricate product policies.',
    'Provide actionable steps in clear numbered bullets and include one quick verification question at the end.',
    'Tone: empathetic, concise, solution-first.',
    '',
    'Recent Conversation Context:',
    contextText,
    '',
    'Past Similar Solutions:',
    pastSolutions
  ].join('\n');
}

/**
 * Handles full support-agent learning loop with retrieval, generation, and storage.
 * @param {string} customerId
 * @param {string} message
 * @param {Array<object>} conversationContext
 * @returns {Promise<object>}
 */
async function handleCustomerInquiry(customerId, message, conversationContext = []) {
  const interactionId = `int_${uuidv4()}`;
  const issueType = normalizeIssueType(message);

  let similarCases = [];
  try {
    similarCases = await retrieve(message, MAX_SIMILAR_CASES);
  } catch (error) {
    logger.warn({ message: error.message }, 'failed to retrieve similar cases');
  }

  const systemPrompt = buildSystemPrompt({
    similarCases,
    conversationContext
  });

  const llmResult = await generateResponse(systemPrompt, message, 0.25);
  const agentResponse = llmResult.content;
  const provider = llmResult.provider || 'groq';

  const confidenceScore = calculateConfidence(similarCases, agentResponse);
  const avgEffectiveness = averageEffectiveness(similarCases);
  const patternsApplied = similarCases
    .map((item) => item.issue_type)
    .filter(Boolean)
    .slice(0, 3);

  const interactionRecord = {
    interaction_id: interactionId,
    customer_id: customerId,
    issue_type: issueType,
    customer_message: message,
    agent_response: agentResponse,
    confidence_score: confidenceScore,
    effectiveness_score: avgEffectiveness || confidenceScore,
    timestamp: new Date(),
    tags: buildTags(message),
    metadata: {
      similar_case_count: similarCases.length,
      patterns_applied: patternsApplied,
      conversation_turns: Array.isArray(conversationContext) ? conversationContext.length : 0,
      provider
    }
  };

  await processInteraction(interactionRecord);

  return {
    agent_response: agentResponse,
    confidence_score: confidenceScore,
    similar_past_cases: similarCases.length,
    avg_effectiveness: avgEffectiveness,
    interaction_id: interactionId,
    provider,
    hindsight_memory_used: {
      retrieved_cases: similarCases.slice(0, 5),
      patterns_applied: patternsApplied
    }
  };
}

async function processInteraction(interactionRecord) {
  try {
    await storeInteraction(interactionRecord);
  } catch (error) {
    logger.warn({ message: error.message }, 'failed to store interaction in memory');
  }
}

module.exports = {
  handleCustomerInquiry,
  buildSystemPrompt,
  calculateConfidence,
  averageEffectiveness,
  processInteraction
};
