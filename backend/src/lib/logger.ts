import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, printf, colorize, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: env.IS_PRODUCTION ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    env.IS_PRODUCTION ? json() : combine(colorize(), customFormat)
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
