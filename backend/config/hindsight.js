const DEFAULT_TIMEOUT_MS = 8000;

function createHindsightClient() {
  const apiKey = process.env.HINDSIGHT_API_KEY;
  const bankId = process.env.HINDSIGHT_INSTANCE_ID || 'hackmanthan';

  if (!apiKey) {
    console.warn('[Hindsight] Missing HINDSIGHT_API_KEY. Using no-op fallback mode.');
    return {
      store: async ({ data }) => ({ id: `mock_${Date.now()}`, source: 'fallback' }),
      retrieve: async () => ({ results: [], source: 'fallback' }),
      update: async ({ id }) => ({ id, source: 'fallback' })
    };
  }

  const baseUrl = 'https://api.hindsight.vectorize.io';

  async function request(path, method, body) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`[Hindsight] ${method} ${path} failed: ${response.status} ${errorText}`);
        error.statusCode = response.status;
        throw error;
      }
      return response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    store: (payload) => request(`/v1/default/banks/${bankId}/memories`, 'POST', {
      items: [{ content: typeof payload?.data === 'object'
        ? JSON.stringify(payload.data)
        : String(payload?.data || payload) }]
    }),
    retrieve: (payload) => request(`/v1/default/banks/${bankId}/memories/recall`, 'POST', {
      query: payload?.query || String(payload),
      budget: 'mid',
      max_tokens: 1024
    }),
    update: (payload) => request(`/v1/default/banks/${bankId}/memories`, 'POST', {
      items: [{ content: JSON.stringify(payload?.data || payload) }]
    })
  };
}

module.exports = { createHindsightClient };