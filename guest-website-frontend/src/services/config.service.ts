// ─────────────────────────────────────────────────────────
// Config API Service
// ─────────────────────────────────────────────────────────

import api from './api';

export const configApi = {
  getByProject: (projectId: string) => api.get(`/config/${projectId}`),
  upsert: (data: { key: string; value: string; projectId: string }) => api.post('/config', data),
};
