#!/usr/bin/env node
/**
 * Neon Breath sign importer
 * ------------------------------------------------------------------
 * Turns a folder of sign photos into fixed-ratio WebP specimens plus a
 * ready-to-paste block of `Sign` objects for src/pages/tinkering/neon-breath.astro
 *
 *   npm run import:signs
 *   npm run import:signs -- --dry        (show the plan, write nothing)
 *
 * EXPECTED INPUT — one image per sign, flat, no sub-folders:
 *
 *   ~/Downloads/neon-import/
 *     01-8ight-coffee.png
 *     02-pho-hoa.jpg
 *     03-cheo-leo@top.png     <- see CROP below
 *
 * The leading "NN-" sets the specimen number and sort order. The rest of
 * the filename becomes the slug. Both are optional: with no number, files
 * are numbered by natural sort order.
 *
 * CROP — every specimen is cropped to exactly 1080x810 (4:3) so the
 * carousel frame never has to crop at render time. The crop is taken from
 * the centre by default. Append "@top", "@bottom", "@left" or "@right" to
 * the filename when the sign sits off-centre and the middle crop would
 * clip it:
 *
 *     03-cheo-leo@top.png   ->  crop anchored to the top edge
 *
 * OUTPUT:
 *   public/signs/001-8ight-coffee.webp        (1080x810, the specimen)
 *   public/signs/001-8ight-coffee-thumb.webp  (240x180, the strip)
 *   a printed `Sign` object per photo — paste into the signs[] array and
 *   fill in lat, lng and tags by hand.
 *
 * Non-destructive: only writes into public/signs/, never touches the
 * .astro file. sharp comes free with Astro, so nothing to install.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

// ---------------------------------------------------------------- settings
const SOURCE = path.join(os.homedir(), 'Downloads', 'neon-import');
const REPO = path.resolve(import.meta.dirname, '..');
const OUT = path.join(REPO, 'public', 'signs');

// The frame is 4:3. Instagram never stores more than 1080px on the long
// edge, so 1080x810 is the ceiling of what is actually in these files —
// going bigger would only invent pixels.
const TARGET_W = 1080;
const TARGET_H = 810;
const QUALITY = 82;

// The thumb strip renders every sign in the archive at once, so these
// have to be genuinely small. 240x180 covers a 4.5rem slot at 3x.
const THUMB_W = 240;
const THUMB_H = 180;
const THUMB_QUALITY = 72;

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif']);
const POSITIONS = new Set(['top', 'bottom', 'left', 'right', 'centre', 'center']);

// ---------------------------------------------------------------- args
const args = process.argv.slice(2);
const DRY = args.includes('--dry');

// ---------------------------------------------------------------- helpers
const isImage = (f) => EXTS.has(path.extname(f).toLowerCase()) && !f.startsWith('.');

const natural = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

/** "01-8ight-coffee@top.png" -> { num: 1, slug: "8ight-coffee", position: "top" } */
function parseName(file) {
  let base = path.parse(file).name;

  let position = 'centre';
  const at = base.lastIndexOf('@');
  if (at !== -1) {
    const suffix = base.slice(at + 1).toLowerCase();
    if (POSITIONS.has(suffix)) {
      position = suffix === 'center' ? 'centre' : suffix;
      base = base.slice(0, at);
    }
  }

  let num = null;
  const m = base.match(/^(\d+)[-_]+(.*)$/);
  if (m) {
    num = Number(m[1]);
    base = m[2];
  }

  const slug = base
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return { num, slug, position };
}

/** "8ight-coffee" -> "8ight Coffee" (a starting point; edit it afterwards) */
const titleFromSlug = (slug) =>
  slug.replace(/-+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const pad3 = (n) => String(n).padStart(3, '0');
const kb = (n) => `${Math.round(n / 1024)}kB`;

// ---------------------------------------------------------------- main
async function main() {
  try {
    await fs.access(SOURCE);
  } catch {
    console.error(`\n  No source folder at:\n    ${SOURCE}\n`);
    console.error('  Create it, then drop one image per sign inside.\n');
    process.exit(1);
  }

  const files = (await fs.readdir(SOURCE)).filter(isImage).sort(natural);

  if (!files.length) {
    console.error(`\n  No images found in ${SOURCE}\n`);
    process.exit(1);
  }

  if (!DRY) await fs.mkdir(OUT, { recursive: true });

  console.log(`\n  ${DRY ? 'DRY RUN — ' : ''}${files.length} sign photo(s)`);
  console.log(`  target: ${TARGET_W}x${TARGET_H} webp q${QUALITY}\n`);

  const entries = [];
  let totalBytes = 0;
  let auto = 0;

  for (const file of files) {
    const { num, slug, position } = parseName(file);
    auto += 1;
    const n = num ?? auto;

    const src = path.join(SOURCE, file);
    const meta = await sharp(src).metadata();

    // EXIF orientation can swap the reported width/height — .rotate() below
    // fixes the pixels, this fixes the number we warn about.
    const swapped = (meta.orientation ?? 1) >= 5;
    const srcW = swapped ? meta.height : meta.width;
    const srcH = swapped ? meta.width : meta.height;

    const { data, info } = await sharp(src)
      .rotate()
      .resize(TARGET_W, TARGET_H, { fit: 'cover', position, withoutEnlargement: false })
      .webp({ quality: QUALITY })
      .toBuffer({ resolveWithObject: true });

    // Same crop, small. Derived from the source rather than the full-size
    // output so the thumb isn't a resize of a resize.
    const thumbData = await sharp(src)
      .rotate()
      .resize(THUMB_W, THUMB_H, { fit: 'cover', position, withoutEnlargement: false })
      .webp({ quality: THUMB_QUALITY })
      .toBuffer();

    const outName = `${pad3(n)}-${slug}.webp`;
    const thumbName = `${pad3(n)}-${slug}-thumb.webp`;
    if (!DRY) {
      await fs.writeFile(path.join(OUT, outName), data);
      await fs.writeFile(path.join(OUT, thumbName), thumbData);
    }
    totalBytes += data.length + thumbData.length;

    const thin = srcW < TARGET_W || srcH < TARGET_H;
    const flag = thin ? `  ⚠ source only ${srcW}x${srcH} — upscaled` : '';
    const crop = position === 'centre' ? '' : `  crop:${position}`;
    console.log(
      `  ${outName}  ${info.width}x${info.height} (${kb(data.length)})` +
        `  + thumb (${kb(thumbData.length)})${crop}${flag}`
    );

    entries.push({ n, slug, outName, thumbName, title: titleFromSlug(slug) });
  }

  console.log(`\n  Total: ${kb(totalBytes)}`);
  if (DRY) console.log('  (dry run — nothing was written)');

  // ------------------------------------------------ the paste block
  console.log(`\n  ── paste into signs[] in src/pages/tinkering/neon-breath.astro ──\n`);
  for (const e of entries) {
    console.log(`  {
    num: '№ ${pad3(e.n)}',
    title: '${e.title.replace(/'/g, "\\'")}',
    photo: '/signs/${e.outName}',
    thumb: '/signs/${e.thumbName}',
    lat: 0, lng: 0,     // TODO — right-click the storefront in Google Maps
    tags: [],           // TODO — letterform styles, from STYLE_TAGS
  },`);
  }
  console.log(`
  Then:
    1. Fill in the TODOs
    2. npm run dev  — check the carousel, the pin, and the Maps link
    3. Commit and push
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
