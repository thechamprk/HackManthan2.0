const DEFAULT_MODEL = process.env.OPENCLAW_MODEL || 'openclaw';
const DEFAULT_BASE_URL = process.env.OPENCLAW_BASE_URL || 'http://localhost:3001';
const CHAT_ENDPOINT = process.env.OPENCLAW_CHAT_ENDPOINT || '/v1/chat/completions';
const MAX_RETRIES = 2;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fallbackResponse(userMessage) {
  return `OpenClaw is currently unavailable. Please retry shortly. In the meantime, confirm your account email and summarize your issue in one line. Original request: ${String(userMessage || '').slice(0, 200)}`;
}

async function callOpenClaw(messages, options = {}) {
  const baseUrl = DEFAULT_BASE_URL.replace(/\/$/, '');
  const endpoint = CHAT_ENDPOINT.startsWith('/') ? CHAT_ENDPOINT : `/${CHAT_ENDPOINT}`;
  const model = options.model || DEFAULT_MODEL;

  const headers = {
    'Content-Type': 'application/json'
  };

  if (process.env.OPENCLAW_API_KEY) {
    headers.Authorization = `Bearer ${process.env.OPENCLAW_API_KEY}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature,
      stream: false
    })
  });

  if (!response.ok) {
    const text = await response.text();
    const error = new Error(`[OpenClawService] HTTP ${response.status}: ${text}`);
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Generates a support response using OpenClaw with an OpenAI-compatible endpoint.
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @param {number} temperature
 * @param {{model?: string}} options
 * @returns {Promise<{content: string, raw: object}>}
 */
async function generateResponse(systemPrompt, userMessage, temperature = 0.3, options = {}) {
  if (!systemPrompt || !userMessage) {
    throw new Error('systemPrompt and userMessage are required');
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const raw = await callOpenClaw(messages, {
        ...options,
        temperature
      });
      const content = raw?.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('OpenClaw response content was empty');
      }

      return {
        content,
        raw
      };
    } catch (error) {
      const status = error.status || error.statusCode;
      const retryable = status === 429 || status >= 500 || error.name === 'AbortError' || !status;
      const finalAttempt = attempt >= MAX_RETRIES;

      console.warn('[OpenClawService] generation error', {
        attempt,
        status,
        message: error.message
      });

      if (!retryable || finalAttempt) {
        if (status === 429) {
          return {
            content: 'OpenClaw is receiving too many requests right now. Please retry in a few seconds.',
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
