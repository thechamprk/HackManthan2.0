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

export default api;
