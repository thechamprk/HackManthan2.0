const Groq = require('groq-sdk');

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
const MAX_RETRIES = 2;

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fallbackResponse(userMessage) {
  return `I am currently experiencing high load. Here is a safe immediate step: please confirm your account email and describe your issue in one sentence. Original request: ${String(userMessage || '').slice(0, 200)}`;
}

async function generateResponse(systemPrompt, userMessage, temperature = 0.3, options = {}) {
  if (!systemPrompt || !userMessage) {
    throw new Error('systemPrompt and userMessage are required');
  }

  if (!groq) {
    console.warn('[GroqService] GROQ_API_KEY missing. Returning fallback response.');
    return {
      content: fallbackResponse(userMessage),
      raw: { fallback: true }
    };
  }

  const model = options.model || DEFAULT_MODEL;
  const stream = Boolean(options.stream);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature,
        stream
      });

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
      const retryable = status === 429 || status >= 500 || error.name === 'AbortError';
      const finalAttempt = attempt >= MAX_RETRIES;

      console.warn('[GroqService] generation error', {
        attempt,
        status,
        message: error.message
      });

      if (!retryable || finalAttempt) {
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

      await sleep(250 * Math.pow(2, attempt));
    }
  }

  return {
    content: fallbackResponse(userMessage),
    raw: { fallback: true, reason: 'exhausted retries' }
  };
}

module.exports = {
  generateResponse
};