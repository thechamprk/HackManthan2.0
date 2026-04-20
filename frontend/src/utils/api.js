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

export const insights = {
  listProjects: async () => request('/api/insights/projects'),
  createProject: async (payload) =>
    request('/api/insights/projects', {
      method: 'POST',
      data: payload
    }),
  generateTodos: async (projectId, context) =>
    request(`/api/insights/projects/${projectId}/todos/ai`, {
      method: 'POST',
      data: { context }
    }),
  searchGrants: async (payload) =>
    request('/api/insights/grants/search', {
      method: 'POST',
      data: payload
    }),
  continueOnboarding: async (payload) =>
    request('/api/insights/onboarding/continue', {
      method: 'POST',
      data: payload
    }),
  deepSearchSummary: async (payload) =>
    request('/api/insights/search/summary', {
      method: 'POST',
      data: payload
    }),
  createTasksFromInstruction: async (payload) =>
    request('/api/insights/tasks/from-instruction', {
      method: 'POST',
      data: payload
    })
};

export default api;
