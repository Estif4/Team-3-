import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
  avatar: z.string().url().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
  avatar: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});
