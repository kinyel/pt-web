#!/usr/bin/env node
/**
 * Build-time content guard.
 *
 * Two rules from the build brief are easy to break by accident months from
 * now, so they are enforced mechanically rather than by memory:
 *
 *   1. The site must never claim a "Lifetime Warranty" — the warranty is
 *      3 years (client-confirmed, inventory §0.1).
 *   2. Every internal link must keep its trailing slash, because the live
 *      URLs use them and losing one costs a redirect hop (inventory §8).
 *
 * Run as part of `npm run build`. Non-zero exit fails the build.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC = 'src';
const EXTENSIONS = new Set(['.astro', '.ts', '.tsx', '.md', '.mdx']);

/** Paths that legitimately have no trailing slash. */
const SLASH_EXEMPT =
  /^(#|\/#|mailto:|tel:|https?:|\/\/|\{)|\.(pdf|svg|png|jpg|jpeg|webp|avif|xml|txt|ico|css|js)$/i;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(SRC).filter((f) => EXTENSIONS.has(extname(f)));
const errors = [];

for (const file of files) {
  const source = readFileSync(file, 'utf8');

  source.split('\n').forEach((line, i) => {
    const lineNumber = i + 1;

    // Rule 1 — forbidden warranty claim.
    if (/lifetime\s+warrant/i.test(line)) {
      errors.push(
        `${file}:${lineNumber} — "Lifetime Warranty" is forbidden. The warranty is 3 years.`,
      );
    }

    // Rule 2 — internal links keep their trailing slash.
    for (const match of line.matchAll(/href=["']([^"']+)["']/g)) {
      const href = match[1];
      if (SLASH_EXEMPT.test(href)) continue;
      if (!href.startsWith('/')) continue;
      if (href.endsWith('/')) continue;
      errors.push(
        `${file}:${lineNumber} — internal link "${href}" is missing its trailing slash.`,
      );
    }
  });
}

if (errors.length > 0) {
  console.error('\nContent check failed:\n');
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.error(`\n${errors.length} problem(s) found.\n`);
  process.exit(1);
}

console.log(`Content check passed — ${files.length} files, 0 problems.`);
