# PrimeTrack Nigeria — Phase 1: Information Architecture

> **Status:** Awaiting GATE 2 approval. No components built yet.
> **Sources:** `primetrack-content-inventory.md` (content authority) · `primetrack-build-brief.md` (technical authority) · `original-design-prompt.md` (visual direction only).
> **Rule applied throughout:** nothing here is invented. Anything not verified in the inventory is marked `[PLACEHOLDER — client to confirm]`.

---

## 1. Route map (final)

Every path below is preserved **exactly** as it exists today, with trailing slashes. Astro is configured with `trailingSlash: 'always'` and `build.format: 'directory'` so output matches 1:1.

| # | Route | Page | Nav home | Content status |
|---|---|---|---|---|
| 1 | `/` | Home | — | Verified (inventory §5) |
| 2 | `/vehicle-video-tracking-systems/` | Video Trackers — Ai-PRIME | Products | Verified (§3.1) |
| 3 | `/primesolar/` | Solar Trackers — PrimeSOLAR | Products | Verified (§3.2) |
| 4 | `/vehicle-fleet-telematics-solutions-in-nigeria/` | Fleet Trackers | Products | Verified (§3.3) |
| 5 | `/reliable-container-tracking/` | Goods Trackers — STAR | Products | Verified (§3.4) |
| 6 | `/employee-monitoring-solutions/` | Human Trackers | Products | Verified (§3.5) |
| 7 | `/fleet-fuel-consumption-management-system/` | Fuel Monitoring | Products | Verified (§3.6) |
| 8 | `/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/` | Driver Monitoring | Services | Verified (§4.1) |
| 9 | `/gps-telematics-api-integrations/` | API Integration | Services | Verified (§4.2) |
| 10 | `/fleet-analytics/` | Fleet Analytics | Services | Verified (§4.3) |
| 11 | `/contact-prime/` | Contact | Top level | Verified (§1) |
| 12 | `/why-choose-primetrack/` | Why Choose PrimeTrack | Footer — PrimeINFO | Verified (§6.1) |
| 13 | `/warranty/` | Prime Warranties | Footer — PrimeINFO | Verified (§6.2) |
| 14 | `/careers/` | Prime Careers | Footer — PrimeINFO | **Stub** — copy needed |
| 15 | `/iccp/` | I.C.C.P. | Footer — PrimeINFO | **Stub** — copy needed |
| 16 | `/tools/` | Support Manuals & Documents | Footer — PrimeTOOLS | **Stub** — copy needed |
| 17 | `/service-terms/` | Terms of Service | Footer — PrimeTOOLS | **Stub** — copy needed |
| 18 | `/egy/` | Egypt | Country switcher | **Stub** — copy needed |
| — | `/404/` | Not found | — | New (nav + search-free recovery links) |

**External links (never rebuilt as Nigeria pages):**
`https://primetrack.rw/vras` (vRAS) · `https://primetrack.rw` (Rwanda) · the four social profiles (§1).

### Stub pages — how they behave
Routes 14–18 exist on the live site but were not deep-fetched, and the no-crawl rule forbids retrieving them. Each ships as a **real, styled, indexable page** carrying the site chrome, an accurate `<h1>`, the standard contact CTA, and a single visible block:

> `[PLACEHOLDER — client to confirm]` — current copy for this page to be supplied.

They are listed in the handoff punch-list (§7). They are **not** `noindex`, because the live URLs already rank; they must resolve to something valid on launch day. If the client cannot supply copy before launch, the fallback is to keep these four pointing at the existing WordPress pages during a phased cutover — client's call.

---

## 2. Navigation

### 2.1 Primary nav (desktop, sticky header)

```
[PrimeTrack logo]   Products ▾   Services ▾   Why PrimeTrack   Contact      NGA ▾   +234 803 060 9099   [Contact Us]
```

