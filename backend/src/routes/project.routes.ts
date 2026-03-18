// ─────────────────────────────────────────────────────────
// Project Routes
// ─────────────────────────────────────────────────────────

import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../validators/schemas.js';

export const projectRoutes = Router();

// All project routes require authentication
projectRoutes.use(authenticate);

projectRoutes.get('/', projectController.getAll);
projectRoutes.get('/:id', projectController.getById);
projectRoutes.post('/', authorize('admin', 'developer'), validate(createProjectSchema), projectController.create);
projectRoutes.put('/:id', authorize('admin', 'developer'), validate(updateProjectSchema), projectController.update);
projectRoutes.delete('/:id', authorize('admin'), projectController.remove);
