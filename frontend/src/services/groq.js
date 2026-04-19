import { API_URL } from '../utils/constants';

async function post(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message || 'AI request failed');
  }
  return payload.data;
}

export function aiBreakdown(goal) {
  return post('/api/ai/breakdown', { goal });
}

export function aiGrants(description) {
  return post('/api/ai/grants', { description });
}

export function aiSearchSummary(query, results) {
  return post('/api/ai/search-summary', { query, results });
}