- **Products ▾** and **Services ▾** open a mega-menu on hover, and on click / `Enter` / `Space` for keyboard and touch (hover alone reaches neither). They deliberately do **not** open on focus alone — tabbing through the header would otherwise flap menus open. Each panel is rendered inside its own trigger `<li>`, so keyboard focus moves from the trigger straight into the menu; `Esc` and tabbing past the panel both close it.
- **Why PrimeTrack** is promoted from the footer into the primary nav. It is the strongest trust page on the site (7 advantages, NCC licensing, warranty) and the brief names client confidence as a primary objective. It stays in the footer too. No URL change.
- **Country switcher (NGA ▾):** NGA `/` · RWA `https://primetrack.rw` (external) · EGY `/egy/`. Labelled "Region", external items marked with an external-link icon and `rel="noopener"`.
- **Phone** renders as `tel:+2348030609099`, visible from `lg` up.
- **[Contact Us]** primary button → `/contact-prime/`. Deliberately neutral wording — "Request a Demo" or "Get a Quote" would imply a flow the inventory does not verify.

### 2.2 Mega-menu contents

Straight from inventory §2 — no invented categories, no "Solutions" or "Industries" menu (neither exists in verified content).

**Products** — two columns of items + one trust rail:

| Item | Route | One-line descriptor (from verified copy) |
|---|---|---|
| Video Trackers | `/vehicle-video-tracking-systems/` | Ai-PRIME intelligent vehicle CCTV with ADAS |
| Solar Trackers | `/primesolar/` | Maintenance-free solar tracking for trucks |
| Fleet Trackers | `/vehicle-fleet-telematics-solutions-in-nigeria/` | GPS fleet management, 3 to 3,000 vehicles |
| Goods Trackers | `/reliable-container-tracking/` | Stand-alone rechargeable container tracking |
| Human Trackers | `/employee-monitoring-solutions/` | Wearable personnel trackers with SOS |
| Fuel Monitoring | `/fleet-fuel-consumption-management-system/` | Fleet fuel usage tracking and reporting |

*Trust rail (right side):* NCC-licensed · 3-year warranty · 24/7 PrimeCARE.

**Services**

| Item | Route | Descriptor |
|---|---|---|
| Driver Monitoring | `/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/` | Behaviour scoring for safety and fuel |
| API Integration | `/gps-telematics-api-integrations/` | Connect telematics data to your ERM/ERP |
| Fleet Analytics | `/fleet-analytics/` | 15 reporting and analytics capabilities |
| vRAS ↗ | `https://primetrack.rw/vras` | Rwanda — opens external site |

vRAS carries a visible external marker and `aria-label` noting it opens the Rwanda site. `[Client to confirm whether vRAS should appear in the Nigeria nav at all — inventory §4.4.]`

### 2.3 Mobile nav
Full-height drawer; Products/Services become accordions (no hover); country switcher and both phone numbers as tappable rows; footer links reachable inside the drawer; 44px minimum touch targets; focus trapped while open, `Esc` closes, body scroll locked.

### 2.4 Footer

| Column | Contents |
|---|---|
| **Company** | Logo, positioning line, P.R.I.M.E. values, social icons (Instagram, X, Facebook, LinkedIn) |
| **Products** | The 6 product routes |
| **Services** | The 3 Nigeria service routes + vRAS ↗ |
| **PrimeINFO** | Why Choose PrimeTrack · Prime Warranties · Prime Careers · I.C.C.P. |
| **PrimeTOOLS** | Support Manuals & Documents · Terms of Service · Certifications (PDF) |
| **Contact** | Lagos address, both phones (`tel:`), `admin@primetracknigeria.net` (`mailto:`), Rwanda office link |
| **Bottom bar** | © PrimeTrack Telematics · NCC-licensed · FRSC-licensed Speed Limiter vendor · 3-year warranty |

---

## 3. Page blueprints (section order)

Only verified content is placed. Every section below traces to an inventory reference.

