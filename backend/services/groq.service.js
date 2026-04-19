const DEFAULT_MODEL = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
const { createGroqClient, withGroqRetry } = require('../config/groq');
const { logger } = require('../middleware/logger');
const groq = createGroqClient();

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

  const model = options.model || DEFAULT_MODEL;
  const stream = Boolean(options.stream);

  try {
    const completion = await withGroqRetry(() =>
      groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature,
        stream
      })
    );

    if (stream) {
      return {
        content: '',
        raw: { streaming: true },
        stream: completion
      };
    }

    const content = completion?.choices?.[0]?.message?.content?.trim();

    if (!content) {
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

module.exports = {
  generateResponse
};
