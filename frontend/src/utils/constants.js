export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const CHAT_MESSAGES_LIMIT = 100;
export const REQUEST_TIMEOUT_MS = 30000;

export const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  error: '#dc2626',
  warning: '#f59e0b',
  dark: '#0f172a',
  light: '#f8fafc'
};

export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};
