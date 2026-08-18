# PrimeTrack rebuild — handoff

Status: design system, build and responsive pass complete, plus the real-image integration,
the corrected brand hexes and the animated hero.

---

## 1. What is built

**20 pages**, every live URL preserved byte-for-byte with trailing slashes.

| Route | Status |
|---|---|
| `/` | Complete — animated SVG map behind the hero, stats band, 6 products, 4 services, why-choose, capabilities, credentials, CTA |
| `/vehicle-video-tracking-systems/` | Complete — Ai-PRIME, 19 report types, storage variants |
| `/primesolar/` | Complete — 6 claim points, 5 capabilities |
| `/vehicle-fleet-telematics-solutions-in-nigeria/` | Complete — 4 outcomes, 6 platform capabilities |
| `/reliable-container-tracking/` | Complete — STAR, 5 capabilities |
| `/employee-monitoring-solutions/` | Complete — 4 device formats, 5 capabilities |
| `/fleet-fuel-consumption-management-system/` | Complete — 3 inefficiencies, 3 capabilities |
| `/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/` | Complete — 3 pillars |
| `/gps-telematics-api-integrations/` | Complete — 5 benefits |
| `/fleet-analytics/` | Complete — all 15 capabilities, grouped |
| `/contact-prime/` | Complete — validated form, map, both phones, socials |
| `/why-choose-primetrack/` | Complete — all 7 advantages, P.R.I.M.E. values |
| `/warranty/` | Complete — 3-year policy, covered/excluded |
| `/careers/` `/iccp/` `/tools/` `/service-terms/` `/egy/` | **Stubs** — awaiting client copy (§3) |
| `/404.html` | Complete |
| `/design-system/` | Internal reference — noindex, excluded from sitemap |

Per page: unique title and meta description, canonical, Open Graph + Twitter card,
`Organization` JSON-LD everywhere plus `Product` / `Service` / `BreadcrumbList` where relevant,
one `<h1>`, real `<nav>` / `<main>` / `<footer>` landmarks, skip link.

`sitemap-index.xml` + `sitemap-0.xml` (18 URLs — `/404` and `/design-system/` excluded),
`robots.txt`, and redirect files for both hosting options.

---

## 2. Blocking items — the site cannot fully launch without these

| # | Item | Impact if unresolved |
|---|---|---|
| 1 | **Web3Forms account + `PUBLIC_WEB3FORMS_KEY`** (destination: admin@primetracknigeria.net) | Contact form cannot send. It currently shows a visible "not connected" notice rather than pretending to work. |
| 2 | **Hosting decision** — Cloudflare Pages (recommended) or Hostinger | Both redirect files ship; only the chosen one is used. |
| 3 | **`primetrack_cac_ncc_frsc certifictes.pdf`** — copy into `public/` keeping the exact filename | Certificates link (footer, homepage, why-choose) 404s. Keep the space and original spelling; it is an indexed asset. |

---

## 3. Content the client still owes

| # | Item | Where it lands |
|---|---|---|
| 4 | Copy for `/careers/`, `/iccp/`, `/tools/`, `/service-terms/`, `/egy/` | Five stub pages. They are indexable and preserve their URLs, but say plainly that content is pending. Nothing was written on the client's behalf — legal copy especially is never paraphrased. |
| 5 | **"Brands we serve"** — real client logos, or confirm the section stays omitted | Currently omitted from the homepage. The live section contains no real names or logos, and a placeholder logo wall reads weaker than no section. |
| 6 | **vRAS** — keep in the Nigeria nav or remove? | Currently in the Services menu as an external link to primetrack.rw, marked as opening the Rwanda site. |
| 7 | **Vector logo (SVG or EPS)** | The real logo is now in use, but the only file the live site publishes is 111×99px. It is crisp up to ~48px tall and cannot go larger. See §4. |
| 8 | **Confirm the SON accreditation** | The accreditations graphic shows NCC and SON emblems, but the certificates PDF is named for CAC, NCC and FRSC. SON is not corroborated anywhere in the content inventory. The graphic is displayed as published; **no accreditation claim is made in words**. Confirm before any copy references SON. |
| 9 | **Five photographs** | See the placeholder table in §4.2. |

---

## 4. Images

### 4.1 Real assets — fetched and in the repo

All six assets listed in content-inventory §7 were downloaded from the live site and are stored in
`src/assets/`. Astro converts each to AVIF and WebP at build time with a width-based `srcset`, capped
at the source file's own width so nothing is upscaled. Everything below the fold is lazy-loaded.

