import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import { logger } from '../lib/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: Error & { statusCode?: number; errors?: unknown },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[Error] ${req.method} ${req.originalUrl} - ${message}`, {
    stack: err.stack,
    errors: err.errors,
  });

  sendError(
    res,
    message,
    statusCode,
    env.IS_PRODUCTION ? undefined : { stack: err.stack, errors: err.errors }
  );
};
