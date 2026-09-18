import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon_db',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_jwt_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
  SMTP: {
    HOST: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    PORT: parseInt(process.env.SMTP_PORT || '2525', 10),
    USER: process.env.SMTP_USER || '',
    PASS: process.env.SMTP_PASS || '',
    FROM: process.env.EMAIL_FROM || 'noreply@example.com',
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    API_KEY: process.env.CLOUDINARY_API_KEY || '',
    API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  },
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
