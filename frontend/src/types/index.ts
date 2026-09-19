// Shared auth / API types used by authSlice and axios

export interface FieldError {
  field: string;
  message: string;
}

export interface User {
  _id: string;
  displayName?: string;
  name?: string;
  email: string;
  role?: string;
  avatarColor?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  name: string;
  displayName?: string;
  email: string;
  password: string;
  avatarColor?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
