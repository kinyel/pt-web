#!/usr/bin/env node
/**
 * Generates the 1200×630 social share card at public/og-primetrack.png.
 *
 * Reproducible: run `node scripts/make-og-image.mjs` after any brand change.
 * Everything on the card is either the real logo file or one of the four
 * verified statistics — no invented numbers, no stock imagery.
 *
 * TYPE NOTE: the card is rasterised by librsvg, which can only use fonts
 * installed on the machine — it cannot see the Space Grotesk/Inter webfonts in
 * node_modules. It therefore falls back to a system grotesque. At the size a
 * share card is actually viewed this is not noticeable, but it is why the card
 * does not match the site's headline face exactly.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const W = 1200;
const H = 630;
const ORANGE = '#ff7000';
const SOFT = '#ffab6b';   // prime-300 — depth without a second hue
const LINE = '#ffffff';   // structural lines
const INK = '#08090b';

const stats = [
  ['5,000', 'Active trackers'],
  ['15+', 'Years experience'],
  ['5', 'Countries'],
  ['24/7', 'Support'],
];

const statCells = stats
  .map(([value, label], i) => {
    const x = 72 + i * 268;
    return `
      <text x="${x}" y="536" font-size="60" font-weight="700" fill="#ffffff"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            letter-spacing="-2">${value}</text>
      <text x="${x}" y="572" font-size="21" fill="#a8b1bd"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif">${label}</text>`;
  })
  .join('');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${LINE}" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
    <radialGradient id="hubGlow">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${SOFT}" stop-opacity="0.7"/>
    </linearGradient>
    <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
      <stop offset="52%" stop-color="#fff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="1"/>
    </linearGradient>
    <mask id="fade"><rect width="${W}" height="${H}" fill="url(#leftFade)"/></mask>
  </defs>

  <rect width="${W}" height="${H}" fill="${INK}"/>

  <g mask="url(#fade)">
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <circle cx="965" cy="212" r="150" fill="url(#hubGlow)"/>

    <path d="M 640 452 C 760 420 800 330 900 250 S 1160 150 1240 170" fill="none"
          stroke="${SOFT}" stroke-opacity="0.42" stroke-width="2"/>
    <path d="M 700 232 C 820 268 860 340 940 408 S 1150 442 1240 418" fill="none"
          stroke="${SOFT}" stroke-opacity="0.28" stroke-width="2"/>
    <path d="M 872 448 C 900 380 880 320 908 250 S 946 118 986 46" fill="none"
          stroke="${ORANGE}" stroke-opacity="0.4" stroke-width="2"/>

    <g fill="none" stroke="${LINE}" stroke-opacity="0.14" stroke-width="1">
      <circle cx="965" cy="212" r="96" stroke-dasharray="3 9"/>
      <circle cx="965" cy="212" r="152" stroke-dasharray="3 9"/>
    </g>

    <circle cx="965" cy="212" r="13" fill="none" stroke="${ORANGE}" stroke-opacity="0.65" stroke-width="2"/>
    <circle cx="965" cy="212" r="6" fill="${ORANGE}"/>
    <circle cx="806" cy="330" r="5" fill="${SOFT}"/>
    <circle cx="1128" cy="330" r="5" fill="${SOFT}"/>
  </g>

  <text x="72" y="268" font-size="76" font-weight="700" fill="#ffffff"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif" letter-spacing="-3">Efficient telematics</text>
  <text x="72" y="352" font-size="76" font-weight="700" fill="#ffffff"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif" letter-spacing="-3">is here</text>

  <text x="72" y="414" font-size="25" fill="#a8b1bd"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif">GPS tracking · Video telematics · Fleet management · Nigeria</text>

  <rect x="72" y="462" width="1056" height="2" fill="url(#rule)"/>
  ${statCells}
</svg>`;

const logo = fileURLToPath(new URL('../src/assets/brand/primetrack-logo-light.png', import.meta.url));
const out = fileURLToPath(new URL('../public/og-primetrack.png', import.meta.url));

await sharp(Buffer.from(svg))
  .composite([{ input: await sharp(logo).resize({ height: 92 }).png().toBuffer(), top: 64, left: 72 }])
  .png({ compressionLevel: 9 })
  .toFile(out);

const { size } = await import('node:fs').then((fs) => fs.promises.stat(out));
console.log(`og image written -> public/og-primetrack.png (${(size / 1024).toFixed(0)} KB)`);
