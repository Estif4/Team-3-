import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user.api.js';
import { PaginationParams, User } from '../../../types/index.js';
import { UserFilters } from '../types/user.types.js';

export const useUsers = (params?: PaginationParams & UserFilters) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getUserById(id),
    enabled: Boolean(id),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
