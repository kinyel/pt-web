/**
 * Navigation + per-page SEO metadata.
 * Menu structure comes straight from inventory §2 — no invented categories,
 * no "Solutions" or "Industries" menu (neither exists in verified content).
 * Every href is byte-identical to the live site (inventory §8).
 */

export interface NavItem {
  label: string;
  href: string;
  /** One-line descriptor shown in the mega-menu and on cards. */
  descriptor: string;
  /** Lucide icon name used on cards and page heroes. */
  icon?: string;
  external?: boolean;
  /** Page <title>. */
  title?: string;
  /** Page meta description. */
  description?: string;
}

export const products: NavItem[] = [
  {
    label: 'Video Trackers',
    href: '/vehicle-video-tracking-systems/',
    icon: 'video',
    descriptor: 'Ai-PRIME intelligent vehicle CCTV with ADAS',
    title: 'Ai-PRIME Vehicle Video Tracking & CCTV Systems | PrimeTrack',
    description:
      '4K DVR cameras, ADAS sensors and AI video telematics for Nigerian fleets, with live video feeds, incident evidence and real-time driver alerts.',
  },
  {
    label: 'Solar Trackers',
    href: '/primesolar/',
    icon: 'sun',
    descriptor: 'Maintenance-free solar tracking for trucks',
    title: 'PrimeSOLAR Solar-Powered Vehicle & Truck Trackers | PrimeTrack',
    description:
      'Maintenance-free solar GPS tracker with a minimum 3-year battery, tamper-proof SIM, and a waterproof, dustproof, high-temperature build.',
  },
  {
    label: 'Fleet Trackers',
    href: '/vehicle-fleet-telematics-solutions-in-nigeria/',
    icon: 'truck',
    descriptor: 'GPS fleet management, 3 to 3,000 vehicles',
    title: 'Vehicle Fleet Telematics & Fleet Management in Nigeria | PrimeTrack',
    description:
      'GPS-based fleet management to optimise routes, cut fuel consumption and eliminate downtime, with real-time tracking, alerts, reporting and API integration.',
  },
  {
    label: 'Cargo Trackers',
    href: '/reliable-container-tracking/',
    icon: 'container',
    descriptor: 'Stand-alone rechargeable cargo and container tracking',
    title: 'STAR Cargo & Container Trackers | Reliable Cargo Tracking | PrimeTrack',
    description:
      'Stand-alone rechargeable trackers running for months per charge, with a magnetized weather-proof body for cargo and containers in off-grid areas.',
  },
  {
    label: 'Fuel Monitoring',
    href: '/fleet-fuel-consumption-management-system/',
    icon: 'fuel',
    descriptor: 'Fleet fuel usage tracking and reporting',
    title: 'Fleet Fuel Consumption Management System | PrimeTrack',
    description:
      'Track fleet fuel usage accurately, identify idling, speeding and inefficient driving, and act on consumption trends with detailed reports.',
  },
];

/**
 * Products the company no longer offers.
 *
 * Human Trackers (wearable personnel devices, inventory §3.5) was withdrawn and
 * replaced in the line-up by Cargo Trackers — client-confirmed, Aug 2026. It is
 * out of `products`, so it no longer appears in the header mega-menu, the
 * homepage product spiral, the contact form's interest list, or the 404
 * suggestions.
 *
 * NOTE: the container/cargo product moved the other way in the same change. It
 * had been retired here as "Goods Trackers"; it is back in `products` as "Cargo
 * Trackers", pointing at the same /reliable-container-tracking/ route, which is
 * why that page's copy still stands.
 *
 * The entry survives here rather than being deleted because
 * /employee-monitoring-solutions/ is still a built route and reads its own
 * title and meta description from this record. That page is now unlinked from
 * the site's navigation but still published and still in the sitemap. Deleting
 * this array without settling that would 404 an indexed URL and fail the
 * Gate 4 content-preservation check.
 */
export const retiredProducts: NavItem[] = [
  {
    label: 'Human Trackers',
    href: '/employee-monitoring-solutions/',
    icon: 'watch',
    descriptor: 'Wearable personnel trackers with panic SOS',
    title: 'Employee & Personnel GPS Monitoring Solutions | PrimeTrack',
    description:
      'Wearable GPS trackers in watch, keyring, modem and chip formats, with panic-button SOS, geofencing and real-time personnel tracking.',
  },
];

export const services: NavItem[] = [
  {
    label: 'Driver Monitoring',
    href: '/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/',
    icon: 'gauge',
    descriptor: 'Behaviour scoring for safety and fuel savings',
    title: 'Driver Behaviour Monitoring Systems for Fleet Management | PrimeTrack',
    description:
      'Monitor driver behaviour to improve safety, reduce fuel consumption and increase fleet productivity with PrimeTrack telematics.',
  },
  {
    label: 'API Integration',
    href: '/gps-telematics-api-integrations/',
    icon: 'plug',
    descriptor: 'Connect telematics data to your ERM/ERP',
    title: 'GPS & Telematics API Integrations | PrimeTrack',
    description:
      'Integrate location, speed, fuel and maintenance data directly into your ERM/ERP with a flexible API and dedicated integration support.',
  },
  {
    label: 'Fleet Analytics',
    href: '/fleet-analytics/',
    icon: 'chart-line',
    descriptor: '15 reporting and analytics capabilities',
    title: 'Fleet Analytics & Telematics Reporting | PrimeTrack',
    description:
      'Fifteen fleet analytics capabilities, covering real-time tracking, history playback, geofencing, fuel, temperature, video telematics, TAT and utilisation reporting.',
  },
  {
    // Rwanda property. Never rebuilt as a Nigeria page (inventory §4.4).
    // Open item: client to confirm whether vRAS belongs in the Nigeria nav.
    label: 'vRAS',
    href: 'https://www.primetrack.rw',
    icon: 'globe',
    descriptor: 'Rwanda, opens the PrimeTrack Rwanda site',
    external: true,
  },
];

/** Footer secondary navigation — the site's own "PrimeINFO" / "PrimeTOOLS" grouping. */
export const primeInfo: NavItem[] = [
  { label: 'Why Choose PrimeTrack?', href: '/why-choose-primetrack/', descriptor: 'Seven advantages' },
  { label: 'Prime Warranties', href: '/warranty/', descriptor: '3-year product warranty' },
  { label: 'Prime Careers', href: '/careers/', descriptor: 'Join the team' },
  { label: 'I.C.C.P.', href: '/iccp/', descriptor: 'I.C.C.P.' },
];

export const primeTools: NavItem[] = [
  { label: 'Support Manuals & Documents', href: '/tools/', descriptor: 'Guides and downloads' },
  { label: 'Terms of Service', href: '/service-terms/', descriptor: 'Service terms' },
];

/** Top-level header items rendered to the right of the two mega-menus. */
export const primaryLinks: NavItem[] = [
  { label: 'Why PrimeTrack', href: '/why-choose-primetrack/', descriptor: 'Seven advantages' },
  { label: 'Contact', href: '/contact-prime/', descriptor: 'Talk to our team in Lagos' },
];
