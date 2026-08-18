#!/usr/bin/env node
/**
 * Post-build QA over dist/: link integrity, heading structure, SEO tags and
 * the content rules from the build brief. Read-only — reports, never fixes.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const problems = [];
const note = (msg) => problems.push(msg);

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const routes = htmlFiles.map((f) => '/' + relative(DIST, f).replace(/index\.html$/, ''));

console.log(`Pages built: ${htmlFiles.length}\n`);

const internalLinks = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const route = '/' + relative(DIST, file).replace(/index\.html$/, '');

  // --- SEO tags -----------------------------------------------------------
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) note(`${route} — expected exactly one <h1>, found ${h1s.length}`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) note(`${route} — missing or too-short <title>`);
  if (!/name="description" content="[^"]{50,}"/.test(html))
    note(`${route} — missing or too-short meta description`);
  if (!/rel="canonical"/.test(html)) note(`${route} — missing canonical`);
  if (!/property="og:title"/.test(html)) note(`${route} — missing Open Graph tags`);
  if (!/application\/ld\+json/.test(html)) note(`${route} — no JSON-LD`);

  // --- Landmarks ----------------------------------------------------------
  for (const landmark of ['<main', '<footer', '<nav']) {
    if (!html.includes(landmark)) note(`${route} — missing ${landmark}> landmark`);
  }

  // --- Forbidden claims ---------------------------------------------------
  if (/lifetime\s+warrant/i.test(html)) note(`${route} — contains "Lifetime Warranty"`);

  // --- Images need alt text ----------------------------------------------
  for (const img of html.match(/<img[^>]*>/g) ?? []) {
    if (!/\salt="/.test(img)) note(`${route} — <img> without alt: ${img.slice(0, 70)}`);
  }

  // --- Collect internal links --------------------------------------------
  for (const match of html.matchAll(/href="(\/[^"#]*)"/g)) {
    const href = match[1];
    if (!internalLinks.has(href)) internalLinks.set(href, new Set());
    internalLinks.get(href).add(route);
  }
}

/**
 * Assets the client still has to supply (see public/images/README.md). These
 * are linked deliberately — the paths are correct and go live the moment the
 * file is dropped in — so they are reported as pending, not as defects.
 */
const PENDING_ASSETS = new Set(['/primetrack_cac_ncc_frsc certifictes.pdf']);
const pending = [];

// --- Link integrity --------------------------------------------------------
for (const [href, sources] of internalLinks) {
  const decoded = decodeURIComponent(href);
  const asPage = join(DIST, decoded, 'index.html');
  const asFile = join(DIST, decoded);
  if (existsSync(asPage) || existsSync(asFile)) continue;
  if (PENDING_ASSETS.has(decoded)) {
    pending.push(`${decoded} — linked from ${sources.size} page(s); drop the file into public/`);
    continue;
  }
  note(`broken internal link "${href}" — linked from ${[...sources].join(', ')}`);
}

// --- Sitemap ---------------------------------------------------------------
const sitemapFile = walk(DIST).find((f) => f.endsWith('sitemap-0.xml'));
if (!sitemapFile) {
  note('sitemap-0.xml not generated');
} else {
  const sitemap = readFileSync(sitemapFile, 'utf8');
  if (sitemap.includes('/design-system')) note('sitemap includes /design-system (should be excluded)');
  if (sitemap.includes('/404')) note('sitemap includes /404 (should be excluded)');
  const urlCount = (sitemap.match(/<loc>/g) ?? []).length;
  console.log(`Sitemap URLs: ${urlCount}`);
}

console.log(`Routes: ${routes.sort().join('  ')}\n`);

if (pending.length > 0) {
  console.log('Pending client assets (not defects):\n');
  for (const item of pending) console.log(`  … ${item}`);
  console.log('');
}

if (problems.length === 0) {
  console.log('QA passed — no problems found.');
} else {
  console.log(`QA found ${problems.length} problem(s):\n`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exitCode = 1;
}
