import { IUser } from "../users/user.types";

export interface RegisterDto {
  displayName: string;
  email: string;
  password: string;
  role?: "ADMIN" | "MEMBER" | "VIEWER";
  avatarColor?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<IUser, "password">;
  token: string;
}

export interface JwtPayload {
  userId: string;
  role: string;
}