**Home** — Hero ("Efficient Telematics is Here" / Nigeria's #1 GPS Tracking Company, 24/7 support) → descriptor band (Ai-enabled video · solar-powered · IoT fleet management · precision vehicle tracking · electronic cargo tracking · 15+ years) → stat band (5,000 / 15+ / 5 / 24/7) → Products grid (6, varied layout — Ai-PRIME and PrimeSOLAR get featured treatment as the only two with real photography) → Services (3 + vRAS) → Why PrimeTrack (3 of 7 advantages, link to full page) → Capability strip (mobile apps iOS/Android · preventive maintenance scheduling · driver behaviour · Arrive Alive FRSC speed limiters · fuel monitoring · API) → Credentials (NCC · FRSC · CAC/NCC/FRSC certificate PDF · 3-year warranty · PrimeCARE) → CTA → Footer.
*Omitted:* "Some Brands We Serve" — the live section contains no real client names or logos (§0.2). Nothing is fabricated to fill it; see punch-list.

**Product pages** (one template, varied by content volume) — Hero (name, tagline, primary claim) → key-claim chips (e.g. PrimeSOLAR's six proof points) → feature sections → *Video Trackers only:* the ~20 report types as a scannable capability list; storage variants 256GB/1TB/4TB → real photo where one exists, labelled placeholder where it does not → cross-links to related products/services → CTA.

**Fleet Analytics** — the 15 capabilities as the page's spine, grouped for scanning (tracking & history · efficiency · safety · reporting), not 15 identical boxes.

**Driver Monitoring** — three pillars (safety / fuel / productivity). **API Integration** — five benefits + ERM/ERP integration note.

**Why Choose** — the 7 advantages, numbered, with the warranty advantage worded "one of the longest warranties in the industry" and stated plainly as **3 years**.

**Warranty** — duration and eligibility, what's covered, what's excluded, transferability. Written as a readable policy page, not a wall of text.

**Contact** — form (working endpoint) + address, both phones as `tel:`, `mailto:`, Google Maps embed at the L'Monarch Towers coordinates (lazy-loaded), Rwanda office link, Organization JSON-LD.

---

## 4. URL / redirect strategy

**No route changes.** Every live path is reproduced exactly, so the redirect table is empty by design — that is the goal, not an oversight.

Assets that must keep their exact paths (inbound links / indexed):
- `/primetrack_cac_ncc_frsc certifictes.pdf` — filename kept **exactly** (space and the "certifictes" typo intact, URL-encoded as `%20` in hrefs). Display label cleaned to "CAC · NCC · FRSC Certificates (PDF)".

Optional, recommended: 301 the six reused `wp-content/uploads/...` image paths to their new optimized locations, so image-search equity carries over. Costs nothing.

Redirect files ship for both hosting options so the decision can be deferred:
- Cloudflare Pages → `public/_redirects`
- Hostinger → `public/.htaccess`

Also handled: legacy WordPress endpoints (`/wp-admin`, `/wp-login.php`, `/feed/`, `/?p=`) simply cease to exist on a static site; the 404 page catches them with links back into the real nav. Flag if any of these are actively used.

---

## 5. Per-page SEO (titles + meta descriptions)

The brief expected live titles to carry over, but the inventory contains none, so these are written fresh from verified copy only.

| Route | `<title>` | Meta description |
|---|---|---|
| `/` | PrimeTrack Telematics — Nigeria's #1 GPS Tracking & Fleet Management | GPS vehicle tracking, Ai-enabled video telematics, solar trackers and fleet management in Nigeria. NCC-licensed, 24/7 PrimeCARE support, 3-year warranty. |
| `/vehicle-video-tracking-systems/` | Ai-PRIME Vehicle Video Tracking & CCTV Systems \| PrimeTrack | 4K DVR cameras, ADAS sensors and AI video telematics for Nigerian fleets — live video feeds, incident evidence and real-time driver alerts. |
| `/primesolar/` | PrimeSOLAR Solar-Powered Vehicle & Truck Trackers \| PrimeTrack | Maintenance-free solar GPS tracker with a minimum 3-year battery, tamper-proof SIM, and waterproof, dustproof, high-temperature build. |
| `/vehicle-fleet-telematics-solutions-in-nigeria/` | Vehicle Fleet Telematics & Fleet Management in Nigeria \| PrimeTrack | GPS-based fleet management to optimise routes, cut fuel consumption and eliminate downtime — real-time tracking, alerts, reporting and API integration. |
| `/reliable-container-tracking/` | STAR Container & Goods Trackers — Reliable Container Tracking \| PrimeTrack | Stand-alone rechargeable trackers running for months per charge, with a magnetized weather-proof body for containers and cargo off-grid. |
| `/employee-monitoring-solutions/` | Employee & Personnel GPS Monitoring Solutions \| PrimeTrack | Wearable GPS trackers — watches, keyrings, modems and chips — with panic-button SOS, geofencing and real-time personnel tracking. |
| `/fleet-fuel-consumption-management-system/` | Fleet Fuel Consumption Management System \| PrimeTrack | Track fleet fuel usage accurately, identify idling, speeding and inefficient driving, and act on consumption trends with detailed reports. |
| `/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/` | Driver Behaviour Monitoring Systems for Fleet Management \| PrimeTrack | Monitor driver behaviour to improve safety, reduce fuel consumption and increase fleet productivity with PrimeTrack telematics. |
| `/gps-telematics-api-integrations/` | GPS & Telematics API Integrations \| PrimeTrack | Integrate location, speed, fuel and maintenance data directly into your ERM/ERP with a flexible API and dedicated integration support. |
| `/fleet-analytics/` | Fleet Analytics & Telematics Reporting \| PrimeTrack | Fifteen fleet analytics capabilities — real-time tracking, history playback, geofencing, fuel, temperature, video telematics, TAT and utilisation reporting. |
| `/contact-prime/` | Contact PrimeTrack Telematics — Ikeja, Lagos \| PrimeTrack | 4th Floor, L'Monarch Towers, 65C Opebi Road, Ikeja, Lagos. Call +234 803 060 9099 or email admin@primetracknigeria.net. |
| `/why-choose-primetrack/` | Why Choose PrimeTrack — 7 Advantages \| PrimeTrack Telematics | NCC-licensed, 24/7 PrimeCARE support, rugged hardware for African conditions, Ai-driven telematics and one of the longest warranties in the industry. |
| `/warranty/` | Prime Warranties — 3-Year Product Warranty \| PrimeTrack | PrimeTrack products carry a 3-year warranty from date of purchase for the original purchaser, covering defects in materials and workmanship. |
| `/careers/` `/iccp/` `/tools/` `/service-terms/` `/egy/` | Accurate page name + brand suffix | `[PLACEHOLDER — client to confirm]` pending copy |

Also per page: canonical, OG + Twitter `summary_large_image`, one `<h1>`, ordered headings. JSON-LD: `Organization` on `/` and `/contact-prime/` (name, logo, Lagos address, both phones, four social profiles); `Product` on the six product pages; `Service` on the three service pages. Facts drawn only from inventory §1.

---

## 6. Language rules enforced site-wide

- **"3-year warranty"** everywhere. The string "Lifetime Warranty" appears nowhere; a build-time content check fails the build if it does.
- **"15+ years"** consistently (not "15", not "over a decade").
- **"5 countries"** as the company's own stated claim; only the three existing country destinations are linked.
- "Nigeria's #1 GPS Tracking Company" is used as PrimeTrack's own positioning line, in their voice.
- No testimonials, client names, logos, awards, or partnerships anywhere — none are verified.
- No Industries or Solutions section: the inventory verifies no industry list, and inventing one is out of bounds. Use-case framing comes only from what products actually state (e.g. containers/goods without a power source, refrigerated cold-chain via temperature monitoring, trucks in workshops).

---

## 7. Handoff punch-list (client items)

| # | Item | Blocks |
|---|---|---|
| 1 | Contact form: destination email + Web3Forms/Formspree key | Working form (Phase 3) |
| 2 | Hosting: Cloudflare Pages (recommended) vs Hostinger | Deploy + redirect file |
| 3 | "Brands we serve": supply real client logos, or confirm the section stays omitted | Home (currently omitted) |
| 4 | vRAS in the Nigeria nav — keep or remove | Services menu |
| 5 | Current copy for `/careers/`, `/iccp/`, `/tools/`, `/service-terms/`, `/egy/` | 5 stub pages |
| 6 | Real photography for products without images: Fleet, Goods/STAR, Human trackers | Placeholder blocks |
| 7 | Source logo file (SVG preferred) and the certificates PDF | Header, footer, credentials |
| 8 | Confirm the Google Maps embed coordinates resolve correctly on-site | Contact page |
