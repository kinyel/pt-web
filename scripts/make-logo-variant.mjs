#!/usr/bin/env node
/**
 * Derives a light-on-dark version of the PrimeTrack logo.
 *
 * The supplied logo is a black wordmark inside an orange ring on transparency,
 * which disappears against the dark footer and dark nav surfaces. Rather than
 * filter the whole mark to white (which would throw away the brand orange),
 * this recolours only the near-black pixels and leaves every orange pixel
 * exactly as the client drew it.
 *
 * Run: node scripts/make-logo-variant.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/assets/brand/primetrack-logo.png', import.meta.url));
const out = fileURLToPath(new URL('../src/assets/brand/primetrack-logo-light.png', import.meta.url));

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

let recoloured = 0;
for (let i = 0; i < data.length; i += 4) {
  const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  if (a === 0) continue;
  // Near-neutral and dark => it is wordmark ink, not brand orange.
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max < 110 && max - min < 40) {
    const lift = 255 - max; // preserve the anti-aliased edge ramp
    data[i] = Math.min(255, r + lift);
    data[i + 1] = Math.min(255, g + lift);
    data[i + 2] = Math.min(255, b + lift);
    recoloured++;
  }
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log(`light logo written (${recoloured} ink pixels lifted to white) -> ${out}`);
