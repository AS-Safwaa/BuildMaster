// ─────────────────────────────────────────────────────────
// Auth Service — handles user registration, login, tokens
// ─────────────────────────────────────────────────────────

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import type { JwtPayload } from '../middleware/auth.js';

const SALT_ROUNDS = 12;

/**
 * Register a new user
 */
export async function registerUser(name: string, email: string, password: string, role: string = 'user') {
  // Check if email is already taken
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });

  return { user, tokens };
}

/**
 * Login an existing user
 */
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, tokens };
}

/**
 * Refresh an access token using a valid refresh token
 */
export function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload;

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return { accessToken: newAccessToken };
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }
}

/**
 * Generate access + refresh token pair
 */
function generateTokens(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return { accessToken, refreshToken };
}
