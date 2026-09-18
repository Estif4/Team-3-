import { Request, Response, NextFunction } from 'express';
import { exampleService, ExampleService } from './module.service.js';
import { sendSuccess } from '../../utils/response.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export class ExampleController {
  constructor(private service: ExampleService = exampleService) {}

  createExample = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createdBy = req.user!.userId;
      const example = await this.service.createExample({ ...req.body, createdBy });
      sendSuccess(res, example, 'Example created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getExampleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const example = await this.service.getExampleById(req.params.id);
      sendSuccess(res, example, 'Example retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getExamples = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category, isPublished, search, page, limit, sortBy, sortOrder } = req.query;
      const filters = {
        category: category as string,
        isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
        search: search as string,
      };
      const pagination = {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const result = await this.service.getExamples(filters, pagination);
      sendSuccess(res, result.data, 'Examples retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  };

  updateExample = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, role } = req.user!;
      const example = await this.service.updateExample(req.params.id, req.body, userId, role);
      sendSuccess(res, example, 'Example updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteExample = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, role } = req.user!;
      const example = await this.service.deleteExample(req.params.id, userId, role);
      sendSuccess(res, example, 'Example deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const exampleController = new ExampleController();
