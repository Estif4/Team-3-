// src/types/index.ts
export interface User {
  _id: string
  displayName: string
  email: string
  role: string
  avatarColor: string
  isActive: boolean
  lastSeenAt: string
  createdAt: string
  updatedAt: string
}

// token is no longer in this shape — it never reaches JS
export interface AuthResponse {
  user: User
}

export interface RegisterPayload {
  displayName: string
  email: string
  password: string
  role: string
  avatarColor: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface FieldError {
  field: string
  message: string
}