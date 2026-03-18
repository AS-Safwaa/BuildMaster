// ─────────────────────────────────────────────────────────
// Zod Validation Schemas
// ─────────────────────────────────────────────────────────

import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'developer']).optional().default('developer'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'archived']).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'archived']).optional(),
});

export const configSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
  projectId: z.string().min(1, 'Project ID is required'),
});

export const aiPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(10000),
  context: z.string().max(10000).optional(),
});
