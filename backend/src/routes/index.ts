import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { userRoutes } from '../modules/users/user.routes.js';
import { exampleRoutes } from '../modules/example-module/module.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Register feature module routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/examples', exampleRoutes);

export const appRouter = router;
