// ─────────────────────────────────────────────────────────
// Axios API Client — centralized with JWT auto-attach
// ─────────────────────────────────────────────────────────

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request Interceptor: attach JWT token ─────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: handle 401 + token refresh ──
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

        if (data.success && data.data.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        // Prototype Protection: If we are using a mock token, don't clear session or redirect.
        // This allows the prototype to remain functional even if the backend is offline/401ing.
        const token = localStorage.getItem('accessToken');
        if (token === 'mock-token') {
          console.warn('API connection failed in prototype mode. Staying logged in.');
          return Promise.reject(error);
        }

        // Standard Session Cleanup
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login'; // More appropriate to send back to login than home
      }
    }

    return Promise.reject(error);
  }
);

export default api;
