import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exampleApi } from '../api/example.api.js';
import { PaginationParams } from '../../../types/index.js';
import { ExampleItem, ExampleFilters } from '../types/example.types.js';

export const useExamples = (params?: PaginationParams & ExampleFilters) => {
  return useQuery({
    queryKey: ['examples', params],
    queryFn: () => exampleApi.getExamples(params),
  });
};

export const useExample = (id: string) => {
  return useQuery({
    queryKey: ['examples', id],
    queryFn: () => exampleApi.getExampleById(id),
    enabled: Boolean(id),
  });
};

export const useCreateExample = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ExampleItem>) => exampleApi.createExample(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examples'] });
    },
  });
};

export const useDeleteExample = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => exampleApi.deleteExample(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examples'] });
    },
  });
};
