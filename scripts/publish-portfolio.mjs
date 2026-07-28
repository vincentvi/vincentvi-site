#!/usr/bin/env node
/**
 * Portfolio publisher
 * ------------------------------------------------------------------
 * Flips imported stubs from draft to published, and clears the placeholder
 * text so nothing embarrassing ships while the real copy is still unwritten.
 *
 *   npm run publish:portfolio -- --dry           show the plan, write nothing
 *   npm run publish:portfolio                    publish every draft
 *   npm run publish:portfolio -- --only flip-the-script,take-over
 *   npm run publish:portfolio -- --unpublish     put them back to draft
 *
 * For each file it touches:
 *   draft: true            ->  draft: false
 *   summary: "TODO — ..."  ->  "<Title> — book design by Vincent Vi."
 *   the TODO writing prompt in the body  ->  wrapped in an HTML comment
 *
 * That last one matters: the prompt stays in the file where you can see it
 * while writing, but HTML comments do not render, so the live page shows a
 * clean image-led project instead of a page of instructions to yourself.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(REPO, 'src', 'content', 'portfolio');

const args = process.argv.slice(2);
const has = (n) => args.includes(`--${n}`);
const flag = (n, d = null) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? d : args[i + 1];
};

const DRY = has('dry');
const UNPUBLISH = has('unpublish');
const ONLY = flag('only');
const onlySet = ONLY ? new Set(ONLY.split(',').map((s) => s.trim())) : null;

const PROMPT_START = 'TODO — three short paragraphs, in this order:';

async function main() {
  const files = (await fs.readdir(CONTENT)).filter((f) => f.endsWith('.md'));
  let touched = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = path.basename(file, '.md');
    if (onlySet && !onlySet.has(slug)) continue;

    const full = path.join(CONTENT, file);
    const before = await fs.readFile(full, 'utf8');
    let md = before;

    // ---- draft flag
    md = UNPUBLISH
      ? md.replace(/^draft:\s*false\s*$/m, 'draft: true')
      : md.replace(/^draft:\s*true\s*$/m, 'draft: false');

    // ---- placeholder summary -> something true, unique and harmless.
    // This is still a placeholder: it exists so the meta description is not
    // the word TODO. Replace it with a real sentence when you write the page.
    const titleMatch = md.match(/^title:\s*"(.*)"\s*$/m);
    const title = titleMatch ? titleMatch[1] : slug;
    md = md.replace(
      /^summary:\s*"TODO[^"]*"\s*$/m,
      `summary: "${title} — book design by Vincent Vi."`
    );

    // ---- hide the writing prompt without deleting it
    const i = md.indexOf(PROMPT_START);
    if (i !== -1 && !md.includes('<!-- WRITING PROMPT')) {
      const head = md.slice(0, i);
      const body = md.slice(i).trimEnd();
      md = `${head}<!-- WRITING PROMPT — delete this comment once the copy below is written.\n\n${body}\n-->\n`;
    }

    if (md === before) {
      skipped += 1;
      continue;
    }

    if (!DRY) await fs.writeFile(full, md, 'utf8');
    console.log(`  ${UNPUBLISH ? 'draft ' : 'live  '} ${slug}`);
    touched += 1;
  }

  console.log(
    `\n  ${DRY ? 'DRY RUN — ' : ''}${touched} file(s) changed, ${skipped} already in that state.`
  );
  if (!DRY) {
    console.log(`
  Now:
    npm run build && npm run preview     check it as the world will see it
    git add -A && git commit && git push
`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
