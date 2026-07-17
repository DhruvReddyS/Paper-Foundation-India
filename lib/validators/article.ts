import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().trim().min(5).max(180),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(2).max(60),
  format: z.string().trim().max(60).default("Core lesson"),
  excerpt: z.string().trim().min(20).max(500),
  body: z.string().default(""),
  coverImage: z.string().default(""),
  readingMinutes: z.coerce.number().int().min(1).max(90).default(6),
  sources: z.array(z.object({ label: z.string().min(2), url: z.string().url() })).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),
  status: z.enum(["draft", "review", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  revisionNote: z.string().max(500).optional(),
});