| Asset | Used on | State |
|---|---|---|
| `products/vehicle-video-tracking-dashcam.jpg` | `/vehicle-video-tracking-systems/` | Good. Genuine product photo. |
| `products/mdvr-camera-kit.jpg` | `/vehicle-video-tracking-systems/` | Good, but only 372×370. Fine at the size used; a larger original would help. |
| `products/primesolar-solar-tracker.jpg` | `/primesolar/` | **Marketing collage, not a product shot.** Baked-in text is unreadable at small sizes and cannot be restyled or translated. Worth replacing with a plain photograph of the device. |
| `products/fuel-monitoring.jpg` | `/fleet-fuel-consumption-management-system/` | **Weakest asset.** Generic stock composite showing no PrimeTrack hardware, and the baked-in word "MONITORING" is cropped off at the right edge in the original file. Recommended for replacement. |
| `brand/primetrack-logo.png` | Header, footer | Real logo, 111×99px. See the size ceiling below. |
| `brand/accreditations.png` | Homepage credentials | Real graphic, 180×58px. Shown at native size — a 2× render would just be upscaling. See item 8. |

**Logo size ceiling.** At 44px tall a 2× screen needs 98px of source width; the file has 111px. Do
not render the logo above ~48px tall until a vector is supplied. `Logo.astro` documents this inline.

**Logo on dark surfaces.** The supplied artwork has a black wordmark that disappears on the dark
footer. `scripts/make-logo-variant.mjs` derives `primetrack-logo-light.png` by lifting only the
near-black pixels to white — the brand orange ring is left exactly as drawn. Re-run it if the source
logo is ever replaced.

### 4.2 Placeholders — five slots still empty

No stock photography, no AI-generated imagery and no mocked-up dashboards were used anywhere. Every
remaining slot renders a labelled block reading "Image placeholder — client to supply" at the correct
aspect ratio for its position.

Run `npm run check:placeholders` for the live list. As of this build:

| Slot | Page | Needs | Size |
|---|---|---|---|
| `hero-fleet-photography` | `/` | A strong vertical photograph of a tracked vehicle or customer fleet — the first image a visitor sees. | 1200 × 1500px |
| `fleet-on-road` | `/vehicle-fleet-telematics-solutions-in-nigeria/` | A managed customer fleet on the road or at a depot — trucks, vans or buses, ideally Nigerian roads. | 1600 × 1000px |
| `driver-behaviour-review` | `/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/` | A driver-behaviour review actually happening — a manager and driver going over reports, or a depot briefing. **Not** a mocked-up dashboard. | 1600 × 1000px |
| `star-container-tracker` | `/reliable-container-tracking/` | The STAR tracker magnetically attached to a container or cargo unit, showing its real size. | 1600 × 1000px |
| `wearable-personnel-tracker` | `/employee-monitoring-solutions/` | The wearable devices — watch, keyring, modem and chip — ideally together for scale. | 1600 × 1000px |

Slots are declared in `src/data/placeholders.ts`. The report script cross-checks the registry against
the pages in both directions, so a slot cannot be quietly dropped from this list or added to a page
without appearing here.

To fill one: add the file to `src/assets/products/`, add an entry to `src/data/media.ts` with alt
text, then swap `<MediaPlaceholder slot="…" />` for `<ContentImage asset={media.…} />` and delete the
slot from `placeholders.ts`.

---

## 5. Brand colour — provenance

Every brand hex is extracted from PrimeTrack's own assets, not chosen by eye:

| Role | Hex | Source |
|---|---|---|
| Primary orange | `#ff7000` | `--nectar-accent-color` in the live theme's `salient-dynamic-styles.css` (56 uses) |
| Light orange | `#f49200` | extra-colour slot, same stylesheet (12 uses) |
| Red | `#ff5433` | extra-colour slot, same stylesheet (11 uses) |
| Blue | `#5694ff` | extra-colour slot, same stylesheet (18 uses) — **present in the theme but deliberately not used on this site** |
| Logo orange | `#ff6e00` | sampled from the logo PNG's dominant non-black pixel |

The logo orange and the theme accent differ by two steps of red. The theme value wins: it is the
deliberate site-wide setting and what customers have actually been looking at.

**On blue.** PrimeTrack's live theme carries a blue in its palette, and an earlier iteration of this
build promoted it to a supporting colour across the technology pages. That was reverted at the
client's direction: the site is orange-led, with black and white doing the structural work. No blue
appears anywhere in the built output — `grep -ril "5694ff\|azure" dist/` returns nothing.

