/**
 * Verified company facts — inventory §1, §5.
 * NOTHING may be added here that is not in primetrack-content-inventory.md.
 * If a value is needed but unverified, use the PLACEHOLDER constant.
 */

export const PLACEHOLDER = '[PLACEHOLDER: client to confirm]' as const;

export const company = {
  name: 'PrimeTrack Telematics',
  shortName: 'PrimeTrack',
  /** The company's own positioning lines — used in their voice, not as our claim. */
  positioning: "Nigeria's #1 GPS Tracking Company",
  positioningAlt: "Nigeria's PRIME Vehicle Tracking Service Provider",
  sector: 'GPS/vehicle tracking, telematics, fleet management, IoT',
  supportBrand: 'PrimeCARE',
} as const;

/** Core values — P.R.I.M.E. (inventory §1) */
export const primeValues = [
  { letter: 'P', word: 'Performance' },
  { letter: 'R', word: 'Reliability' },
  { letter: 'I', word: 'Innovation' },
  { letter: 'M', word: 'Multifunctionality' },
  { letter: 'E', word: 'Efficiency' },
] as const;

export const contact = {
  addressLines: ['4th Floor, L’Monarch Towers', '65C Opebi Road, Ikeja', 'Lagos, Nigeria'],
  addressOneLine: '4th Floor, L’Monarch Towers, 65C Opebi Road, Ikeja, Lagos',
  email: 'admin@primetracknigeria.net',
  phones: [
    { display: '+234 803 060 9099', tel: '+2348030609099' },
    { display: '+234 803 363 6033', tel: '+2348033636033' },
  ],
  /** L'Monarch Tower, Opebi — inventory §1 */
  map: { lat: 6.5894, lng: 3.3582, label: 'L’Monarch Towers, Opebi Road, Ikeja, Lagos' },
} as const;

/**
 * WhatsApp click-to-chat.
 *
 * wa.me needs the number in full international form with no plus sign and no
 * separators, so the local 0806... is stored here already converted: the
 * leading 0 is Nigeria's trunk prefix and is replaced by the 234 country code.
 * `display` keeps the local form, which is how a Nigerian customer reads it.
 */
export const whatsapp = {
  display: '0806 440 1656',
  /** 08064401656 -> +234 806 440 1656 */
  international: '2348064401656',
  message: 'Hello PrimeTrack, I need more info about your services',
} as const;

/** Multi-country operation (inventory §1). Only these three destinations exist. */
export const countries = [
  { code: 'NGA', label: 'Nigeria', href: '/', external: false },
  { code: 'RWA', label: 'Rwanda', href: 'https://www.primetrack.rw', external: true },
  { code: 'EGY', label: 'Egypt', href: '/egy/', external: false },
] as const;

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/primetracktelematics/' },
  { label: 'X (Twitter)', href: 'https://twitter.com/PrimeTrack' },
  { label: 'Facebook', href: 'https://facebook.com/primetrackltd' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company-beta/17909242' },
] as const;

/** Trust signals — inventory §1. All independently verified; safe to display. */
export const credentials = [
  {
    title: 'NCC-licensed',
    body: 'Licensed by the Nigerian Communications Commission to provide GPS tracking and telematics services in Nigeria.',
  },
  {
    title: 'FRSC-licensed Speed Limiter vendor',
    body: 'An approved Federal Road Safety Corps vendor for Arrive Alive speed limiters.',
  },
  {
    title: '3-year product warranty',
    body: 'Three years from date of purchase for the original purchaser, one of the longest warranties in the industry.',
  },
  {
    title: '24/7 PrimeCARE support',
    body: 'Round-the-clock human support with proactive monitoring for anomalies on your account.',
  },
] as const;

/**
 * The certificate PDF that exists on the live site. The filename keeps its
 * original spelling and space (it is an indexed, linked asset); only the
 * display label is cleaned. See docs/information-architecture.md §4.
 */
export const certificatesPdf = {
  href: '/primetrack_cac_ncc_frsc%20certifictes.pdf',
  label: 'CAC · NCC · FRSC Certificates (PDF)',
} as const;

/** The current I.C.C.P. document, supplied by the client as a PDF. */
export const iccpDocument = {
  href: '/documents/PrimeTrack-Current-ICCP-.pdf',
  label: 'PrimeTrack Current I.C.C.P.',
} as const;

/**
 * The ONLY four numeric claims permitted anywhere on this site (inventory §5).
 * Do not add to this list without a client-verified source.
 */
export const stats = [
  { value: '5,000', label: 'Active trackers in service' },
  { value: '15+', label: 'Years industry experience' },
  { value: '5', label: 'Countries in operation' },
  { value: '24/7', label: 'Customer service' },
] as const;

/** Hero sub-band descriptors — verbatim capability list from the homepage. */
export const descriptors = [
  'Ai-Enabled Video Telematics',
  'Solar-Powered Telematics',
  'IoT-driven Fleet Management',
  'Precision Vehicle Tracking',
  'Electronic Cargo Tracking',
  '15+ Years Industry Experience',
] as const;
