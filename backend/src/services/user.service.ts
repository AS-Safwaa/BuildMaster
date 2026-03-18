// ─────────────────────────────────────────────────────────
// User Service — CRUD operations for users
// ─────────────────────────────────────────────────────────

import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

/** Select fields that never leak the password */
const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
};

export async function getAllUsers() {
  return prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { ...userSelect, projects: true },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}
