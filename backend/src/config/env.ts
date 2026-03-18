// ─────────────────────────────────────────────────────────
// Environment Configuration
// ─────────────────────────────────────────────────────────

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
} as const;
