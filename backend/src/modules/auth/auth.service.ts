import { authRepository, AuthRepository } from './auth.repository.js';
import { RegisterInput, LoginInput, AuthResponse } from './auth.types.js';
import { hashPassword, comparePassword } from '../../utils/encryption.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../lib/jwt.js';
import { UserModel } from '../users/user.model.js';
import { IUserDocument } from '../users/user.types.js';

export class AuthService {
  constructor(private repo: AuthRepository = authRepository) {}

  async register(data: RegisterInput): Promise<AuthResponse> {
    const existing = await this.repo.findUserByEmail(data.email);
    if (existing) {
      const err = new Error('Email is already registered');
      (err as unknown as { statusCode: number }).statusCode = 409;
      throw err;
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return this.generateAuthResponse(user);
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.repo.findUserByEmail(data.email);
    if (!user || !user.password) {
      const err = new Error('Invalid email or password');
      (err as unknown as { statusCode: number }).statusCode = 401;
      throw err;
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      (err as unknown as { statusCode: number }).statusCode = 401;
      throw err;
    }

    return this.generateAuthResponse(user);
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenDoc = await this.repo.findRefreshToken(refreshToken);
    if (!tokenDoc) {
      const err = new Error('Invalid or expired refresh token');
      (err as unknown as { statusCode: number }).statusCode = 401;
      throw err;
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await this.repo.findUserById(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      await this.repo.deleteRefreshToken(refreshToken);
      const newAccessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await this.repo.saveRefreshToken(user._id.toString(), newRefreshToken, expiresAt);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      await this.repo.deleteRefreshToken(refreshToken);
      const err = new Error('Invalid refresh token');
      (err as unknown as { statusCode: number }).statusCode = 401;
      throw err;
    }
  }

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.repo.deleteRefreshToken(refreshToken);
    }
  }

  async getMe(userId: string): Promise<IUserDocument> {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      const err = new Error('User not found');
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }
    return user;
  }

  private async generateAuthResponse(user: IUserDocument): Promise<AuthResponse> {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.repo.saveRefreshToken(user._id.toString(), refreshToken, expiresAt);

    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      tokens: { accessToken, refreshToken },
    };
  }
}

export const authService = new AuthService();
