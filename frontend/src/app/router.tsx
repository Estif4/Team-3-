import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App.js';
import { LoginPage } from '../features/auth/pages/Login.js';
import { RegisterPage } from '../features/auth/pages/Register.js';
import { UsersPage } from '../features/users/pages/UsersPage.js';
import { ExamplePage } from '../features/example-feature/pages/ExamplePage.js';
import { PublicRoute } from '../routes/PublicRoute.js';

// Home Dashboard Component
const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/30 via-slate-900 to-slate-950 border border-blue-800/30">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          MERN Hackathon Starter
        </h1>
        <p className="mt-3 text-slate-300 max-w-2xl text-base">
          Production-grade React + TypeScript + Vite frontend with Express + MongoDB + TypeScript backend. Pre-configured with Auth, CRUD modules, Tailwind CSS, TanStack Query, and Zustand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-2">🚀 Frontend Stack</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• React 18 + Vite + TypeScript</li>
            <li>• Tailwind CSS for high-speed styling</li>
            <li>• TanStack Query for server state caching</li>
            <li>• Zustand for authentication & app state</li>
            <li>• React Hook Form + Zod for type-safe validation</li>
          </ul>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-2">⚡ Backend Stack</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• Node.js + Express + TypeScript</li>
            <li>• MongoDB + Mongoose with Repository Pattern</li>
            <li>• JWT Authentication & Refresh Tokens</li>
            <li>• Zod Schema Middleware Validation</li>
            <li>• Socket.IO Realtime & Redis Caching ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: 'examples',
        element: <ExamplePage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
