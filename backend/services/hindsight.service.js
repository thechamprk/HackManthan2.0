const NodeCache = require('node-cache');
const { getHindsightInstance } = require('../config/hindsight');
const { interactionSchema } = require('../models/interaction.model');
const { logger } = require('../middleware/logger');
const { HINDSIGHT_CONTEXT_ID, MAX_SIMILAR_CASES } = require('../utils/constants');

const hindsight = getHindsightInstance();
const memoryCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
const CONTEXT_ID = HINDSIGHT_CONTEXT_ID;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeIssueType(message = '') {
  const lower = message.toLowerCase();
  if (lower.includes('password')) return 'password_reset';
  if (lower.includes('billing') || lower.includes('invoice') || lower.includes('payment')) return 'billing';
  if (lower.includes('login') || lower.includes('sign in')) return 'login_issue';
  if (lower.includes('error') || lower.includes('bug')) return 'technical_error';
  return 'general_support';
}

function buildTags(message = '') {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 8);
}

function normalizeInteractionRecord(item = {}) {
  const messageSource = item.customer_message || item.text || '';
  const responseSource = item.agent_response || item.summary || '';
  const derivedIssue = item.issue_type || normalizeIssueType(messageSource);

  return {
    interaction_id: item.interaction_id || item.id || `derived_${Date.now()}`,
    customer_id: item.customer_id || item.user_id || 'unknown_customer',
    issue_type: derivedIssue || 'general_support',
    customer_message: messageSource,
    agent_response: responseSource,
    confidence_score: typeof item.confidence_score === 'number' ? item.confidence_score : 0,
    effectiveness_score: typeof item.effectiveness_score === 'number' ? item.effectiveness_score : 0,
    timestamp: item.timestamp || item.mentioned_at || new Date().toISOString(),
    tags: Array.isArray(item.tags) ? item.tags : buildTags(messageSource),
    metadata: item.metadata || {}
  };
}

async function withRetry(action, maxRetries = 3) {
  function isKnownInfraCapacityError(error) {
    const text = String(error?.message || '').toLowerCase();
    return text.includes('out of shared memory') || text.includes('max_locks_per_transaction');
  }

  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      const finalAttempt = attempt >= maxRetries - 1;
      const retryable =
        (!error.statusCode || error.statusCode >= 500 || error.name === 'AbortError') &&
        !isKnownInfraCapacityError(error);

      if (finalAttempt || !retryable) {
        throw error;
      }

      const delayMs = 200 * Math.pow(2, attempt);
      logger.warn({ attempt: attempt + 1, maxRetries, message: error.message }, 'retrying hindsight request');
      await sleep(delayMs);
    }
  }
}

/**
 * Stores a support interaction in Hindsight memory.
 * @param {object} data
 * @returns {Promise<object>}
 */
async function storeInteraction(data) {
  const enrichedData = {
    ...data,
    issue_type: data.issue_type || normalizeIssueType(data.customer_message),
    tags: data.tags?.length ? data.tags : buildTags(data.customer_message),
    timestamp: data.timestamp || new Date()
  };

  interactionSchema.parse(enrichedData);

  const payload = {
    context_id: CONTEXT_ID,
    data: enrichedData
  };

  try {
    const stored = await withRetry(() => hindsight.store(payload));

    logger.info(
      {
        interaction_id: enrichedData.interaction_id,
        issue_type: enrichedData.issue_type
      },
      'stored interaction'
    );

    memoryCache.del(`analytics:all`);
    return stored;
  } catch (err) {
    logger.warn({ message: err.message }, 'store failed, continuing without memory');
    return { id: enrichedData.interaction_id || `mock_${Date.now()}`, source: 'fallback' };
  }
}

/**
 * Retrieves similar historical interactions from Hindsight memory.
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<Array<object>>}
 */
async function retrieve(query, limit = MAX_SIMILAR_CASES) {
  const cacheKey = `retrieve:${query}:${limit}`;
  const cached = memoryCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const results = await withRetry(() =>
      hindsight.retrieve({
        query,
        context_id: CONTEXT_ID,
        limit
      })
    );

    const normalizedResults = Array.isArray(results?.results)
      ? results.results.map((entry) => entry.data || entry)
      : [];

    memoryCache.set(cacheKey, normalizedResults, 30);
    return normalizedResults;
  } catch (err) {
    logger.warn({ message: err.message }, 'recall failed, continuing without memory');
    return [];
  }
}

/**
 * Updates effectiveness score for a stored interaction.
 * @param {string} interactionId
 * @param {number} effectivenessScore
 * @returns {Promise<object>}
 */
async function updateEffectiveness(interactionId, effectivenessScore) {
  if (!interactionId) {
    throw new Error('interactionId is required');
  }

  if (Number.isNaN(effectivenessScore) || effectivenessScore < 0 || effectivenessScore > 1) {
    throw new Error('effectivenessScore must be a number between 0 and 1');
  }

  const result = await withRetry(() =>
    hindsight.update({
      id: interactionId,
      data: {
        effectiveness_score: effectivenessScore,
        updated_at: new Date().toISOString()
      }
    })
  );

  memoryCache.del(`analytics:all`);
  return result;
}

/**
 * Retrieves interactions for analytics and debugging.
 * @param {object} filters
 * @returns {Promise<Array<object>>}
 */
async function listInteractions(filters = {}) {
  const limit = Number(filters.limit) || 100;
  const query = filters.query || 'support interaction history';

  const all = (await retrieve(query, limit)).map(normalizeInteractionRecord);

  return all.filter((item) => {
    if (filters.customer_id && item.customer_id !== filters.customer_id) return false;
    if (filters.issue_type && item.issue_type !== filters.issue_type) return false;
    return true;
  });
}

async function getMetrics() {
  const interactions = await listInteractions({ limit: 500 });

  const totals = interactions.reduce(
    (acc, item) => {
      acc.total_interactions += 1;
      acc.total_effectiveness += Number(item.effectiveness_score) || 0;
      const issueType = item.issue_type || 'general_support';
      acc.by_issue_type[issueType] = (acc.by_issue_type[issueType] || 0) + 1;
      return acc;
    },
    {
      total_interactions: 0,
      total_effectiveness: 0,
      by_issue_type: {}
    }
  );

  return {
    total_interactions: totals.total_interactions,
    average_effectiveness:
      totals.total_interactions > 0
        ? Number((totals.total_effectiveness / totals.total_interactions).toFixed(2))
        : 0,
    by_issue_type: totals.by_issue_type
  };
}

module.exports = {
  storeInteraction,
  retrieve,
  updateEffectiveness,
  listInteractions,
  getMetrics,
  normalizeIssueType,
  buildTags
};