**How the colours are used.** Orange carries the brand — CTAs, product identity, eyebrows, the hero
hub and routes. Black and white do the structural work. Red is reserved for live and alert states
only. One dominant colour and one accent per section; the rule is written at the top of
`src/styles/global.css`, which is the single source of truth for the palette.

**Contrast.** `npm run check:contrast` reads the tokens straight out of `global.css` and checks all
32 foreground/background pairs the site uses. Two findings worth recording:

- White on the brand orange is **2.8:1** and fails WCAG AA. Primary buttons therefore set **black**
  type on orange — 7.2:1, and what the logo itself does. This is the one colour that intentionally
  differs from the pre-blue build; say the word and it goes back to white on `prime-600`, at the
  cost of the AA failure returning.
- The focus ring uses `prime-700`, not the brand orange, because a focus indicator needs 3:1
  (WCAG 1.4.11 / 2.4.11) and `prime-500` is 2.8:1 on white. Invisible unless tabbing.
- `ink-500` is a light-surface token (6.0:1 on white) but only 3.3:1 on the dark footer. Dark
  surfaces use `ink-400` or lighter.

---

## 6. Homepage hero

The hero backdrop is hand-drawn SVG — roughly 4KB of markup and CSS, no video, no image, no
animation library. Route lines carry vehicles along them, location markers pulse, and a coordinate
grid sits underneath. All movement is `transform`/`opacity` only, so it stays on the compositor.

It sits *behind* the original two-column hero: headline and CTAs on the left, the hero photography
placeholder and the "Operating since" panel on the right, exactly as before. Structural lines in the
drawing are white at low opacity; the routes and markers use two steps of the brand orange rather
than a second hue.

The geometry is **deliberately abstract**. It is not a map of Nigeria or of any coverage area, and
the markers are not live data — implying either would be a factual claim the inventory cannot
support.

Motion is switched off in three cases, each falling back to the same static drawing rather than a
different one:

- `prefers-reduced-motion: reduce` — handled purely in CSS, so it works with JavaScript disabled.
- An explicit `Save-Data` request, or the `slow-2g`/`2g` network tiers.
- Four or fewer CPU cores on a touch device.

**It is deliberately not disabled on 3G.** The animation is inline CSS on markup the page has already
downloaded, so it costs no additional bytes, and a large share of this site's audience is on 3G.
Switching it off for them would remove the visual and save nothing.

---

## 7. Performance

Measured with Lighthouse against the production build:

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | **100** | **100** | **100** | **100** |
| Mobile | **98** | **100** | **100** | **100** |

Mobile (Moto G Power, throttled 4G): FCP 1.7s, LCP 2.0s, TBT 0ms, CLS 0.001, 169KB total transfer.

Total JavaScript is **~67KB gzipped**, of which ~57KB is React itself, loaded on every page because
the build brief specifies Navbar and MegaMenu as React islands. Lighthouse reports ~58% of it unused
on the homepage. Everything else ships as static HTML with zero JS.

If the client wants to cut that for 3G users, replacing `Navbar.tsx` with an `.astro` component plus
roughly 30 lines of vanilla JS would drop React from every page except `/contact-prime/`, taking
sitewide JS to about 2KB gzipped. That is a deliberate deviation from the brief's component list, so
it is flagged here rather than done unilaterally.

---

## 8. Social sharing

`public/og-primetrack.png` (1200×630) is wired to `og:image` and `twitter:image` on every page.
It carries the real logo, the headline and the four verified statistics — nothing invented.

Regenerate with `npm run assets:og` after any brand change. Note that the card is rasterised by
librsvg, which can only use fonts installed on the machine, so it falls back to a system grotesque
rather than the site's Space Grotesk. Not noticeable at the size a share card is viewed.

---

## 9. Verification

```bash
npm run verify              # build + QA + GATE 4 content preservation
```

Individually:

```bash
npm run build               # fails on "Lifetime Warranty" or a missing trailing slash
npm run qa                  # links, headings, SEO tags, landmarks, alt text, sitemap
npm run check:gate4         # every verified inventory fact is present in the built HTML
npm run check:contrast      # all 32 colour pairs against their WCAG threshold
npm run check:placeholders  # placeholder registry vs. what the pages actually use
```

Current state — 20 pages, 0 QA problems, 1 tracked pending asset (the certificates PDF, item 3):

- **GATE 4: PASS** — 178 verified facts across 18 routes, none lost.
- **Contrast: PASS** — 29/29 pairs.
- **Placeholders: PASS** — registry and pages agree, 5 slots outstanding.
