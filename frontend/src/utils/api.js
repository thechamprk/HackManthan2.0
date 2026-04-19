import axios from 'axios';
import { API_URL } from './constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      'Unexpected network error';
    return Promise.reject(new Error(message));
  }
);

export async function request(path, options = {}) {
  const response = await api.request({ url: path, ...options });
  return response.data;
}

export const support = {
  sendMessage: async (customerId, message, context = []) =>
    request('/api/support', {
      method: 'POST',
      data: {
        customer_id: customerId,
        message,
        conversation_context: context
      }
    })
};

export const analytics = {
  getDashboard: async () => request('/api/analytics/dashboard'),
  getMetrics: async () => request('/api/analytics/metrics')
};

export default api;
