// ─────────────────────────────────────────────────────────
// AI Controller — Secure Gemini proxy endpoint
// ─────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

export async function generate(req: Request, res: Response, next: NextFunction) {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      throw new AppError('Prompt is required', 400);
    }

    if (!config.gemini.apiKey) {
      throw new AppError('Gemini API key is not configured', 500);
    }

    // Call Gemini API from the backend (key never exposed to frontend)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.gemini.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: context ? `${context}\n\n${prompt}` : prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[AI] Gemini API error:', errorData);
      throw new AppError('AI generation failed', 502);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.json({ success: true, data: { text } });
  } catch (error) {
    next(error);
  }
}
