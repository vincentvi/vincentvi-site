// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://vincentvi.me',

  integrations: [
    sitemap({
      // unlisted pages: reachable by direct URL only, never advertised
      filter: (page) => !page.includes('/framework'),
    }),
  ],

  adapter: cloudflare(),
});