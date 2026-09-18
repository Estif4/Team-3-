import { Request, Response, NextFunction } from 'express';
import { userService, UserService } from './user.service.js';
import { sendSuccess } from '../../utils/response.js';

export class UserController {
  constructor(private service: UserService = userService) {}

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.service.createUser(req.body);
      sendSuccess(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.service.getUserById(req.params.id);
      sendSuccess(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role, isActive, search, page, limit, sortBy, sortOrder } = req.query;
      const filters = {
        role: role as string,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
        search: search as string,
      };
      const pagination = {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const result = await this.service.getUsers(filters, pagination);
      sendSuccess(res, result.data, 'Users retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.service.updateUser(req.params.id, req.body);
      sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.service.deleteUser(req.params.id);
      sendSuccess(res, user, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
