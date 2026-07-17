import { z } from "zod";

export const inquirySchema = z.object({
  type: z.string().trim().min(2).max(80),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  subject: z.string().trim().min(2).max(240),
  message: z.string().trim().min(10).max(8000),
  sourceUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
});
