import { ExampleModel } from './module.model.js';
import { IExampleDocument, CreateExampleInput, UpdateExampleInput, ExampleFilterOptions } from './module.types.js';
import { PaginationParams, getPaginationOptions, buildPaginatedResult } from '../../utils/pagination.js';

export class ExampleRepository {
  async create(data: CreateExampleInput): Promise<IExampleDocument> {
    return ExampleModel.create(data);
  }

  async findById(id: string): Promise<IExampleDocument | null> {
    return ExampleModel.findById(id).populate('createdBy', 'name email avatar');
  }

  async findMany(filters: ExampleFilterOptions = {}, pagination: PaginationParams = {}) {
    const { page, limit, skip, sort } = getPaginationOptions(pagination);
    const query: Record<string, unknown> = {};

    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.isPublished !== undefined) {
      query.isPublished = filters.isPublished;
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      ExampleModel.find(query).populate('createdBy', 'name email avatar').sort(sort).skip(skip).limit(limit),
      ExampleModel.countDocuments(query),
    ]);

    return buildPaginatedResult(data, total, page, limit);
  }

  async updateById(id: string, data: UpdateExampleInput): Promise<IExampleDocument | null> {
    return ExampleModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<IExampleDocument | null> {
    return ExampleModel.findByIdAndDelete(id);
  }
}

export const exampleRepository = new ExampleRepository();
