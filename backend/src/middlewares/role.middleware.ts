import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { sendError } from '../utils/response.js';

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'User not authenticated', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'Forbidden: You do not have permission to access this resource', 403);
      return;
    }

    next();
  };
};
