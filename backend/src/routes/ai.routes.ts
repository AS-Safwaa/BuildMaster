// ─────────────────────────────────────────────────────────
// AI Routes — Secure proxy to Gemini
// ─────────────────────────────────────────────────────────

import { Router } from 'express';
import * as aiController from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { aiPromptSchema } from '../validators/schemas.js';

export const aiRoutes = Router();

aiRoutes.use(authenticate);

aiRoutes.post('/generate', validate(aiPromptSchema), aiController.generate);
