import { UserModel } from './user.model.js';
import { IUserDocument, CreateUserInput, UpdateUserInput, UserFilterOptions } from './user.types.js';
import { PaginationParams, getPaginationOptions, buildPaginatedResult } from '../../utils/pagination.js';

export class UserRepository {
  async create(data: CreateUserInput): Promise<IUserDocument> {
    return UserModel.create(data);
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async findByEmail(email: string, includePassword = false): Promise<IUserDocument | null> {
    const query = UserModel.findOne({ email });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  async findMany(filters: UserFilterOptions = {}, pagination: PaginationParams = {}) {
    const { page, limit, skip, sort } = getPaginationOptions(pagination);
    const query: Record<string, unknown> = {};

    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      UserModel.find(query).sort(sort).skip(skip).limit(limit),
      UserModel.countDocuments(query),
    ]);

    return buildPaginatedResult(data, total, page, limit);
  }

  async updateById(id: string, data: UpdateUserInput): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<IUserDocument | null> {
    return UserModel.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();
