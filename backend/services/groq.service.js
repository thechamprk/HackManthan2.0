const { getGroqInstance, withGroqRetry } = require('../config/groq');
const { logger } = require('../middleware/logger');
const { GROQ_MODEL, GROQ_TIMEOUT_MS } = require('../utils/constants');

const groq = getGroqInstance();

function fallbackResponse(userMessage) {
  return `I am currently experiencing high load. Here is a safe immediate step: please confirm your account email and describe your issue in one sentence. Original request: ${String(userMessage || '').slice(0, 200)}`;
}

async function generateResponse(systemPrompt, userMessage, temperature = 0.3, options = {}) {
  if (!systemPrompt || !userMessage) {
    throw new Error('systemPrompt and userMessage are required');
  }

  if (!groq) {
    logger.warn('GROQ_API_KEY missing. Returning fallback response.');
    return {
      content: fallbackResponse(userMessage),
      raw: { fallback: true }
    };
  }

  const model = options.model || GROQ_MODEL;
  const stream = Boolean(options.stream);
  const timeoutMs = Number(options.timeoutMs) || GROQ_TIMEOUT_MS;

  try {
    const completion = await withGroqRetry(() =>
      Promise.race([
        groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature,
          stream
        }),
        new Promise((_, reject) => {
          setTimeout(() => {
            const timeoutError = new Error(`Groq request timed out after ${timeoutMs}ms`);
            timeoutError.statusCode = 408;
            reject(timeoutError);
          }, timeoutMs);
        })
      ])
    );

    if (stream) {
      return {
        content: '',
        raw: { streaming: true },
        stream: completion
      };
    }

    const content = completion?.choices?.[0]?.message?.content?.trim();

    if (!validateResponse(content)) {
      throw new Error('Groq response content was empty');
    }

    return {
      content,
      raw: completion
    };
  } catch (error) {
    const status = error.status || error.statusCode;
    logger.warn({ status, message: error.message }, 'groq generation failed');

    if (status === 429) {
      return {
        content: 'I am receiving too many requests right now. Please retry in a few seconds.',
        raw: { rateLimited: true }
      };
    }

    return {
      content: fallbackResponse(userMessage),
      raw: { fallback: true, error: error.message }
    };
  }
}

async function streamResponse(systemPrompt, userMessage, temperature = 0.3, options = {}) {
  return generateResponse(systemPrompt, userMessage, temperature, { ...options, stream: true });
}

function validateResponse(responseText) {
  if (typeof responseText !== 'string') {
    return false;
  }

  const trimmed = responseText.trim();
  return Boolean(trimmed) && trimmed.length >= 2;
}

module.exports = {
  generateResponse,
  streamResponse,
  validateResponse
};
