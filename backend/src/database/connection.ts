import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`[MongoDB] Connected to database: ${conn.connection.name} at ${conn.connection.host}`);
  } catch (error) {
    logger.error('[MongoDB] Connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('[MongoDB] Disconnected');
  } catch (error) {
    logger.error('[MongoDB] Disconnect error:', error);
  }
};
