// ─────────────────────────────────────────────────────────
// Config Service — key/value configs per project
// ─────────────────────────────────────────────────────────

import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getConfigsByProject(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError('Project not found', 404);

  return prisma.config.findMany({
    where: { projectId },
    orderBy: { key: 'asc' },
  });
}

export async function upsertConfig(key: string, value: string, projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError('Project not found', 404);

  // Check if config with this key already exists for the project
  const existing = await prisma.config.findFirst({
    where: { key, projectId },
  });

  if (existing) {
    return prisma.config.update({
      where: { id: existing.id },
      data: { value },
    });
  }

  return prisma.config.create({
    data: { key, value, projectId },
  });
}
