const ROUTES = {
  LANDING: '/',
  HOME: '/app',
  DASHBOARD: '/dashboard',
  DOCS: '/docs'
};

const ISSUE_TYPES = {
  PASSWORD_RESET: 'password_reset',
  BILLING: 'billing',
  LOGIN_ISSUE: 'login_issue',
  TECHNICAL_ERROR: 'technical_error',
  GENERAL_SUPPORT: 'general_support'
};

const AGENT_PROVIDERS = {
  GROQ: 'groq',
  OPENCLAW: 'openclaw'
};

module.exports = { ROUTES, ISSUE_TYPES, AGENT_PROVIDERS };