#!/usr/bin/env node
/**
 * Reports every image slot still waiting on a real asset, and verifies the
 * registry and the pages agree.
 *
 * Two failure modes it catches:
 *   - a slot declared in src/data/placeholders.ts that no page actually uses
 *     (stale entry on the client's to-do list)
 *   - a <MediaPlaceholder slot="..."> on a page with no registry entry
 *     (a placeholder nobody will ever be told about)
 *
 * Run: node scripts/placeholder-report.mjs
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { placeholderSlots } from '../src/data/placeholders.ts';

const pagesDir = fileURLToPath(new URL('../src/pages', import.meta.url));

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : path.endsWith('.astro') ? [path] : [];
  });

/** Every slot id actually placed on a page, with the file it sits in. */
const used = new Map();
for (const file of walk(pagesDir)) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/<MediaPlaceholder\s+slot="([a-z0-9-]+)"/g)) {
    used.set(match[1], file.replace(`${pagesDir}/`, ''));
  }
}

const registered = new Set(placeholderSlots.map((s) => s.id));
const orphanRegistry = placeholderSlots.filter((s) => !used.has(s.id));
const orphanPages = [...used.keys()].filter((id) => !registered.has(id));

console.log(`\n  ${placeholderSlots.length} image slot(s) awaiting a real asset\n`);
console.log('  ' + '='.repeat(94));
for (const slot of placeholderSlots) {
  console.log(`\n  ${slot.id}${used.has(slot.id) ? '' : '   [NOT PLACED ON ANY PAGE]'}`);
  console.log(`    page      ${slot.page}`);
  console.log(`    where     ${slot.location}`);
  console.log(`    size      ${slot.recommended}  (${slot.ratio})`);
  console.log(`    needs     ${slot.needs}`);
}
console.log('\n  ' + '='.repeat(94));

let failures = 0;
if (orphanRegistry.length) {
  failures += orphanRegistry.length;
  console.log(`\n  ! ${orphanRegistry.length} registered slot(s) are not used by any page:`);
  for (const s of orphanRegistry) console.log(`      ${s.id}`);
}
if (orphanPages.length) {
  failures += orphanPages.length;
  console.log(`\n  ! ${orphanPages.length} placeholder(s) on pages have no registry entry:`);
  for (const id of orphanPages) console.log(`      ${id} (${used.get(id)})`);
}

console.log(
  failures === 0
    ? `\n  PASS — registry and pages agree.\n`
    : `\n  FAIL — ${failures} mismatch(es).\n`,
);
process.exit(failures === 0 ? 0 : 1);
