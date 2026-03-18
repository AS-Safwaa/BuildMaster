// ─────────────────────────────────────────────────────────
// Auth Controller
// ─────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import * as userService from '../services/user.service.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser(name, email, password, role);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const result = authService.refreshAccessToken(refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userData = await userService.getUserById(req.user!.userId);
    res.json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
}
