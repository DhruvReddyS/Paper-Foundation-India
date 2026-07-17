import { z } from "zod";

export const mythSchema = z.object({
  claim: z.string().trim().min(8).max(300),
  verdict: z.enum(["myth", "fact", "context"]),
  correction: z.string().trim().min(8).max(300),
  explanation: z.string().trim().min(20).max(3000),
  category: z.string().trim().min(2).max(60),
  sources: z.array(z.object({ label: z.string().min(2), url: z.string().url() })).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),
  status: z.enum(["draft", "review", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
});
