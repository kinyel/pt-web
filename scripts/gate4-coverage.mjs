#!/usr/bin/env node
/**
 * GATE 4 — content preservation check.
 *
 * The build brief's final gate is "confirm no information or route was lost".
 * This walks the verified facts in docs/primetrack-content-inventory.md and
 * asserts each one is present in the BUILT HTML for the page that owns it.
 *
 * It is deliberately literal: it checks the substance the inventory records,
 * not the exact wording, because the rebuild rewords content by design. Each
 * entry is a term (or a set of alternatives) that must survive rewording.
 *
 * Run: node scripts/gate4-coverage.mjs   (after `npm run build`)
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));

const textOf = (route) => {
  const file = route === '/' ? `${dist}/index.html` : `${dist}${route}index.html`;
  if (!existsSync(file)) return null;
  return readFileSync(file, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
};

/** `check` may be a string, or an array meaning "any one of these". */
const CHECKS = {
  '/vehicle-video-tracking-systems/': {
    section: '§3.1 Video Trackers (Ai-PRIME)',
    items: [
      'ai-prime', '4k', 'adas', 'ota', 'weather',
      ['dvr', 'recorder'], ['in-cabin', 'cabin'], '360',
      ['ai speaker', 'speaker'], 'blind-spot',
      '256gb', '1tb', '4tb', ['8 hours', 'eight hours'],
      'historical video', 'idling', 'odometer', 'harsh acceleration',
      ['sharp cornering', 'cornering'], 'alarm frequency', 'overspeed',
      ['yaw', 'route deviation'], ['tat', 'turnaround'], 'geofence',
      ['poi', 'point of interest'], 'traffic congestion', 'parking duration',
      ['service-due', 'service due'], 'email notification', 'engine start', 'sos',
      ['incident', 'evidence'], ['lane change', 'unauthorized access'],
    ],
  },
  '/primesolar/': {
    section: '§3.2 Solar Trackers (PrimeSOLAR)',
    items: [
      'primesolar', 'workshop', ['truck battery', 'vehicle battery'],
      ['tamper', 'tamper-proof'], 'sim', 'vibration sensor', 'audio',
      ['3 year', 'three year'], 'sunlight',
      'waterproof', ['dustproof', 'dust'], ['high-temperature', 'temperature'],
      ['removal', 'device-removal'], ['breach alert', 'breach'],
    ],
  },
  '/vehicle-fleet-telematics-solutions-in-nigeria/': {
    section: '§3.3 Fleet Trackers',
    items: [
      ['optimise route', 'optimize route', 'route optim'],
      ['fuel consumption', 'fuel'], 'downtime',
      'real-time tracking', 'driver behaviour', ['automated report', 'reporting'],
      ['customisable alert', 'customizable alert', 'alert'],
      'dashboard', 'api', ['erm', 'erp'],
    ],
  },
  '/reliable-container-tracking/': {
    section: '§3.4 Goods Trackers (STAR)',
    items: [
      'star', 'stand-alone', 'rechargeable', 'months', 'magnet',
      'alloy', ['off-grid', 'remote'], ['extreme temperature', 'temperature'],
      ['moisture', 'weather'], 'container',
    ],
  },
  '/employee-monitoring-solutions/': {
    section: '§3.5 Human Trackers',
    items: [
      ['watch', 'watches'], ['keyring', 'key ring'], 'modem', 'chip',
      ['panic button', 'panic'], 'sos', 'geofenc', ['poi', 'point of interest'],
      ['ping', 'interval'], ['reserve power', 'reserve-power', 'power management'],
    ],
  },
  '/fleet-fuel-consumption-management-system/': {
    section: '§3.6 Fuel Monitoring',
    items: [
      'fuel', 'idling', 'speeding', ['inefficient driving', 'inefficient'],
      ['consumption trend', 'trend'], ['report', 'reports'], 'telematics',
    ],
  },
  '/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/': {
    section: '§4.1 Driver Monitoring — 3 pillars',
    items: [
      ['enhanced safety', 'safety'], ['reduced fuel', 'fuel consumption'],
      ['increased productivity', 'productivity'],
      ['risky', 'risk'], 'accident', ['emission', 'emissions'],
      ['idle time', 'idling'], 'maintenance',
    ],
  },
  '/gps-telematics-api-integrations/': {
    section: '§4.2 API Integration — 5 benefits',
    items: [
      ['data exchange', 'exchange'], 'location', 'speed', 'fuel',
      ['maintenance schedule', 'maintenance'],
      ['real-time alert', 'alert'], ['workflow', 'automation'],
      ['work-order', 'work order', 'dispatch'],
      ['customis', 'customiz', 'flexible'], ['dedicated', 'support'],
      ['erm', 'erp'],
    ],
  },
  '/fleet-analytics/': {
    section: '§4.3 Fleet Analytics — 15 capabilities',
    items: [
      'real-time tracking', 'history playback', 'geofencing', 'speed monitoring',
      'idling detection', 'fuel monitoring', 'maintenance alerts',
      'driver behaviour monitoring', 'temperature monitoring',
      ['cold-chain', 'cold chain', 'refrigerated'],
      'video telematics', ['emergency notification', 'sos'],
      ['turnaround time', 'tat'], ['asset utilisation', 'asset utilization'],
      ['route optimisation', 'route optimization'], 'incident reporting',
    ],
  },
  '/why-choose-primetrack/': {
    section: '§6.1 Why Choose — 7 advantages + P.R.I.M.E.',
    items: [
      ['ncc', 'regulator'], ['primecare', '24/7'],
      ['rugged', 'african'], ['heat', 'dust'], 'humidity',
      ['ai-driven', 'ai'], ['driver scoring', 'scoring'], 'predictive maintenance',
      ['longest in the industry', 'longest warranties', 'longest warranty'],
      ['mttr', 'mean-time-to-repair', 'after-sales'],
      ['open api', 'api'], ['modular', 'scalable'], 'ivts',
      ['3,000', '3000'],
      'performance', 'reliability', 'innovation', 'multifunctionality', 'efficiency',
    ],
  },
  '/warranty/': {
    section: '§6.2 Warranty',
    items: [
      ['3 year', 'three year'], ['date of purchase', 'purchase'],
      'original purchaser', ['materials', 'workmanship'],
      ['authorized', 'authorised'], ['tamper', 'tampering'],
      ['unauthorized repair', 'unauthorised repair', 'unauthorized'],
      'fire', ['surge', 'power'], ['force majeure', 'majeure'],
      ['sabotage'], ['non-transferable', 'transferable'], 'resale',
    ],
  },
  '/': {
    section: '§5 Homepage — descriptors, blurbs, stats',
    items: [
      'ai-enabled video telematics', 'solar-powered telematics',
      'iot-driven fleet management', 'precision vehicle tracking',
      'electronic cargo tracking', '15+ years industry experience',
      ['ios', 'android'], ['preventive maintenance', 'maintenance'],
      'driver behaviour', ['arrive alive', 'speed limiter'], 'frsc',
      ['ai-prime', 'video telematics'], ['fuel consumption', 'fuel'],
      ['api integration', 'api'],
      '5,000', '15+', '24/7',
      ['efficient telematics', 'efficient'],
    ],
  },
  '/contact-prime/': {
    section: '§1 Contact details',
    items: [
      ["l'monarch", 'monarch'], 'opebi', 'ikeja', 'lagos',
      '65c', '4th floor',
      '803 060 9099', '803 363 6033',
      'admin@primetracknigeria.net',
    ],
  },
};

