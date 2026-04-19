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

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

const HINDSIGHT_CONTEXT_ID = process.env.HINDSIGHT_CONTEXT_ID || 'support-agent-v1';
const MAX_SIMILAR_CASES = Number(process.env.MAX_SIMILAR_CASES) || 5;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_TIMEOUT_MS = Number(process.env.GROQ_TIMEOUT_MS) || 15000;
const MAX_MESSAGE_LENGTH = Number(process.env.MAX_MESSAGE_LENGTH) || 1200;

module.exports = {
  ROUTES,
  ISSUE_TYPES,
  AGENT_PROVIDERS,
  CONFIDENCE_THRESHOLDS,
  MEMORY,
  HTTP_STATUS,
  HINDSIGHT_CONTEXT_ID,
  MAX_SIMILAR_CASES,
  GROQ_MODEL,
  GROQ_TIMEOUT_MS,
  MAX_MESSAGE_LENGTH
};
