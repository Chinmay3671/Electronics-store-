import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token & Session ID
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('techvault_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    let sessionId = localStorage.getItem('techvault_session_id');
    if (!sessionId) {
      sessionId = 'guest-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('techvault_session_id', sessionId);
    }
    config.headers['X-Session-ID'] = sessionId;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors & Auth Expiry
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401 && !error.config.url.includes('/auth/login')) {
        // Clear expired auth session
        localStorage.removeItem('techvault_token');
        localStorage.removeItem('techvault_user');
      }

      const errorMessage = data?.message || error.message || 'An error occurred. Please try again.';
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(new Error(error.message || 'Network error, please check connection.'));
  }
);

export default client;
