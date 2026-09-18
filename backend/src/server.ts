import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './database/connection.js';
import { initSocketServer } from './sockets/socket.server.js';
import { initBackgroundJobs } from './jobs/index.js';
import { logger } from './lib/logger.js';
import { getRedisClient } from './lib/redis.js';

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Initialize Redis (optional connection test)
    getRedisClient();

    // 3. Create Express App & HTTP Server
    const app = createApp();
    const server = http.createServer(app);

    // 4. Initialize Socket.IO
    initSocketServer(server);

    // 5. Initialize Background Jobs
    initBackgroundJobs();

    // 6. Listen
    server.listen(env.PORT, () => {
      logger.info(`================================================`);
      logger.info(`  Server running in [${env.NODE_ENV}] mode`);
      logger.info(`  Listening on: http://localhost:${env.PORT}`);
      logger.info(`  API Endpoint: http://localhost:${env.PORT}${env.API_PREFIX}`);
      logger.info(`================================================`);
    });

    // Graceful shutdown
    const handleExit = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleExit('SIGINT'));
    process.on('SIGTERM', () => handleExit('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
