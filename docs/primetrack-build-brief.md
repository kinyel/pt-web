# PrimeTrack Nigeria — Corrected Build Brief for Claude Code

> Give Claude Code **both** files: this brief **and** `primetrack-content-inventory.md`. The inventory is the content authority; this brief is the technical + design authority. The original long design prompt is still useful for *visual direction* — keep it — but where it conflicts with this file, **this file wins** (it fixes the stack/SEO/forms/hosting/phasing gaps).

---

## A. What changed from the original prompt, and why

| Problem in original prompt | Fix in this brief |
|---|---|
| "Audit the site page-by-page" invites Claude Code to crawl (unreliable) and fill gaps by guessing — colliding with the no-fabrication rule | **Audit is already done.** Content is verified in `primetrack-content-inventory.md`. Claude Code must build from that file, not re-crawl. |
| "Use React" (SPA) vs. hard SEO requirement — a client-rendered SPA is one of the *worst* choices for SEO | **Switch to Astro** (static HTML output) with **React islands** for interactive bits. You still write React components; the pages ship as pre-rendered HTML. |
| "Build a real production website, not a mockup" — but a React front-end can't actually send a contact form | **Wire the form to a real endpoint** (Web3Forms/Formspree, or a Cloudflare Pages Function). Details in §D. |
| Hosting unspecified | **Cloudflare Pages** recommended; **Hostinger** fully supported as an alternative (static output). See §E. |
| Images the brief keeps asking for don't exist | **Image strategy** in §F: reuse the few real assets, mark everything else as placeholder, never invent. |
| Seven phases but no approval gates → fire-and-forget on a big build | **Checkpoint gates** in §H. Stop and get sign-off after audit review, IA, and design system — before building components. |

---

## B. Recommended stack (final)

**Astro + React islands + Tailwind CSS.**

Why this specific stack for *this* project:
- **SEO:** Astro pre-renders every page to static HTML at build time. Search engines get full content with zero JS execution — the thing a plain React SPA fails at. Per-page `<title>`, meta description, canonical, and Open Graph tags are trivial.
- **Performance on Nigerian mobile networks:** Astro ships **near-zero JavaScript** by default. Only the interactive pieces (mobile nav, mega-menu, contact form, any counters) hydrate as small React "islands." This is the single biggest win for the audience — pages stay fast on 3G/4G.
- **Still React:** the brief's component list (Navbar, MegaMenu, Hero, ServiceCard, etc.) is honored — those become `.astro` components for static content and `.jsx` islands where they need interactivity.
- **Deploys anywhere static:** works on Cloudflare Pages *and* on Hostinger shared hosting (upload `dist/`). No lock-in.

