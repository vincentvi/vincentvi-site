#!/usr/bin/env node
/**
 * Portfolio importer
 * ------------------------------------------------------------------
 * Turns a folder of raw project photos into optimised WebP images plus a
 * ready-to-edit Markdown stub for each project.
 *
 *   npm run import:portfolio
 *   npm run import:portfolio -- --tab hand-lettering --category "Lettering"
 *   npm run import:portfolio -- --dry          (show the plan, write nothing)
 *   npm run import:portfolio -- --force        (overwrite existing .md stubs)
 *
 * EXPECTED INPUT — one folder per project:
 *
 *   ~/Downloads/portfolio-import/
 *     flip-the-script/
 *       cover.jpg          <- becomes the wall thumbnail + hero
 *       01-spread.jpg      <- becomes plate 1
 *       02-colophon.jpg    <- becomes plate 2
 *     the-gut-brain-book/
 *       ...
 *
 * The folder name becomes the URL slug, so name folders in kebab-case.
 * If no file is named "cover", the alphabetically first image is used.
 *
 * OUTPUT:
 *   public/images/portfolio/<slug>/cover.webp, plate-01.webp, ...
 *   src/content/portfolio/<slug>.md   (draft: true — publish when written)
 *
 * Nothing is destructive: existing .md files are skipped unless --force.
 * sharp comes free with Astro, so there is nothing to install.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

// ---------------------------------------------------------------- settings
const SOURCE = path.join(os.homedir(), 'Downloads', 'portfolio-import');
const REPO = path.resolve(import.meta.dirname, '..');
const IMAGE_OUT = path.join(REPO, 'public', 'images', 'portfolio');
const CONTENT_OUT = path.join(REPO, 'src', 'content', 'portfolio');

// Covers only ever render in a ~320px column (or as the page hero), so 1000px
// is already retina-generous. Plates get viewed large, hence the wider cap.
const COVER_MAX = 1000;
const PLATE_MAX = 1600;
const QUALITY = 82;

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif']);

// ---------------------------------------------------------------- args
const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const has = (name) => args.includes(`--${name}`);

const TAB = flag('tab', 'book-design');
const CATEGORY = flag('category', 'Book design');
const DRY = has('dry');
const FORCE = has('force');

// ---------------------------------------------------------------- helpers
const isImage = (f) => EXTS.has(path.extname(f).toLowerCase()) && !f.startsWith('.');

/** "01-spread.jpg" sorts before "10-spread.jpg" — plain sort gets this wrong. */
const natural = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

/** folder-name -> "Folder Name" (a starting point; edit it afterwards) */
const titleFromSlug = (slug) =>
  slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const yaml = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

async function processImage(src, dest, maxWidth) {
  const { data, info } = await sharp(src)
    .rotate() // honour EXIF orientation, or phone photos land sideways
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer({ resolveWithObject: true });

  if (!DRY) await fs.writeFile(dest, data);
  return { width: info.width, height: info.height, bytes: data.length };
}

const kb = (n) => `${Math.round(n / 1024)}kB`;

// ---------------------------------------------------------------- main
async function main() {
  try {
    await fs.access(SOURCE);
  } catch {
    console.error(`\n  No source folder at:\n    ${SOURCE}\n`);
    console.error('  Create it, then put one sub-folder per project inside.\n');
    process.exit(1);
  }

  const entries = await fs.readdir(SOURCE, { withFileTypes: true });
  const projects = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort(natural);
  const loose = entries.filter((e) => e.isFile() && isImage(e.name));

  if (loose.length) {
    console.warn(
      `\n  Skipping ${loose.length} loose image(s) in the root — put each project in its own folder.`
    );
  }
  if (!projects.length) {
    console.error(`\n  No project folders found in ${SOURCE}\n`);
    process.exit(1);
  }

  console.log(`\n  ${DRY ? 'DRY RUN — ' : ''}${projects.length} project folder(s)`);
  console.log(`  tab: ${TAB}   category: ${CATEGORY}\n`);

  let order = 1;
  let totalBytes = 0;

  for (const slug of projects) {
    const files = (await fs.readdir(path.join(SOURCE, slug)))
      .filter(isImage)
      .sort(natural);

    if (!files.length) {
      console.warn(`  ${slug} — no images, skipped`);
      continue;
    }

    // "cover.*" wins if present; otherwise the first file alphabetically.
    const coverIdx = files.findIndex((f) => /^cover\b/i.test(path.parse(f).name));
    const coverFile = files[coverIdx === -1 ? 0 : coverIdx];
    const plateFiles = files.filter((f) => f !== coverFile);

    const outDir = path.join(IMAGE_OUT, slug);
    if (!DRY) await fs.mkdir(outDir, { recursive: true });

    const cover = await processImage(
      path.join(SOURCE, slug, coverFile),
      path.join(outDir, 'cover.webp'),
      COVER_MAX
    );
    totalBytes += cover.bytes;

    const plates = [];
    for (const [i, file] of plateFiles.entries()) {
      const name = `plate-${String(i + 1).padStart(2, '0')}.webp`;
      const out = await processImage(
        path.join(SOURCE, slug, file),
        path.join(outDir, name),
        PLATE_MAX
      );
      totalBytes += out.bytes;
      plates.push({ name, source: path.parse(file).name });
    }

    // ------------------------------------------------ the markdown stub
    const mdPath = path.join(CONTENT_OUT, `${slug}.md`);
    let exists = false;
    try {
      await fs.access(mdPath);
      exists = true;
    } catch {}

    if (exists && !FORCE) {
      console.log(
        `  ${slug} — images written (${1 + plates.length}), .md exists, left alone`
      );
      order += 1;
      continue;
    }

    const gallery = plates.length
      ? `gallery:\n` +
        plates
          .map(
            (p) =>
              `  - src: "/images/portfolio/${slug}/${p.name}"\n` +
              `    caption: "" # ${p.source} — describe it; this becomes the alt text`
          )
          .join('\n')
      : `gallery: []`;

    const md = `---
title: ${yaml(titleFromSlug(slug))}
summary: "TODO — one sentence a client would recognise their own problem in."
tab: ${yaml(TAB)}
category: ${yaml(CATEGORY)}
cover: "/images/portfolio/${slug}/cover.webp"
coverWidth: ${cover.width}
coverHeight: ${cover.height}
${gallery}
year: ${new Date().getFullYear()}
order: ${order}
draft: true
---

TODO — three short paragraphs, in this order:

**The brief.** What the client actually needed, in their words if you have them.

**The problem.** The constraint that made it interesting. Page count, budget,
a title that would not fit, a genre convention worth breaking.

**The decision.** What you chose and why. This paragraph is the one that gets
quoted — by a reader deciding whether to hire you, and by a language model
answering "who designs good book interiors".

Then set \`draft: false\`.
`;

    if (!DRY) await fs.writeFile(mdPath, md, 'utf8');
    console.log(
      `  ${slug} — cover ${cover.width}x${cover.height} (${kb(cover.bytes)}) + ${plates.length} plate(s), stub written`
    );
    order += 1;
  }

  console.log(`\n  Total image weight: ${kb(totalBytes)}`);
  if (DRY) console.log('  (dry run — nothing was written)');
  console.log(`
  Next:
    1. npm run dev  — drafts are visible locally
    2. Edit each stub: title, summary, captions, the three paragraphs
    3. Set draft: false as each one is finished
    4. Adjust \`order\` to control what sits at the top of the column
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
