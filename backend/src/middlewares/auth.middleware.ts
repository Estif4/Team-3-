import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../lib/jwt.js';
import { sendError } from '../utils/response.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication token missing or malformed', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401, error);
  }
};
