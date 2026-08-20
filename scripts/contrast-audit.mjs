#!/usr/bin/env node
/**
 * WCAG contrast audit for the PrimeTrack palette.
 *
 * Reads the colour tokens straight out of src/styles/global.css so the audit
 * can never drift from the design system, then checks every foreground/
 * background pair the site actually uses.
 *
 * Thresholds: 4.5:1 body text, 3:1 large text (>=24px or >=18.66px bold)
 * and non-text UI (WCAG 2.2 SC 1.4.3 / 1.4.11).
 */
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g)].map((m) => [m[1], m[2]]),
);
tokens.white = '#ffffff';
tokens.black = '#000000';

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
};
const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/** [foreground, background, minimum required, what it is used for] */
const PAIRS = [
  ['ink-800', 'white', 4.5, 'body copy on white'],
  ['ink-600', 'white', 4.5, 'secondary body on white'],
  ['ink-500', 'white', 4.5, 'muted text on white'],
  ['ink-600', 'ink-50', 4.5, 'body copy on tinted'],
  ['ink-500', 'ink-50', 4.5, 'muted text on tinted'],
  ['ink-950', 'white', 4.5, 'headings on white'],

  ['white', 'ink-950', 4.5, 'body on dark'],
  ['ink-300', 'ink-950', 4.5, 'lead copy on dark'],
  ['ink-400', 'ink-950', 4.5, 'muted text on dark'],
  ['ink-400', 'ink-900', 4.5, 'muted text on dark panel'],

  ['prime-700', 'white', 4.5, 'orange link/text + eyebrow on white'],
  ['prime-700', 'ink-50', 4.5, 'orange link/text on tinted'],
  ['prime-600', 'white', 3.0, 'orange large text / UI on white'],
  ['prime-700', 'white', 3.0, 'focus ring on white'],
  ['prime-400', 'ink-950', 3.0, 'focus ring on dark'],
  ['ink-800', 'ink-50', 4.5, 'body copy on tinted'],
  ['prime-600', 'prime-50', 3.0, 'orange icon in orange chip'],
  ['prime-400', 'ink-950', 4.5, 'orange text on dark'],
  ['prime-500', 'ink-950', 3.0, 'orange UI on dark'],
  ['ink-950', 'prime-500', 4.5, 'primary button label on orange'],
  ['ink-950', 'prime-400', 4.5, 'primary button label, hover'],
  ['ink-950', 'prime-600', 4.5, 'primary button label, active'],
  ['white', 'ink-900', 4.5, 'body on ink panel'],
  ['prime-400', 'ink-900', 4.5, 'orange label on ink panel'],
  ['prime-300', 'ink-900', 4.5, 'placeholder label on dark'],
  ['prime-600', 'ink-50', 3.0, 'orange icon on tinted'],

  ['data-700', 'white', 4.5, 'blue text/link on white'],
  ['data-700', 'ink-50', 4.5, 'blue text on tinted'],
  ['data-600', 'white', 3.0, 'blue large text / UI on white'],
  ['data-500', 'white', 3.0, 'chart stroke on white'],
  ['data-600', 'data-50', 3.0, 'blue icon in blue chip'],
  ['data-500', 'ink-950', 3.0, 'blue UI on dark'],
  ['data-400', 'ink-950', 4.5, 'blue data marks on the dark console'],
  ['data-300', 'ink-950', 4.5, 'blue labels on the dark console'],
  ['data-200', 'ink-950', 4.5, 'endpoint labels on the dark console'],
  ['data-400', 'ink-900', 4.5, 'blue data marks on the console gradient'],
  ['data-200', 'ink-900', 4.5, 'endpoint labels on the console gradient'],
  ['prime-300', 'ink-950', 4.5, 'source-node label on the dark console'],

  ['white', 'ink-700', 4.5, 'active service label on the slate rail'],
  ['ink-200', 'ink-700', 4.5, 'resting service label on the slate rail'],
  ['ink-300', 'ink-700', 4.5, 'service descriptor on the slate rail'],
  ['ink-400', 'ink-700', 3.0, 'row index + arrow on the slate rail'],
  ['prime-400', 'ink-700', 4.5, 'active row index on the slate rail'],
  ['prime-300', 'ink-700', 4.5, 'active row icon on the slate rail'],
  ['data-300', 'ink-700', 4.5, 'resting row icon on the slate rail'],
  ['ink-300', 'ink-800', 4.5, 'rail copy at the dark end of the gradient'],

  ['ink-900', 'ink-100', 4.5, 'resting service label on the grey rail card'],
  ['ink-600', 'ink-100', 4.5, 'service descriptor on the grey rail card'],
  ['ink-500', 'ink-100', 4.5, 'row index + arrow on the grey rail card'],
  ['prime-800', 'ink-100', 4.5, 'active row accent on the grey rail card'],
  ['data-600', 'white', 3.0, 'resting row icon in its white chip'],
  ['ink-950', 'white', 4.5, 'active service label on the white rail card'],
  ['prime-800', 'white', 4.5, 'active row index + arrow on the white rail card'],
  ['prime-800', 'prime-50', 4.5, 'active row icon in its orange chip'],


  ['signal-700', 'white', 4.5, 'red text on white'],
  ['signal-500', 'ink-950', 3.0, 'live dot on dark'],
  ['signal-400', 'ink-950', 4.5, 'alert text on dark'],
];

let failures = 0;
const rows = PAIRS.map(([fg, bg, min, use]) => {
  const hexFg = tokens[fg];
  const hexBg = tokens[bg];
  if (!hexFg || !hexBg) {
    failures++;
    return { fg, bg, r: 'MISSING TOKEN', min, use, ok: false };
  }
  const r = ratio(hexFg, hexBg);
  const ok = r >= min;
  if (!ok) failures++;
  return { fg, bg, r: r.toFixed(2), min, use, ok };
});

const w = (s, n) => String(s).padEnd(n);
console.log(`\n  ${w('FOREGROUND', 13)}${w('BACKGROUND', 12)}${w('RATIO', 8)}${w('MIN', 6)}USAGE`);
console.log('  ' + '-'.repeat(88));
for (const row of rows) {
  console.log(
    `  ${row.ok ? ' ' : '!'} ${w(row.fg, 11)}${w(row.bg, 12)}${w(row.r, 8)}${w(row.min.toFixed(1), 6)}${row.use}`,
  );
}
console.log('  ' + '-'.repeat(88));
console.log(
  failures === 0
    ? `  PASS — all ${rows.length} pairs meet their WCAG threshold.\n`
    : `  FAIL — ${failures} of ${rows.length} pairs below threshold.\n`,
);
process.exit(failures === 0 ? 0 : 1);
