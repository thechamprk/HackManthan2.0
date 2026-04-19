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
  ACCOUNT_LOCKED: 'account_locked',
  GENERAL_SUPPORT: 'general_support'
};

const AGENT_PROVIDERS = {
  GROQ: 'groq',
  OPENCLAW: 'openclaw'
};

const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.75,
  MEDIUM: 0.5,
  LOW: 0.0
};

const MEMORY = {
  CACHE_TTL: 60,
  MAX_RETRIES: 2,
  RETRY_DELAY_MS: 500,
  REQUEST_TIMEOUT_MS: 8000
};

module.exports = { ROUTES, ISSUE_TYPES, AGENT_PROVIDERS, CONFIDENCE_THRESHOLDS, MEMORY };