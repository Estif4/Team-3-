import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { appRouter } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { globalRateLimiter } from './middlewares/rateLimit.middleware.js';

export const createApp = (): Express => {
  const app = express();

  // Security & standard middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  if (!env.IS_PRODUCTION) {
    app.use(morgan('dev'));
  }

  // Apply rate limiter
  app.use(env.API_PREFIX, globalRateLimiter);

  // Mount API routes
  app.use(env.API_PREFIX, appRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};
