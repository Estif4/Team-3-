import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm.js';
import { Layers } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your account to continue</p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-400 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
