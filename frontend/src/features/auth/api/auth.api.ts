import { apiClient } from '../../../lib/axios.js';
import { ApiResponse, User } from '../../../types/index.js';
import { AuthResponse } from '../types/auth.types.js';
import { LoginFormValues, RegisterFormValues } from '../schemas/auth.schema.js';

export const authApi = {
  login: async (data: LoginFormValues): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  register: async (data: Omit<RegisterFormValues, 'confirmPassword'>): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  logout: async (refreshToken?: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/logout', { refreshToken });
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
