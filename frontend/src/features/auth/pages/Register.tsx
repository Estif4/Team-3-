import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema, RegisterFormValues } from '../schemas/auth.schema.js';
import { useRegister } from '../hooks/useRegister.js';
import { Input } from '../../../components/ui/Input.js';
import { Button } from '../../../components/ui/Button.js';
import { Layers } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: doRegister, isPending, error } = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    doRegister(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
          <p className="text-sm text-slate-400 mt-1">Get started with your hackathon dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg">
            {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Registration failed. Please try again.'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

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

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isPending}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
