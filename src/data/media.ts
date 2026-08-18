/**
 * Registry of real image assets.
 *
 * Every file here was downloaded from PrimeTrack's live site (the paths listed
 * in content-inventory §7) and is stored in the repo — nothing is hot-linked,
 * nothing is stock, nothing is generated. Alt text describes what is actually
 * in each frame, written from looking at the file.
 *
 * `note` records anything a future editor should know about the asset's
 * quality or provenance before reusing it.
 */
import primesolarTracker from '../assets/products/primesolar-solar-tracker.jpg';
import fuelMonitoring from '../assets/products/fuel-monitoring.jpg';
import videoTrackingDashcam from '../assets/products/vehicle-video-tracking-dashcam.jpg';
import mdvrCameraKit from '../assets/products/mdvr-camera-kit.jpg';
import primetrackLogo from '../assets/brand/primetrack-logo.png';
import accreditations from '../assets/brand/accreditations.png';

export interface MediaAsset {
  image: ImageMetadata;
  alt: string;
  source: string;
  note?: string;
}

export const media = {
  primesolarTracker: {
    image: primesolarTracker,
    alt: 'PrimeSOLAR promotional graphic: a long-haul truck at sunset beneath a GPS location pin, captioned with the tracker’s features — 3-year battery lifespan, SIM-loss proof, tamper proof, water proof, removal proof, power-off proof, temperature proof, and SMS notifications for movement, incident and breach alerts.',
    source: '/wp-content/uploads/2024/03/2-website-image-solar-tracker-1024x724.jpg',
    note: 'Marketing collage with baked-in text, not a clean product shot. The text is unreadable at small sizes and cannot be translated or restyled. Worth replacing with a plain photograph of the device.',
  },
  fuelMonitoring: {
    image: fuelMonitoring,
    alt: 'A hand holding a fuel pump nozzle while refuelling a vehicle, overlaid with a fuel gauge reading full and the words “Fuel Monitoring”.',
    source:
      '/wp-content/uploads/2023/07/fuel-management-fuel-monitoring-device-fleet-fuel-management.jpg',
    note: 'Generic stock composite despite the filename — it shows no PrimeTrack hardware, and the baked-in word “MONITORING” is cropped off at the right edge in the original file. Recommended for replacement.',
  },
  videoTrackingDashcam: {
    image: videoTrackingDashcam,
    alt: 'A vehicle video-tracking camera mounted to a windscreen, its rear screen showing the live forward view of the road it is recording.',
    source: '/wp-content/uploads/2023/06/vehicle-video-tracking-nigeria.jpg',
  },
  mdvrCameraKit: {
    image: mdvrCameraKit,
    alt: 'A vehicle video telematics kit: a monitor displaying four camera feeds at once, a mobile DVR recorder unit, and five vehicle cameras including windscreen, flush-mount, dome and side-mounted types.',
    source: '/wp-content/uploads/2023/06/vehicle-dvr-realtime-cctv.jpg',
  },
  logo: {
    image: primetrackLogo,
    alt: 'PrimeTrack Telematics (Nig.) Ltd',
    source: '/wp-content/uploads/2023/06/logo-primetrack-telematics.png',
    note: 'Only 111×99px — the largest logo file published on the live site. Crisp up to roughly 48px tall on a 2× screen and blurry beyond that. A vector (SVG/EPS) is on the client punch-list.',
  },
  accreditations: {
    image: accreditations,
    alt: 'Three regulatory emblems displayed by PrimeTrack: the coat of arms of the Federal Republic of Nigeria, the Nigerian Communications Commission (NCC), and the Standards Organisation of Nigeria (SON).',
    source: '/wp-content/uploads/2023/07/accreditations.fw_.png',
    note: 'Only 180×58px, so it is used small. NOTE A DISCREPANCY: this graphic shows NCC and SON, but the certificates PDF on the live site is named for CAC, NCC and FRSC. SON is not corroborated anywhere else in the content inventory — client to confirm before any accreditation is stated in copy. Nothing on the rebuilt site claims SON certification in words.',
  },
} satisfies Record<string, MediaAsset>;
