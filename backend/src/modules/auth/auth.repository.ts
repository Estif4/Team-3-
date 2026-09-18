import { RefreshTokenModel, IRefreshTokenDocument } from './auth.model.js';
import { UserModel } from '../users/user.model.js';
import { IUserDocument } from '../users/user.types.js';

export class AuthRepository {
  async saveRefreshToken(userId: string, token: string, expiresAt: Date): Promise<IRefreshTokenDocument> {
    return RefreshTokenModel.create({ userId, token, expiresAt });
  }

  async findRefreshToken(token: string): Promise<IRefreshTokenDocument | null> {
    return RefreshTokenModel.findOne({ token });
  }

  async deleteRefreshToken(token: string): Promise<IRefreshTokenDocument | null> {
    return RefreshTokenModel.findOneAndDelete({ token });
  }

  async deleteUserRefreshTokens(userId: string): Promise<unknown> {
    return RefreshTokenModel.deleteMany({ userId });
  }

  async findUserById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email }).select('+password');
  }
}

export const authRepository = new AuthRepository();
