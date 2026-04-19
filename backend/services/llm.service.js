const { generateResponse: generateGroqResponse } = require('./groq.service');
const { generateResponse: generateOpenClawResponse } = require('./openclaw.service');

function getProvider() {
  return (process.env.AGENT_PROVIDER || 'groq').toLowerCase();
}

/**
 * Dispatches generation to the configured LLM provider.
 * Supported providers: groq, openclaw
 */
async function generateResponse(systemPrompt, userMessage, temperature = 0.3, options = {}) {
  const provider = getProvider();

  if (provider === 'openclaw') {
    const result = await generateOpenClawResponse(systemPrompt, userMessage, temperature, options);
    return {
      ...result,
      provider
    };
  }

  const result = await generateGroqResponse(systemPrompt, userMessage, temperature, options);
  return {
    ...result,
    provider: 'groq'
  };
}

module.exports = {
  generateResponse,
  getProvider
};