Use `output: 'static'` (Astro's default). **Do not** use SSR — you don't need a server, and static keeps hosting simple and cheap.

Supporting choices:
- **Styling:** Tailwind CSS (design tokens for the orange/black/red/white system — see §G).
- **Animation:** keep it light. CSS transitions + one small library only if needed (e.g. a tiny scroll-reveal). No heavy animation frameworks — the brief itself says performance > flash.
- **Icons:** an SVG icon set (e.g. Lucide) — no icon fonts.
- **Fonts:** self-host the webfonts (don't hotlink Google Fonts) for speed + reliability in-region.

---

## C. SEO requirements (concrete)

- One `<title>` + meta description per page. Reuse the live site's existing titles as a baseline (they're in the inventory front-matter) so ranking signals carry over.
- Preserve **all existing URLs exactly** (inventory §8). Any change gets a 301 redirect.
- Semantic HTML: one `<h1>` per page, logical heading order, real `<nav>`/`<main>`/`<footer>` landmarks.
- Descriptive `alt` text on every image.
- Generate `sitemap.xml` (`@astrojs/sitemap`) and a `robots.txt`.
- Add **JSON-LD structured data**: `Organization` (name, logo, Lagos address, both phone numbers, social profiles — all in inventory §1) on the home/contact pages, and `Product`/`Service` schema on the relevant pages. Only use facts from the inventory.
- Keep trailing slashes consistent with the current site.
- Open Graph + Twitter card tags per page (site already uses `summary_large_image`).

---

## D. Contact form — make it actually work

A static site has no backend, so the form needs a third-party endpoint or an edge function. Pick one:

- **Option 1 — Web3Forms or Formspree (simplest).** POST the form to their endpoint; submissions arrive at `admin@primetracknigeria.net`. Free tiers are fine for this volume. Requires: client's access key/email + spam honeypot. Recommended default.
- **Option 2 — Cloudflare Pages Function (if hosting on Cloudflare).** A small `/functions/contact.js` that receives the POST and sends via an email API (e.g. MailChannels/Resend). More control, no third party, but needs a Cloudflare account + email config.

Requirements either way:
- Client-side validation + accessible labels/errors.
- Honeypot or captcha for spam.
- Success/error states (don't just reload).
- Keep the Google Maps embed (L'Monarch Towers coords in inventory §1) and both phone numbers as click-to-call `tel:` links, plus the `mailto:`.

**Flag to client:** confirm which email should receive submissions and set up the chosen service's account — the form can't send until that key exists.

---

## E. Hosting

**Recommended: Cloudflare Pages.**
- Free tier is generous and well-suited to a static site.
- Global edge CDN gives better latency for Nigerian/African visitors than a single-region shared host.
- Git-connected CI: push to the repo → auto build (`npm run build`) → deploy. Free SSL, easy custom domain.

**Alternative: Hostinger (confirmed workable).**
- Astro's default static output drops straight into Hostinger. Build locally (`npm run build`) and upload the contents of `dist/` to `public_html` via hPanel File Manager or FTP; free SSL is available. A shared plan is enough for a static site.
- Trade-off vs. Cloudflare: no built-in global edge CDN and manual (or Git-based on higher plans) deploys. Fine if the client wants everything under one Hostinger account.
- **Do not** use SSR on Hostinger shared hosting (needs a Node plan/VPS) — not required here anyway since we're static.

**Recommendation:** deploy to **Cloudflare Pages** for speed + free CI, and point the existing domain's DNS at it. If the client insists on consolidating with Hostinger, ship the same static `dist/` there — the codebase doesn't change.

---

## F. Images

From inventory §7:
- **Reuse** the real product photos that exist (solar tracker, fuel device, video/DVR, logo, accreditations graphic). Download, optimize (WebP/AVIF, responsive `srcset`), self-host in the repo.
- **Never invent** client logos, dashboards, staff photos, or case-study imagery.
- Where a layout needs an image that doesn't exist, use a clearly-labelled placeholder component (e.g. a neutral branded block that reads "Image placeholder — client to supply") and add it to the handoff punch-list.
- Optimize everything: the brief's performance bar matters most on mobile. Lazy-load below-the-fold images.

---

## G. Design system (from original prompt, kept)

Follow the original prompt's visual direction (premium, technical, trustworthy; orange/black/red/white used *intelligently*, not all at once; map/telemetry motifs used sparingly; no gaming/crypto/AI-landing vibe). Codify it as Tailwind tokens:
- Color scale from the brand palette (dark orange, light orange, black, red, white) with a restrained usage rule — one dominant, one accent per section.
- Type scale with clear hierarchy (hero / section / sub / body / label / stat).
- Spacing scale, card style, shadow style, border radius, motion timing — defined once, reused.
- Mobile-first breakpoints; design mobile layouts deliberately, don't just shrink desktop.

Component architecture (Astro + islands):
- Static `.astro`: `Layout`, `SectionHeader`, `Hero`, `ServiceCard`, `ProductCard`, `IndustryCard`, `StatBand`, `TrustSignals`, `Footer`, `CTA`.
- Interactive `.jsx` islands: `Navbar` (sticky), `MegaMenu` (hover on desktop / accordion on mobile), `ContactForm`, `StatCounter` (if animated).
- Mega-menu structure comes straight from inventory §2. Desktop = hover dropdown; mobile = expandable accordion. Don't invent categories.

---

## H. Workflow with approval gates (do NOT skip the gates)

1. **Phase 0 — Ingest.** Read `primetrack-content-inventory.md` fully. Do **not** re-crawl the live site. Confirm back a one-page understanding.
   → **GATE 1: client confirms the audit reflects reality** (esp. the warranty wording and the "brands we serve" gap).
2. **Phase 1 — Information architecture.** Produce the sitemap + nav + URL/redirect map (preserving inventory §8).
   → **GATE 2: client approves IA.**
3. **Phase 2 — Design system.** Build the Tailwind token set + a component style reference (colors, type, cards, buttons, motion) as a single preview page.
   → **GATE 3: client approves the look before any page is built.**
4. **Phase 3 — Build.** Layout + Navbar/MegaMenu + Footer first, then Home, then Products, Services, company/info pages, then Contact (with working form).
5. **Phase 4 — Responsive pass.** Deliberate mobile/tablet layouts; test nav, hero, cards, forms, touch targets.
6. **Phase 5 — SEO + performance pass.** Titles/meta/canonical, JSON-LD, sitemap/robots, image optimization, Lighthouse check, redirects.
7. **Phase 6 — QA.** Broken links, console errors, form submission end-to-end, accessibility (keyboard + landmarks + contrast), cross-page content check against the inventory (nothing dropped).
   → **GATE 4: final review vs. the live site — confirm no information or route was lost.**

---

## I. Hard rules (non-negotiable)

- Build **only** from `primetrack-content-inventory.md` + anything the client provides later. If it's not there, it's a `[PLACEHOLDER]`, never a fabrication.
- **No** "Lifetime Warranty" as a claim — the warranty is **3 years** (client-confirmed). Use "3-year warranty" / "one of the longest in the industry".
- **No** invented client names, logos, testimonials, certifications, or stats. The only usable stats are the four in inventory §5.
- **Preserve every existing URL** or 301-redirect it.
- Static output, near-zero JS, mobile-first — performance is a feature, not a nicety.
- Keep the codebase clean and componentized; a future dev should understand it easily.

---

## J. Open items for the client (put these in the handoff)

1. ~~Warranty: is it 3 years or "lifetime"?~~ **RESOLVED — 3 years. Display "3-year warranty" throughout.**
2. "Brands we serve": supply real client logos, or drop the section?
3. Contact form: confirm destination email + set up Web3Forms/Formspree (or Cloudflare) account.
4. vRAS: should it appear in the Nigeria nav, or stay Rwanda-only?
5. `/iccp` and `/tools` current copy — confirm or supply.
6. Hosting decision: Cloudflare Pages (recommended) vs. Hostinger.
7. Any real photography (products, office, team) to replace placeholders.
