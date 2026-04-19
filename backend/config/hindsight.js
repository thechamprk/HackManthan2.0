const DEFAULT_TIMEOUT_MS = 8000;

/**
 * Creates a lightweight Hindsight client adapter.
 * The adapter follows the expected store/retrieve patterns and can be mocked in tests.
 * @returns {{store: Function, retrieve: Function, update: Function}}
 */
function createHindsightClient() {
  const apiKey = process.env.HINDSIGHT_API_KEY;
  const instanceId = process.env.HINDSIGHT_INSTANCE_ID;

  if (!apiKey || !instanceId) {
    console.warn('[Hindsight] Missing HINDSIGHT_API_KEY or HINDSIGHT_INSTANCE_ID. Using no-op fallback mode.');

    return {
      store: async ({ data }) => ({ id: data?.interaction_id || `mock_${Date.now()}`, data, source: 'fallback' }),
      retrieve: async () => ({ results: [], source: 'fallback' }),
      update: async ({ id, data }) => ({ id, data, source: 'fallback' })
    };
  }

  const baseUrl = `https://api.hindsight.cloud/v1/instances/${instanceId}`;

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
    store: (payload) => request('/memory/store', 'POST', payload),
    retrieve: (payload) => request('/memory/retrieve', 'POST', payload),
    update: (payload) => request('/memory/update', 'PATCH', payload)
  };
}

module.exports = {
  createHindsightClient
};
