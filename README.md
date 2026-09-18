# 🚀 Fullstack MERN Hackathon Starter Architecture

A clean, modular, production-ready fullstack MERN template built with TypeScript, modern tooling, and repository patterns.

---

## 📁 Project Architecture

```
Hackaton/
│
├── frontend/                     # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── app/                  # Router, Global Providers & Zustand Store
│   │   │   ├── router.tsx
│   │   │   ├── providers.tsx
│   │   │   └── store.ts
│   │   │
│   │   ├── assets/               # Static icons and images
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── components/           # Shared reusable components
│   │   │   ├── ui/               # Button, Input, Modal, etc.
│   │   │   ├── forms/
│   │   │   ├── tables/
│   │   │   └── layouts/          # Navbar, Sidebar
│   │   │
│   │   ├── features/             # Domain Feature Modules
│   │   │   ├── auth/             # API, Hooks, Components, Pages, Schemas, Types
│   │   │   ├── users/            # API, Hooks, Components, Pages, Schemas, Types
│   │   │   └── example-feature/  # Boilerplate CRUD feature
│   │   │
│   │   ├── hooks/                # Global custom hooks (useDebounce, usePagination)
│   │   ├── lib/                  # Axios instance, QueryClient, Socket client
│   │   ├── routes/               # ProtectedRoute & PublicRoute guards
│   │   ├── types/                # Global TypeScript definitions
│   │   ├── utils/                # Utility helpers (cn, formatting)
│   │   ├── App.tsx               # Root application shell
│   │   ├── main.tsx              # React DOM entrypoint
│   │   └── index.css             # Tailwind base styles
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── backend/                      # Express + Node.js + MongoDB + TypeScript
    ├── src/
    │   ├── config/               # Environment, Mongo, Cloudinary
    │   ├── database/             # Connection & database seed script
    │   ├── lib/                  # JWT helpers, Winston logger, Mailer, Redis
    │   ├── middlewares/          # Auth, Role, Error, Validation, Rate Limiter
    │   ├── utils/                # API Response, Pagination, Bcrypt Encryption
    │   ├── jobs/                 # Cron/Background job scheduler
    │   ├── sockets/              # Socket.IO event handler
    │   │
    │   ├── modules/              # 3-Tier Layered Feature Modules
    │   │   ├── auth/             # Controller -> Service -> Repository -> Model
    │   │   ├── users/
    │   │   └── example-module/
    │   │
    │   ├── routes/               # Central API router (/api/v1)
    │   ├── app.ts                # Express app setup & middleware stack
    │   └── server.ts             # HTTP server & database listener
    │
    ├── package.json
    ├── tsconfig.json
    └── .env.example
```

---

## 📦 How to Install and Run

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
> The API server runs at `http://localhost:5000/api/v1`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
> The Vite dev server runs at `http://localhost:5173`

---

## ⚡ Adding a New Feature (30-Second Pattern)

### Backend
1. Create `backend/src/modules/<feature-name>/`:
   - `<name>.types.ts`
   - `<name>.model.ts`
   - `<name>.validation.ts`
   - `<name>.repository.ts`
   - `<name>.service.ts`
   - `<name>.controller.ts`
   - `<name>.routes.ts`
2. Register in `backend/src/routes/index.ts`:
   ```ts
   router.use('/<feature-name>', featureRoutes);
   ```

### Frontend
1. Create `frontend/src/features/<feature-name>/`:
   - `types/`
   - `schemas/`
   - `api/`
   - `hooks/`
   - `components/`
   - `pages/`
2. Register route in `frontend/src/app/router.tsx`.
