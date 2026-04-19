export const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  'http://localhost:3000';

export const ROUTES = {
  LANDING: '/',
  HOME: '/app',
  DASHBOARD: '/dashboard',
  DOCS: '/docs'
};

export const ISSUE_TYPES = {
  PASSWORD_RESET: 'password_reset',
  BILLING: 'billing',
  LOGIN_ISSUE: 'login_issue',
  TECHNICAL_ERROR: 'technical_error',
  GENERAL_SUPPORT: 'general_support'
};

export const AGENT_PROVIDERS = {
  GROQ: 'groq',
  OPENCLAW: 'openclaw'
};

export const CHAT_MESSAGES_LIMIT = 60;
export const ANALYTICS_INTERACTIONS_LIMIT = 300;