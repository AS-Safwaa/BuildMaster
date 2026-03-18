// ─────────────────────────────────────────────────────────
// Auth Routes
// ─────────────────────────────────────────────────────────

import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { registerSchema, loginSchema, refreshSchema } from '../validators/schemas.js';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), authController.register);
authRoutes.post('/login', validate(loginSchema), authController.login);
authRoutes.post('/refresh', validate(refreshSchema), authController.refresh);
authRoutes.get('/me', authenticate, authController.me);
