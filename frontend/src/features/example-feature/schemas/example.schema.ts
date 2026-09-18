import { z } from 'zod';

export const exampleSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(), // Comma separated in input, split before sending
  isPublished: z.boolean().default(true),
});

export type ExampleFormValues = z.infer<typeof exampleSchema>;
