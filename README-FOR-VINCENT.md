# vincentvi.me — how to install this build

## What this is
A complete replacement for the starter template in your repo. Same stack you
already deployed (Astro → GitHub → Cloudflare Pages). Nine pages, ready to push.

## Install (10 minutes)

1. Unzip the folder somewhere (e.g. Downloads).
2. Open YOUR existing project and delete the old source (keep `.git`!):
   delete `src/`, `public/`, `astro.config.mjs`, `package.json`,
   `package-lock.json`, `tsconfig.json` from `~/Projects/vincentvi-site`.
   Do NOT touch the hidden `.git` folder.
3. Copy everything from the unzipped folder INTO `~/Projects/vincentvi-site`.
4. In Terminal:

       cd ~/Projects/vincentvi-site
       pwd                  # always. Should end in /vincentvi-site
       npm install
       npm run dev          # check localhost:4321 looks right, then Ctrl+C
       git add .
       git commit -m "Full site structure: portfolio, blog, contact, SEO"
       git push

   Cloudflare rebuilds automatically. ~1 minute later vincentvi.me updates.

## The 3 edits that make it YOURS (all in src/config.ts)

- Social links: replace the `#` placeholders with real URLs.
- Contact form: get a free access key at https://web3forms.com
  (enter your email, they send the key), paste it into
  `WEB3FORMS_ACCESS_KEY`. Until then the form exists but won't deliver.
- Tagline/description: edit `SITE.description` — it feeds Google + social previews.

## How to publish content

- New blog post: add a `.md` file to `src/content/blog/` — copy an existing
  one, change the front matter (title, description, pubDate). Write in
  Obsidian if you like; it's plain Markdown.
- New portfolio piece: add a `.md` file to `src/content/portfolio/`, drop the
  cover image into `public/images/`, point the `cover` field at it.
  `order` controls position on the page.
- Then: pwd → git add . → git commit -m "..." → git push.

## What's already handled (no action needed)

- SEO: titles, meta descriptions, canonical URLs, Open Graph tags,
  sitemap at /sitemap-index.xml, robots.txt.
- Fonts: Fraunces + Newsreader, self-hosted (no Google tracking, fast).
- Accessibility: keyboard focus, reduced-motion respect, alt text patterns.
- 404 page.

## Design notes (for when you redesign)

Every color/size lives as a CSS variable at the top of
`src/styles/global.css`. Change tokens there, the whole site follows.
Placeholder SVG covers are in `public/images/` — replace with real work.

## After pushing: register with Google (10 min, once)

1. https://search.google.com/search-console → Add property → vincentvi.me
2. Verify via DNS (Cloudflare makes this a one-record copy-paste).
3. Submit the sitemap URL: https://vincentvi.me/sitemap-index.xml
