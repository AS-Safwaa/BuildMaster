// ─────────────────────────────────────────────────────────
// User Routes
// ─────────────────────────────────────────────────────────

import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const userRoutes = Router();

// All user routes require authentication
userRoutes.use(authenticate);

userRoutes.get('/', authorize('admin'), userController.getAll);
userRoutes.get('/:id', userController.getById);
