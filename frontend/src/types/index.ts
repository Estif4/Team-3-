// Shared auth / API types used by authSlice and axios

export interface FieldError {
  field: string;
  message: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
