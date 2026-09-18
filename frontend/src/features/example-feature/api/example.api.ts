import { apiClient } from '../../../lib/axios.js';
import { ApiResponse, PaginationParams } from '../../../types/index.js';
import { ExampleItem, ExampleFilters } from '../types/example.types.js';

export const exampleApi = {
  getExamples: async (params?: PaginationParams & ExampleFilters): Promise<ApiResponse<ExampleItem[]>> => {
    const res = await apiClient.get<ApiResponse<ExampleItem[]>>('/examples', { params });
    return res.data;
  },

  getExampleById: async (id: string): Promise<ApiResponse<ExampleItem>> => {
    const res = await apiClient.get<ApiResponse<ExampleItem>>(`/examples/${id}`);
    return res.data;
  },

  createExample: async (data: Partial<ExampleItem>): Promise<ApiResponse<ExampleItem>> => {
    const res = await apiClient.post<ApiResponse<ExampleItem>>('/examples', data);
    return res.data;
  },

  updateExample: async (id: string, data: Partial<ExampleItem>): Promise<ApiResponse<ExampleItem>> => {
    const res = await apiClient.put<ApiResponse<ExampleItem>>(`/examples/${id}`, data);
    return res.data;
  },

  deleteExample: async (id: string): Promise<ApiResponse<ExampleItem>> => {
    const res = await apiClient.delete<ApiResponse<ExampleItem>>(`/examples/${id}`);
    return res.data;
  },
};
