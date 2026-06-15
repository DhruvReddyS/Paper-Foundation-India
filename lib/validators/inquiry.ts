import { z } from 'zod';
export const inquirySchema = z.object({ name: z.string() });
