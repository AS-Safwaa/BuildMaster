// ─────────────────────────────────────────────────────────
// User Controller
// ─────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
