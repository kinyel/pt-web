# Image assets

Real image files live here and are processed by Astro at build time (AVIF + WebP,
width-based `srcset`, lazy below the fold). Nothing is hot-linked to the live site.

```
brand/
  primetrack-logo.png         real logo, 111×99 — SIZE CEILING, see below
  primetrack-logo-light.png   derived; white wordmark for dark surfaces
  accreditations.png          real regulator emblems, 180×58
products/
  vehicle-video-tracking-dashcam.jpg
  mdvr-camera-kit.jpg
  primesolar-solar-tracker.jpg
  fuel-monitoring.jpg
```

All six were downloaded from the paths recorded in
`docs/primetrack-content-inventory.md` §7.

## Rules

- **No stock photography, no AI-generated imagery, no mocked-up dashboards.** A labelled
  placeholder is more honest than a fake product shot, and a fabricated interface would be
  a false claim about the software. Slots without a real asset are declared in
  `src/data/placeholders.ts` and listed by `npm run check:placeholders`.
- Alt text lives in `src/data/media.ts` alongside the import, written from looking at the
  file. Quality caveats are recorded there too.
- The logo is crisp only up to ~48px tall (2× of a 99px-tall source). Do not render it
  larger until the client supplies a vector.

## Adding a real image

1. Drop the file in `products/`.
2. Add an entry to `src/data/media.ts` with descriptive alt text.
3. Replace `<MediaPlaceholder slot="…" />` with `<ContentImage asset={media.…} />`.
4. Delete the slot from `src/data/placeholders.ts`.
5. `npm run check:placeholders` must still pass.

## Regenerating derived assets

```bash
npm run assets:logo   # rebuilds the light-on-dark logo variant
npm run assets:og     # rebuilds the 1200×630 social card
```
