import { apiClient } from '../../../lib/axios.js';
import { ApiResponse, User, PaginationParams } from '../../../types/index.js';
import { UserFilters } from '../types/user.types.js';

export const userApi = {
  getUsers: async (params?: PaginationParams & UserFilters): Promise<ApiResponse<User[]>> => {
    const res = await apiClient.get<ApiResponse<User[]>>('/users', { params });
    return res.data;
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const res = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const res = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<User>> => {
    const res = await apiClient.delete<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },
};
