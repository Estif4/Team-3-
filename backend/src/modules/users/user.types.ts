import { Document, Types } from "mongoose";

export type UserRole = "ADMIN" | "MEMBER" | "VIEWER";

export interface IUser {
  _id: Types.ObjectId | string;
  displayName: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarColor: string;
  lastSeenAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends Document {
  displayName: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarColor: string;
  lastSeenAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserDto {
  displayName?: string;
  avatarColor?: string;
}
