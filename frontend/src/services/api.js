import { API_URL } from '../utils/constants';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message || 'Request failed');
  }

  return payload.data;
}

export const projectsApi = {
  getAll: () => request('/api/projects'),
  create: (data) =>
    request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id, data) =>
    request(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
};

export const tasksApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, value);
    });
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return request(`/api/tasks${suffix}`);
  },
  create: (data) =>
    request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id, data) =>
    request(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
};

export const onboardingApi = {
  get: (userId) => request(`/api/onboarding/${encodeURIComponent(userId)}`),
  toggle: (userId, itemId, done) =>
    request(`/api/onboarding/${encodeURIComponent(userId)}/${encodeURIComponent(itemId)}`, {
      method: 'PATCH',
      body: JSON.stringify(typeof done === 'boolean' ? { done } : {})
    })
};

export const searchApi = {
  query: (q, type = 'all') =>
    request(`/api/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`)
};

export default {
  projectsApi,
  tasksApi,
  onboardingApi,
  searchApi
};
