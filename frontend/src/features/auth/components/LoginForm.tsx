import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../schemas/auth.schema.js';
import { useLogin } from '../hooks/useLogin.js';
import { Input } from '../../../components/ui/Input.js';
import { Button } from '../../../components/ui/Button.js';

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending, error } = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg">
          {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Login failed. Please verify credentials.'}
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isPending}>
        Sign In
      </Button>
    </form>
  );
};
