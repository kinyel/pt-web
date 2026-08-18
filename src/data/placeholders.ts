/**
 * Every image slot on the site that has no real asset behind it.
 *
 * This is the single source of truth for the client handoff list. A slot only
 * appears on a page by referencing an id from here, and scripts/placeholder-
 * report.mjs cross-checks the two directions — a slot listed but never placed,
 * or a placeholder placed without a registered slot, both fail the report.
 *
 * Rule for filling these: real photography only. No stock, no AI-generated
 * imagery, no mocked-up dashboards. An empty slot is more honest than a fake
 * product shot, and a fabricated interface would be a false claim about the
 * software.
 */
export interface PlaceholderSlot {
  id: string;
  /** Route the slot appears on. */
  page: string;
  /** Which section of that page. */
  location: string;
  /** What the client needs to supply. */
  needs: string;
  ratio: 'video' | 'square' | 'wide' | 'portrait';
  /** Minimum pixel size for a crisp 2× render at the slot's layout width. */
  recommended: string;
}

export const placeholderSlots = [
  {
    id: 'fleet-on-road',
    page: '/vehicle-fleet-telematics-solutions-in-nigeria/',
    location: '“Scale” section, image sits right of the copy on desktop',
    needs:
      'A photograph of a managed customer fleet on the road or at a depot — trucks, vans or buses. Real vehicles, ideally Nigerian roads.',
    ratio: 'video',
    recommended: '1600 × 1000px',
  },
  {
    id: 'driver-behaviour-review',
    page: '/driver-behaviour-monitoring-systems-for-vehicle-fleet-management/',
    location: '“Better together” section, image sits right of the copy on desktop',
    needs:
      'A photograph of a driver-behaviour review actually happening — a fleet manager and driver going over reports, or a depot briefing. Do NOT substitute a mocked-up dashboard screenshot.',
    ratio: 'video',
    recommended: '1600 × 1000px',
  },
  {
    id: 'star-container-tracker',
    page: '/reliable-container-tracking/',
    location: 'Product detail section, below the specification list',
    needs:
      'A photograph of the STAR tracker magnetically attached to a shipping container or cargo unit, showing its real size against the container.',
    ratio: 'video',
    recommended: '1600 × 1000px',
  },
  {
    id: 'wearable-personnel-tracker',
    page: '/employee-monitoring-solutions/',
    location: 'Product detail section, below the device list',
    needs:
      'A photograph of the wearable personnel devices — the watch, keyring, modem and chip formats named in the copy, ideally together for scale.',
    ratio: 'video',
    recommended: '1600 × 1000px',
  },
] as const satisfies readonly PlaceholderSlot[];

export type PlaceholderId = (typeof placeholderSlots)[number]['id'];

export const getSlot = (id: PlaceholderId): PlaceholderSlot => {
  const slot = placeholderSlots.find((s) => s.id === id);
  if (!slot) throw new Error(`Unknown placeholder slot: ${id}`);
  return slot;
};
