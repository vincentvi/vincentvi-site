import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),          // e.g. "Lettering", "Book design"
    cover: z.string(),             // path under /public, e.g. /images/x.svg
    year: z.number(),
    order: z.number().default(99), // lower = earlier on the page
  }),
});

export const collections = { blog, portfolio };
