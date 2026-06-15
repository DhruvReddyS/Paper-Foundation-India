import { z } from 'zod';
export const articleSchema = z.object({ name: z.string() });
