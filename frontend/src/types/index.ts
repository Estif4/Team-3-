export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: unknown;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
