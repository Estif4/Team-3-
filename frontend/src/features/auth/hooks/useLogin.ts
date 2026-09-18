import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api.js';
import { LoginFormValues } from '../schemas/auth.schema.js';
import { useAuthStore } from '../../../app/store.js';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: (res) => {
      const { user, tokens } = res.data;
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      navigate('/');
    },
  });
};
