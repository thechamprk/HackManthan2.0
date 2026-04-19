import { API_URL, REQUEST_TIMEOUT_MS } from './constants';

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }
  return response.json();
};

export const support = {
  sendMessage: async (customerId, message, context = []) => {
    const response = await fetchWithTimeout(`${API_URL}/api/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: customerId,
        message,
        conversation_context: context
      })
    });
    return handleResponse(response);
  }
};

export const analytics = {
  getDashboard: async () => {
    const response = await fetchWithTimeout(`${API_URL}/api/analytics/dashboard`);
    return handleResponse(response);
  },
  getMetrics: async () => {
    const response = await fetchWithTimeout(`${API_URL}/api/analytics/metrics`);
    return handleResponse(response);
  }
};

export default { support, analytics };