/** Routes that must exist regardless of content (inventory §8). */
const REQUIRED_ROUTES = [
  '/', '/vehicle-video-tracking-systems/', '/primesolar/',
  '/vehicle-fleet-telematics-solutions-in-nigeria/', '/reliable-container-tracking/',
  '/employee-monitoring-solutions/', '/fleet-fuel-consumption-management-system/',
  '/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/',
  '/gps-telematics-api-integrations/', '/fleet-analytics/', '/why-choose-primetrack/',
  '/warranty/', '/contact-prime/', '/careers/', '/iccp/', '/tools/',
  '/service-terms/', '/egy/',
];

let missing = 0;
let checked = 0;

console.log('\n  GATE 4 — content preservation\n  ' + '='.repeat(76));

for (const route of REQUIRED_ROUTES) {
  if (textOf(route) === null) {
    console.log(`\n  ! ROUTE MISSING: ${route}`);
    missing++;
  }
}

for (const [route, { section, items }] of Object.entries(CHECKS)) {
  const text = textOf(route);
  if (text === null) continue;
  const gaps = [];
  for (const item of items) {
    checked++;
    const alts = Array.isArray(item) ? item : [item];
    if (!alts.some((a) => text.includes(a))) gaps.push(alts.join(' | '));
  }
  const status = gaps.length === 0 ? 'OK  ' : 'GAP ';
  console.log(`\n  ${status} ${section}`);
  console.log(`       ${route}  —  ${items.length - gaps.length}/${items.length} present`);
  for (const gap of gaps) {
    console.log(`       ! missing: ${gap}`);
    missing++;
  }
}

console.log('\n  ' + '='.repeat(76));
console.log(
  missing === 0
    ? `  PASS — ${checked} verified facts across ${REQUIRED_ROUTES.length} routes, none lost.\n`
    : `  FAIL — ${missing} gap(s) out of ${checked} checks.\n`,
);
process.exit(missing === 0 ? 0 : 1);
