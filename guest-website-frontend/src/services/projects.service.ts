// ─────────────────────────────────────────────────────────
// Projects API Service
// ─────────────────────────────────────────────────────────

import api from './api';

export interface ProjectPayload {
  title: string;
  description: string;
  status?: string;
}

export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: ProjectPayload) => api.post('/projects', data),
  update: (id: string, data: Partial<ProjectPayload>) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};
