# PrimeTrack Nigeria — Verified Content Inventory

> **Purpose:** This is the *source of truth* for the rebuild. Every fact here was pulled directly from the live site (primetracknigeria.com) on 16 Aug 2026. Claude Code must treat this file as the content authority and must **not** invent anything not written here. If something is needed but not in this file, mark it `[PLACEHOLDER — client to confirm]`, never fabricate it.

---

## 0. Content flags — READ FIRST

These are real problems on the current site. Handle them exactly as described; do not amplify them.

1. **Warranty is 3 years — RESOLVED (client-confirmed).**
   The homepage and several banners in the *old* site say *"Lifetime Warranty,"* but this is incorrect. The client has confirmed the warranty is **three (3) years from date of purchase**, original purchaser only (matching the Warranty page policy).
   → **Never write "Lifetime Warranty" anywhere.** Display *"3-year warranty"* consistently, and where a stronger marketing phrase is wanted, *"one of the longest warranties in the industry"* (the company's own Why-Choose wording) is acceptable. This is settled — no further client confirmation needed.

2. **"Brands We Serve" has no actual brands.**
   The homepage has a *"Some Brands We Serve"* section, but it contains **no real client names or logos** — just repeated slogan text. → **Do not invent client names or logos.** Either omit a logo wall, or build the component and leave it clearly `[PLACEHOLDER — client to supply client logos]`.

   > **CORRECTION (verified against the live site).** This is wrong. The
   > carousel *does* carry 19 real client logos; they are CSS
   > `background-image` URLs on empty divs under
   > `/wp-content/uploads/2023/06/` and `/2023/07/`, so an `<img>`-based scrape
   > sees an empty section. Each file was fetched and opened to identify it.
   > 13 are now self-hosted in `src/assets/clients/`. The standing rule is
   > unchanged and still applies: **never invent or redraw a client logo** —
   > only re-host files the client actually publishes. The *slogan* text above
   > the carousel ("Lifetime Warranty / 24-Hour Service") remains off-limits:
   > the warranty is 3 years.

3. **Speed limiters / "Arrive Alive"** are mentioned on the homepage (PrimeTrack is described as an *FRSC-licensed Speed Limiter vendor*) but there is **no dedicated page** for it. It's a real offering — surface it as a trust/credential point, but don't build out a full product page with invented specs.

4. **Stats that ARE real and usable** (they appear on the live homepage): see §5. Everything else numeric must not be invented.

---

## 1. Company facts (verified)

- **Legal/brand name:** PrimeTrack Telematics
- **Positioning line (their own):** "Nigeria's #1 GPS Tracking Company" / "Nigeria's PRIME Vehicle Tracking Service Provider"
- **Sector:** GPS/vehicle tracking, telematics, fleet management, IoT
- **Core values — P.R.I.M.E.:** Performance · Reliability · Innovation · Multifunction(ality) · Efficiency
- **24/7 support brand:** "PrimeCARE"
- **Multi-country operation:**
  - Nigeria — this site (primetracknigeria.com)
  - Rwanda — primetrack.rw (external site)
  - Egypt — primetracknigeria.com/egy (subpage)

### Contact details (verified)
- **Nigeria office:** 4th Floor, L'Monarch Towers, 65C Opebi Road, Ikeja, Lagos
- **Email:** admin@primetracknigeria.net
- **Phone 1:** +234 803 060 9099
- **Phone 2:** +234 803 363 6033
- **Map:** Google Maps embed points to L'Monarch Tower, Opebi (coords ~6.5894, 3.3582)
- **Rwanda office:** directs to www.primetrackrwanda.com (primetrack.rw)

### Socials (verified)
- Instagram: https://www.instagram.com/primetracktelematics/
- Twitter/X: https://twitter.com/PrimeTrack
- Facebook: https://facebook.com/primetrackltd
- LinkedIn: https://www.linkedin.com/company-beta/17909242

### Trust signals / credentials (verified — safe to use)
- **NCC-licensed** (Nigerian Communications Commission) to provide GPS tracking/telematics in Nigeria
- **FRSC-licensed Speed Limiter vendor**
- **CAC / NCC / FRSC certificates** — a real PDF exists at `/primetrack_cac_ncc_frsc certifictes.pdf` (note the filename has a space + typo "certifictes"; keep the asset, clean the display label)
- **3-year product warranty** (see Warranty page, §4)
- **24/7 PrimeCARE** human support

---

## 2. Navigation structure (verified — current)

```
Home  (with country switch: NGA / RWA→primetrack.rw / EGY→/egy)
Products ▾
  ├─ Video Trackers      → /vehicle-video-tracking-systems/
  ├─ Solar Trackers      → /primesolar/
  ├─ Fleet Trackers      → /vehicle-fleet-telematics-solutions-in-nigeria/
  ├─ Goods Trackers      → /reliable-container-tracking/
  ├─ Human Trackers      → /employee-monitoring-solutions/
  └─ Fuel Monitoring     → /fleet-fuel-consumption-management-system/
Services ▾
  ├─ Driver Monitoring   → /driver-behaviour-monitoring-systems-for-vehicle-fleet-management/
  ├─ API Integration     → /gps-telematics-api-integrations/
  ├─ Fleet Analytics     → /fleet-analytics/
  └─ vRAS                → https://primetrack.rw/vras  (external — Rwanda)
Contact                  → /contact-prime/
```

**Footer / secondary nav ("PrimeINFO", "PrimeTOOLS"):**
- Why Choose PrimeTrack? → /why-choose-primetrack
- Prime Warranties → /warranty
- Prime Careers → /careers
- I.C.C.P. → /iccp
- Support Manuals & Documents → /tools
- Terms of Service (ToS) → /service-terms

> The current mega-menu splits "Products" and "Services." Keep this split in the rebuild — it's a sensible information architecture and preserves the existing URL groupings.

---

## 3. PRODUCTS — verified page content

### 3.1 Video Trackers — "Ai-PRIME" (Intelligent Vehicle CCTV)
URL: `/vehicle-video-tracking-systems/`
Tagline: *4K DPR Cameras · ADAS Sensors · All-Weather Firmware · OTA Upgrades*

Real feature set (use these, reworded as needed):
- **Real-time live video feeds** — high-storage DVR + 4 IR weatherproof cameras (1 in-cabin, 3 road-facing) for 360° view; ADAS driver assistance, blind-spot mitigation, instant alerts to control centre.
- **Ai-enabled** — AI continuously analyses video telematics and guides driver behaviour in real time; non-conforming activity flagged to control room and announced to driver via AI speaker.
- **Enhanced fleet analytics** — reports include: historical video, idling, odometer, trip, harsh acceleration, sharp cornering, alarm frequency, overspeed, driver behaviour, YAW/route deviation, trip TAT, geofence, POI marking, traffic congestion, parking duration, service-due reminders, email notifications, engine start, SOS alarm.
- **Efficient incident investigation** — video evidence to establish causation, timeline, liability.
- **Customizable video analytics** — trigger alerts for speeding, sudden lane changes, unauthorized access.
- **Expandable storage** — DVR variants: 256GB / 1TB / 4TB; minimum 8 hours/day continuous recording.

### 3.2 Solar Trackers — "PrimeSOLAR"
URL: `/primesolar/`
Positioning: *maintenance-free truck tracker; "Nigeria's Premier Solar Tracking Device backed by Full Warranty Cover."*

Real features:
- Keeps working even while the truck is in the workshop (no connection to truck battery).
- Tamper-proof SIM; instant alert if device is touched; can hear surrounding audio; built-in vibration sensor.
- Embedded battery lasts **minimum 3 years** before replacement, recharges daily with sunlight.
- Waterproof / weatherproof / temperature-proof; rugged, built for the tropics.
- Full precision reports + breach alerts via platform and Prime mobile apps.
- Key claim block: *3-YEAR CONTINUOUS OPERATION BEFORE BATTERY REPLACEMENT · SIM-TAMPERING PROOF · WATERPROOF · DUSTPROOF · HIGH-TEMPERATURE PROOF · DEVICE-REMOVAL PROOF.*
- Existing usable image: `/wp-content/uploads/2024/03/2-website-image-solar-tracker-1024x724.jpg`

### 3.3 Fleet Trackers — Vehicle Fleet Management Systems
URL: `/vehicle-fleet-telematics-solutions-in-nigeria/`
Real content: GPS-based fleet management to optimize routes, reduce fuel consumption, eliminate downtime, increase operational efficiency. Real-time tracking, driver behaviour monitoring, automated reporting, customizable alerts, dashboard overview, API integration to ERM. Scales from a handful of vehicles to large enterprise fleets.

### 3.4 Goods Trackers — "STAR Trackers" (Container/Goods)
URL: `/reliable-container-tracking/`
STAR = **St**and-**A**lone & **R**echargeable.
Real features:
- Self-sustaining operation for **months** on a single full charge; a few hours' charging extends battery life.
- Weather-proof alloy body with **magnetized base** — attaches to any metallic surface.
- Works in remote/off-grid areas using internal power; real-time location transmission.
- Withstands extreme temperature, moisture, harsh conditions.
- Integrates with the fleet management software; real-time updates + detailed reports.
- Use case: tracking containers/goods where there's no power source.

### 3.5 Human Trackers — Personnel Tracking
URL: `/employee-monitoring-solutions/`
Real content: wearable GPS personal trackers — **watches, keyrings, modems, GPS chips**; self-powered, can be discreet.
Real features:
- Real-time tracking with customizable server ping intervals.
- Emergency **panic button** (discreet SOS to designated persons).
- Geofencing & POI zones with entry/exit notifications.
- Solid power management + remote reserve-power activation.
- Sleek, lightweight, ergonomic designs.

### 3.6 Fuel Monitoring
URL: `/fleet-fuel-consumption-management-system/`
Real content: accurately tracks fleet fuel usage, identifies inefficiency (excessive idling, speeding, inefficient driving), provides improvement recommendations. Detailed reports show consumption trends over time; proprietary software + GPS/telematics. Framed as a critical fleet KPI affecting profitability.
- Existing usable image: `/wp-content/uploads/2023/07/fuel-management-fuel-monitoring-device-fleet-fuel-management.jpg`

---

## 4. SERVICES — verified page content

### 4.1 Driver Monitoring — Driver Behaviour Monitoring Systems
URL: `/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/`
Three real pillars:
- **Enhanced Safety** — monitor behaviour, identify risky habits, reduce accidents.
- **Reduced Fuel Consumption** — pinpoint inefficiency (idling, suboptimal routes); data-driven changes cut cost + emissions.
- **Increased Productivity** — optimize routes, minimize idle time, streamline maintenance.

### 4.2 API Integration — GPS/Telematics API Integrations
URL: `/gps-telematics-api-integrations/`
Five real benefits:
1. Streamlined data exchange (location, speed, fuel, maintenance schedules).
2. Enhanced fleet management (status, real-time alerts, reports).
3. Seamless workflow automation (reports, maintenance reminders, work-order dispatch).
4. Customized solutions (flexible API to fit needs).
5. Reliable support (dedicated team through integration).
Integrates with the customer's ERM/ERP.

### 4.3 Fleet Analytics
URL: `/fleet-analytics/`
**15 verified capabilities** (this is the richest page — use it well):
1. Real-time tracking
2. History playback
3. Geofencing
4. Speed monitoring
5. Idling detection
6. Fuel monitoring
7. Maintenance alerts
8. Driver behaviour monitoring
9. Temperature monitoring (cold-chain / refrigerated cargo)
10. Video telematics
11. Emergency notification (SOS)
12. Turnaround Time (TAT) reporting
13. Asset utilisation reports
14. Route optimisation analysis
15. Incident reporting and alerts

### 4.4 vRAS
URL: external → `https://primetrack.rw/vras` (Rwanda property). Keep as an external link; do not fabricate a vRAS page for the Nigeria site. `[Client to confirm whether vRAS should appear in NGA nav at all.]`

---

## 5. Homepage — verified sections & real stats

Hero: *"Efficient Telematics is Here" / "Nigeria's #1 GPS Tracking Company Offering … 24/7 Support."*
Sub-band descriptors (real): *Ai-Enabled Video Telematics · Solar-Powered Telematics · IoT-driven Fleet Management · Precision Vehicle Tracking · Electronic Cargo Tracking · 15+ Years Industry Experience.*

Homepage feature blurbs (real):
- Track vehicles on the go — iOS & Android apps.
- Fleet preventive maintenance — automated service/renewal scheduling.
- Driver behaviour monitoring.
- Arrive Alive speed limiters — FRSC-licensed vendor.
- Ai-PRIME video telematics highlight.
- Fuel consumption monitoring highlight.
- Prime API Integration highlight.

**Real stats (verified, safe to use):**
| Stat | Value |
|---|---|
| Active trackers in service | **5,000** |
| Years industry experience | **15** |
| Countries in operation | **5** |
| Customer service | **24/7** |

> Note: hero copy says "15+ Years" while the stat block says "15"; the Why-Choose page says "over a decade." Use **"15+ years"** consistently. The "5 countries" stat vs. the 3 named country sites (NGA/RWA/EGY) is the company's own claim — keep "5 countries" as stated but only *link* the three that exist.

---

## 6. Company / info pages — verified

### 6.1 Why Choose PrimeTrack — "7 Advantages"
URL: `/why-choose-primetrack`
1. **Regulator-approved** — NCC-licensed (many competitors aren't).
2. **PrimeCARE 24/7** — round-the-clock human support; proactive anomaly monitoring.
3. **Rugged hardware for African environments** — built for heat, dust, humidity, network variability.
4. **Ai-driven telematics** — fuel optimisation, driver scoring, predictive maintenance via simple UIs.
5. **Long warranty & after-sales support** — "one of the longest warranties in the industry," quick MTTR.
6. **Seamless integrations & scalable architecture** — open APIs, modular, iVTS-compatible; 3 to 3,000 vehicles.
7. **Core values P-R-I-M-E.**

### 6.2 Warranty
URL: `/warranty`
- **Duration: 3 years** from date of purchase, original purchaser only.
- Covers defects in materials/workmanship under normal use.
- Only applies to product bought through authorized channels; service only by PrimeTrack/authorized personnel.
- Excludes: post-install accidental damage, tampering, unauthorized repair, fire/quake/surge/vehicle-power failure, force majeure, sabotage.
- Non-transferable; terminates on resale.

### 6.3 Careers → `/careers` · 6.4 I.C.C.P. → `/iccp` · 6.5 Tools/Manuals → `/tools` · 6.6 ToS → `/service-terms`
Not deep-fetched in this pass (secondary pages). **Preserve these routes and pull live content at build time**; do not rewrite their substance. Flag `/iccp` and `/tools` to the client for current copy.

---

## 7. Images — reuse vs. replace

**Reusable real assets already on the site (product-accurate):**
- Solar tracker: `/wp-content/uploads/2024/03/2-website-image-solar-tracker-1024x724.jpg`
- Fuel device: `/wp-content/uploads/2023/07/fuel-management-fuel-monitoring-device-fleet-fuel-management.jpg`
- Video tracking: `/wp-content/uploads/2023/06/vehicle-video-tracking-nigeria.jpg`, `/wp-content/uploads/2023/06/vehicle-dvr-realtime-cctv.jpg`
- Logo: `/wp-content/uploads/2023/06/logo-primetrack-telematics.png`
- Accreditations graphic: `/wp-content/uploads/2023/07/accreditations.fw_.png`

**Do NOT invent:** client logos, dashboard screenshots, product renders that don't exist, staff photos, or "case study" imagery. Where a design slot needs an image that doesn't exist, use a clearly-labelled placeholder and list it in the handoff for the client to supply.

---

## 8. URL / SEO preservation map

The current slugs are long and keyword-rich — **good** for SEO. **Keep them 1:1** to avoid ranking loss. If the new stack changes any path, add a 301 redirect from old → new.

| Keep this exact path | Page |
|---|---|
| `/` | Home |
| `/vehicle-video-tracking-systems/` | Video Trackers |
| `/primesolar/` | Solar Trackers |
| `/vehicle-fleet-telematics-solutions-in-nigeria/` | Fleet Trackers |
| `/reliable-container-tracking/` | Goods Trackers |
| `/employee-monitoring-solutions/` | Human Trackers |
| `/fleet-fuel-consumption-management-system/` | Fuel Monitoring |
| `/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/` | Driver Monitoring |
| `/gps-telematics-api-integrations/` | API Integration |
| `/fleet-analytics/` | Fleet Analytics |
| `/contact-prime/` | Contact |
| `/why-choose-primetrack/` | Why Choose |
| `/warranty/` | Warranty |
| `/careers/` `/iccp/` `/tools/` `/service-terms/` | Info pages |

Keep trailing slashes consistent with the current site (it uses trailing slashes) to avoid duplicate-URL SEO issues.
