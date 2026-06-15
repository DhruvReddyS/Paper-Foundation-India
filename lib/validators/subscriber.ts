import { z } from 'zod';
export const subscriberSchema = z.object({ name: z.string() });
