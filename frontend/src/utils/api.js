const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }
  return response.json();
};

export const support = {
  sendMessage: async (customerId, message, context = []) => {
    const response = await fetch(`${API_URL}/api/support`, {
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
    const response = await fetch(`${API_URL}/api/analytics/dashboard`);
    return handleResponse(response);
  },
  getMetrics: async () => {
    const response = await fetch(`${API_URL}/api/analytics/metrics`);
    return handleResponse(response);
  }
};

export default { support, analytics };
