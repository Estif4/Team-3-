import { userRepository, UserRepository } from './user.repository.js';
import { CreateUserInput, UpdateUserInput, UserFilterOptions, IUserDocument } from './user.types.js';
import { PaginationParams, PaginationResult } from '../../utils/pagination.js';
import { hashPassword } from '../../utils/encryption.js';

export class UserService {
  constructor(private repo: UserRepository = userRepository) {}

  async createUser(data: CreateUserInput): Promise<IUserDocument> {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      const err = new Error('Email is already registered');
      (err as unknown as { statusCode: number }).statusCode = 409;
      throw err;
    }

    const hashedPassword = await hashPassword(data.password);
    return this.repo.create({ ...data, password: hashedPassword });
  }

  async getUserById(id: string): Promise<IUserDocument> {
    const user = await this.repo.findById(id);
    if (!user) {
      const err = new Error('User not found');
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }
    return user;
  }

  async getUsers(filters: UserFilterOptions, pagination: PaginationParams): Promise<PaginationResult<IUserDocument>> {
    return this.repo.findMany(filters, pagination);
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<IUserDocument> {
    const user = await this.repo.updateById(id, data);
    if (!user) {
      const err = new Error('User not found');
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }
    return user;
  }

  async deleteUser(id: string): Promise<IUserDocument> {
    const user = await this.repo.deleteById(id);
    if (!user) {
      const err = new Error('User not found');
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }
    return user;
  }
}

export const userService = new UserService();
