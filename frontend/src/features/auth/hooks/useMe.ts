import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api.js';
import { useAuthStore } from '../../../app/store.js';

export const useMe = () => {
  const { isAuthenticated, updateUser } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await authApi.getMe();
      updateUser(res.data);
      return res.data;
    },
    enabled: isAuthenticated,
  });
};
