import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { PORTFOLIO_TABS } from './config';

const tabIds = PORTFOLIO_TABS.map((t) => t.id) as [string, ...string[]];

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
    // Which tab the project lives under. Must match an id in PORTFOLIO_TABS
    // (src/config.ts) — anything else fails the build with a clear message.
    tab: z.enum(tabIds),
    category: z.string(),          // free-text sub-label (used off the wall)
    cover: z.string(),             // path under /public, e.g. /images/x.svg
    // The cover's real pixel dimensions. The portfolio wall keeps each
    // image's own proportions, so these let the browser reserve the right
    // space before the image loads — no jumping as the wall fills in.
    coverWidth: z.number().default(800),
    coverHeight: z.number().default(600),
    // Extra images for the project page carousel. The cover stays the hero and
    // the wall thumbnail; these are everything else — spreads, mockups, the
    // second angle. `src` is all that is required; caption is worth writing
    // because it is the only text on the page a search engine or a language
    // model can attach to the image.
    gallery: z
      .array(
        z.object({
          src: z.string(),
          caption: z.string().optional(),
        })
      )
      .default([]),
    year: z.number(),
    order: z.number().default(99), // lower = earlier WITHIN its tab
    // Import 30 at once, publish them one at a time. Drafts are visible in
    // `npm run dev` and excluded from the built site, so you can write the
    // copy for each project at your own pace without hiding the images from
    // yourself while you do it.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, portfolio };
