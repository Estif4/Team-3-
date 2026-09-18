import { z } from 'zod';

export const createExampleSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export const updateExampleSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().min(5).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export const exampleIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});
