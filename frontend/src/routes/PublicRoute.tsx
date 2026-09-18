import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../app/store.js';

export const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
