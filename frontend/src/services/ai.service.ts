// ─────────────────────────────────────────────────────────
// AI API Service — proxied through backend
// ─────────────────────────────────────────────────────────

import api from './api';

export const aiApi = {
  generate: (prompt: string, context?: string) =>
    api.post('/ai/generate', { prompt, context }),
};
