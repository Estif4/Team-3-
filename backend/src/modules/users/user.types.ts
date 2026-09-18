import { Document, Types } from 'mongoose';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export type CreateUserInput = Pick<IUser, 'name' | 'email'> & {
  password: string;
  role?: UserRole;
  avatar?: string;
};

export type UpdateUserInput = Partial<Pick<IUser, 'name' | 'email' | 'avatar' | 'isActive' | 'role'>>;

export interface UserFilterOptions {
  role?: string;
  isActive?: boolean;
  search?: string;
}
