import { z } from 'zod';

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
  isActive: z.boolean().optional(),
});

export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;
