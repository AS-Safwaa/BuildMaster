// ─────────────────────────────────────────────────────────
// Project Controller
// ─────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service.js';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await projectService.getAllProjects(req.user!.userId, req.user!.role);
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, status } = req.body;
    const project = await projectService.createProject(title, description, req.user!.userId, status);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.updateProject(
      req.params.id,
      req.body,
      req.user!.userId,
      req.user!.role
    );
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await projectService.deleteProject(req.params.id, req.user!.userId, req.user!.role);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
