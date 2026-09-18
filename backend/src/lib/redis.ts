import { Redis } from 'ioredis';
import { env } from '../config/env.js';
import { logger } from './logger.js';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (!redisClient && env.REDIS_HOST) {
    try {
      redisClient = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD,
        lazyConnect: true,
        retryStrategy: (times: number) => {
          if (times > 3) return null;
          return Math.min(times * 100, 2000);
        },
      });

      redisClient.on('connect', () => logger.info('[Redis] Connected successfully'));
      redisClient.on('error', (err: Error) => logger.warn('[Redis] Connection error or not running:', err.message));
    } catch (e) {
      logger.warn('[Redis] Failed to initialize Redis client');
    }
  }
  return redisClient;
};

export default getRedisClient;
