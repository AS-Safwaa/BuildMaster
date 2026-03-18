// ─────────────────────────────────────────────────────────
// Config Routes
// ─────────────────────────────────────────────────────────

import { Router } from 'express';
import * as configController from '../controllers/config.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { configSchema } from '../validators/schemas.js';

export const configRoutes = Router();

configRoutes.use(authenticate);

configRoutes.get('/:projectId', configController.getByProject);
configRoutes.post('/', validate(configSchema), configController.upsert);
