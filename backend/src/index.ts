// ─────────────────────────────────────────────────────────
// Express Application Entry Point
// ─────────────────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { projectRoutes } from './routes/project.routes.js';
import { configRoutes } from './routes/config.routes.js';
import { aiRoutes } from './routes/ai.routes.js';

const app = express();

// ── Global Middleware ──────────────────────────────────
app.use(cors({
  origin: [config.cors.frontendUrl, 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/config', configRoutes);
app.use('/api/ai', aiRoutes);

// ── Centralized Error Handler (must be last) ──────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────
app.listen(config.port, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   🚀 BuildMaster API Server                 ║
  ║   Port: ${config.port}                              ║
  ║   Env:  ${config.nodeEnv.padEnd(16)}             ║
  ║   CORS: ${config.cors.frontendUrl.padEnd(32)}║
  ╚══════════════════════════════════════════════╝
  `);
});

export default app;
