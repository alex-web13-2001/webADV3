import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    throw new AppError(401, 'API key is required');
  }

  // Store API key in request for later use
  (req as any).apiKey = apiKey;
  next();
};
