// ─────────────────────────────────────────────────────────
// Users API Service
// ─────────────────────────────────────────────────────────

import api from './api';

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
};
