# PrimeTrack Nigeria — website

Rebuild of primetracknigeria.com as a static site: **Astro (static output) + React islands + Tailwind CSS**.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # content check + static build into dist/
npm run verify   # build + QA + GATE 4 content-preservation check
npm run check    # content rules, colour contrast, placeholder registry
```

`npm run build` runs `scripts/check-content.mjs` first and **fails** if either rule is broken:
the site must never claim a "Lifetime Warranty" (it is 3 years), and every internal link must keep
its trailing slash.

## How this project is organised

```
docs/                         The authoritative inputs and decisions
  primetrack-content-inventory.md   Content authority — the only source of facts
  primetrack-build-brief.md         Technical authority — stack, SEO, hosting, rules
  original-design-prompt.md         Visual direction (build brief overrides on conflict)
  information-architecture.md       Sitemap, nav, URL map, per-page SEO, punch-list
  handoff.md                        What is done, what is pending, how to finish it

src/
  assets/        Real image files (see assets/README.md). Processed at build time.
  data/          Verified content. company.ts, navigation.ts, schema.ts,
                 media.ts (real images + alt text), placeholders.ts (empty slots)
  components/    .astro for static UI, .tsx for the two interactive islands
  layouts/       BaseLayout (SEO head + JSON-LD), StubPage
  pages/         One file per route; filenames mirror the live URLs exactly
  styles/        global.css — the entire design system, in @theme tokens
  icons/         Project-owned SVGs (Lucide no longer ships brand marks)

scripts/         check-content.mjs      pre-build gate: warranty wording, trailing slashes
                 contrast-audit.mjs     WCAG check on every colour pair the site uses
                 placeholder-report.mjs empty image slots, cross-checked against the pages
                 gate4-coverage.mjs     every verified inventory fact is in the built HTML
                 qa-report.mjs          post-build links, headings, SEO, landmarks
                 make-og-image.mjs      regenerates the 1200x630 social card
                 make-logo-variant.mjs  derives the light-on-dark logo
public/          robots.txt, _redirects (Cloudflare), .htaccess (Hostinger),
                 favicon, og-primetrack.png
```

### Content rules

`docs/primetrack-content-inventory.md` is the only source of business facts. Nothing on this site —
no statistic, client name, logo, testimonial, certification or product claim — may be added unless it
appears there or the client supplies it in writing. Where a design slot needs content that does not
exist, it renders a visible `[PLACEHOLDER — client to confirm]` instead. The four permitted
statistics live in `src/data/company.ts`; do not extend that array without a verified source.

### Interactive islands (everything else ships as zero-JS HTML)

| Island | Hydration | Why |
|---|---|---|
| `Navbar.tsx` | `client:load` | Mobile drawer and mega-menus must work on first tap |
| `ContactForm.tsx` | `client:visible` | Below the fold on the contact page only |

### Design system

Every colour, type step, radius, shadow and motion token is defined once in
`src/styles/global.css` under `@theme`. `/design-system/` renders them all as a live reference —
it is `noindex` and excluded from the sitemap.

Brand hexes are extracted from PrimeTrack's own assets, not picked by eye — `#ff7000` orange,
`#f49200` light orange, `#ff5433` red and `#5694ff` blue all come from the live theme's stylesheet;
the file header records the provenance of each. **Orange is dominant** (brand, CTAs, products);
**blue is the supporting technology voice** (data, analytics, links, focus, routes); red is reserved
for live and alert states. `npm run check:contrast` reads the tokens straight out of `global.css`
and fails if any pair drops below its WCAG threshold — which is why primary buttons set black type
on orange rather than white (2.8:1 fails; black is 7.2:1).

### Images

Real files live in `src/assets/` and are converted to AVIF/WebP with a responsive `srcset` at build
time. **No stock photography, no AI-generated imagery, no mocked-up dashboards** — slots without a
real asset render a labelled placeholder declared in `src/data/placeholders.ts`. See
`src/assets/README.md`.

## Deploying

Static output, so it runs anywhere. See `docs/primetrack-build-brief.md` §E.

- **Cloudflare Pages (recommended):** connect the repo, build `npm run build`, output `dist`.
  `public/_redirects` is picked up automatically.
- **Hostinger:** run `npm run build` locally and upload the contents of `dist/` to `public_html`.
  `public/.htaccess` handles trailing slashes, the 404 and caching.

Set `PUBLIC_WEB3FORMS_KEY` in the host's environment variables before launch — see `.env.example`.
Until it is set, the contact form shows a visible "not connected" notice rather than silently
failing.
