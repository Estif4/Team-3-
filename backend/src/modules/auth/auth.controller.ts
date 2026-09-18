import { Request, Response, NextFunction } from 'express';
import { authService, AuthService } from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export class AuthController {
  constructor(private service: AuthService = authService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.register(req.body);
      sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.service.refreshTokens(refreshToken);
      sendSuccess(res, tokens, 'Tokens refreshed successfully');
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await this.service.logout(refreshToken);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const user = await this.service.getMe(req.user.userId);
      sendSuccess(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
