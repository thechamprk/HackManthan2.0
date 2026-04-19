const Groq = require('groq-sdk');
const { logger } = require('../middleware/logger');

const DEFAULT_MAX_RETRIES = 3;

function createGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    logger.warn('GROQ_API_KEY missing, running in fallback mode');
    return null;
  }

  return new Groq({ apiKey });
}

async function withGroqRetry(action, maxRetries = DEFAULT_MAX_RETRIES) {
  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      const status = error.status || error.statusCode;
      const retryable = status === 429 || status >= 500 || error.name === 'AbortError';
      const finalAttempt = attempt >= maxRetries - 1;

      if (!retryable || finalAttempt) {
        throw error;
      }

      logger.warn({ attempt: attempt + 1, status, message: error.message }, 'retrying groq request');
      await new Promise((resolve) => setTimeout(resolve, 250 * Math.pow(2, attempt)));
    }
  }

  return null;
}

module.exports = {
  createGroqClient,
  withGroqRetry
};
