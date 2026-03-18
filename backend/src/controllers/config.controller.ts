// ─────────────────────────────────────────────────────────
// Config Controller
// ─────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import * as configService from '../services/config.service.js';

export async function getByProject(req: Request, res: Response, next: NextFunction) {
  try {
    const configs = await configService.getConfigsByProject(req.params.projectId);
    res.json({ success: true, data: configs });
  } catch (error) {
    next(error);
  }
}

export async function upsert(req: Request, res: Response, next: NextFunction) {
  try {
    const { key, value, projectId } = req.body;
    const config = await configService.upsertConfig(key, value, projectId);
    res.status(201).json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
}
