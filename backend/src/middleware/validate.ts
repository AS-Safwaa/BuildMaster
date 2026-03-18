// ─────────────────────────────────────────────────────────
// Request Validation Middleware (Zod-based)
// ─────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validates req.body against a Zod schema.
 * Returns 400 with structured errors on failure.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
}
