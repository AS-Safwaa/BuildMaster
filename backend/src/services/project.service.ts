// ─────────────────────────────────────────────────────────
// Project Service — CRUD operations for projects
// ─────────────────────────────────────────────────────────

import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getAllProjects(userId?: string, role?: string) {
  // Admins see all, merchants/users see only their own
  const where = role === 'admin' ? {} : { createdBy: userId };

  return prisma.project.findMany({
    where,
    include: { creator: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      configs: true,
    },
  });
  if (!project) throw new AppError('Project not found', 404);
  return project;
}

export async function createProject(title: string, description: string, createdBy: string, status: string = 'draft') {
  return prisma.project.create({
    data: { title, description, status, createdBy },
    include: { creator: { select: { id: true, name: true, email: true } } },
  });
}

export async function updateProject(id: string, data: { title?: string; description?: string; status?: string }, userId: string, role: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new AppError('Project not found', 404);

  // Only admins or the project creator can update
  if (role !== 'admin' && project.createdBy !== userId) {
    throw new AppError('Not authorized to update this project', 403);
  }

  return prisma.project.update({
    where: { id },
    data,
    include: { creator: { select: { id: true, name: true, email: true } } },
  });
}

export async function deleteProject(id: string, userId: string, role: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new AppError('Project not found', 404);

  if (role !== 'admin' && project.createdBy !== userId) {
    throw new AppError('Not authorized to delete this project', 403);
  }

  await prisma.project.delete({ where: { id } });
  return { message: 'Project deleted successfully' };
}
