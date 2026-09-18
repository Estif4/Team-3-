import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api.js';
import { RegisterFormValues } from '../schemas/auth.schema.js';
import { useAuthStore } from '../../../app/store.js';

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterFormValues) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...rest } = data;
      return authApi.register(rest);
    },
    onSuccess: (res) => {
      const { user, tokens } = res.data;
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      navigate('/');
    },
  });
};
