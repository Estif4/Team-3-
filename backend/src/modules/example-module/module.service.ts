import { exampleRepository, ExampleRepository } from './module.repository.js';
import { CreateExampleInput, UpdateExampleInput, ExampleFilterOptions, IExampleDocument } from './module.types.js';
import { PaginationParams, PaginationResult } from '../../utils/pagination.js';

export class ExampleService {
  constructor(private repo: ExampleRepository = exampleRepository) {}

  async createExample(data: CreateExampleInput): Promise<IExampleDocument> {
    return this.repo.create(data);
  }

  async getExampleById(id: string): Promise<IExampleDocument> {
    const item = await this.repo.findById(id);
    if (!item) {
      const err = new Error('Example not found');
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }
    return item;
  }

  async getExamples(filters: ExampleFilterOptions, pagination: PaginationParams): Promise<PaginationResult<IExampleDocument>> {
    return this.repo.findMany(filters, pagination);
  }

  async updateExample(id: string, data: UpdateExampleInput, userId: string, userRole: string): Promise<IExampleDocument> {
    const item = await this.getExampleById(id);
    if (userRole !== 'admin' && item.createdBy._id.toString() !== userId) {
      const err = new Error('Unauthorized to update this item');
      (err as unknown as { statusCode: number }).statusCode = 403;
      throw err;
    }
    const updated = await this.repo.updateById(id, data);
    return updated!;
  }

  async deleteExample(id: string, userId: string, userRole: string): Promise<IExampleDocument> {
    const item = await this.getExampleById(id);
    if (userRole !== 'admin' && item.createdBy._id.toString() !== userId) {
      const err = new Error('Unauthorized to delete this item');
      (err as unknown as { statusCode: number }).statusCode = 403;
      throw err;
    }
    const deleted = await this.repo.deleteById(id);
    return deleted!;
  }
}

export const exampleService = new ExampleService();
