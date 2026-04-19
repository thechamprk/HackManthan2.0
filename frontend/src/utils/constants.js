<<<<<<< HEAD
export const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';
export const ANALYTICS_INTERACTIONS_LIMIT = 300;
=======
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

>>>>>>> parent of 2a94b12 (chore(frontend): restore API env fallback and memoize analytics fetchMetrics)
export const CHAT_MESSAGES_LIMIT = 100;
export const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  surface: '#0f172a'
};

export const ROUTES = {
  LANDING: '/',
  HOME: '/app',
  DASHBOARD: '/dashboard',
  DOCS: '/docs'
};
