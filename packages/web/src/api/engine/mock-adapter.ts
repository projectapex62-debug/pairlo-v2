// ============================================================
// PAIRLO MOCK ADAPTER
// Converts mock-data.ts pairs into the shape the matching engine expects
// Replace with real API responses at launch (normalizeStays / normalizeCars)
// ============================================================

import type { EngineStay, EngineCar } from './matching-engine';

// Real coordinates for each destination (lat/lng of city center / typical pickup zone)
const DESTINATION_COORDS: Record<string, { lat: number; lng: number }> = {
  "Malibu, CA":              { lat: 34.0259, lng: -118.7798 },
  "Pacific Palisades, CA":   { lat: 34.0522, lng: -118.5260 },
  "Aspen, CO":               { lat: 39.1911, lng: -106.8175 },
  "Nashville, TN":           { lat: 36.1627, lng:  -86.7816 },
  "Miami Beach, FL":         { lat: 25.7907, lng:  -80.1300 },
  "Tribeca, New York":       { lat: 40.7195, lng:  -74.0089 },
  "Chicago, IL":             { lat: 41.8781, lng:  -87.6298 },
  "Scottsdale, AZ":          { lat: 33.4942, lng: -111.9261 },
  "San Francisco, CA":       { lat: 37.7749, lng: -122.4194 },
  "New Orleans, LA":         { lat: 29.9511, lng:  -90.0715 },
  "Denver, CO":              { lat: 39.7392, lng: -104.9903 },
  "Sedona, AZ":              { lat: 34.8697, lng: -111.7609 },
  "Charleston, SC":          { lat: 32.7765, lng:  -79.9311 },
  "Austin, TX":              { lat: 30.2672, lng:  -97.7431 },
  "Kauai, HI":               { lat: 22.0964, lng: -159.5261 },
};

// Small offsets so car pickup isn't exactly at the stay (realistic proximity)
// Index → offset in km (roughly)
const CAR_OFFSETS: Array<{ dlat: number; dlng: number }> = [
  { dlat:  0.005, dlng:  0.007 }, // ~0.8km — same neighborhood
  { dlat:  0.018, dlng:  0.015 }, // ~2.3km — nearby
  { dlat: -0.012, dlng:  0.025 }, // ~2.8km — nearby
  { dlat:  0.030, dlng: -0.010 }, // ~3.3km — short drive
  { dlat: -0.025, dlng: -0.020 }, // ~3.2km — short drive
  { dlat:  0.045, dlng:  0.038 }, // ~5.9km — close
];

export interface EngineInput {
  stays: EngineStay[];
  cars:  EngineCar[];
}

/**
 * Builds engine-shaped stays + cars from the allPairs mock data.
 * Each pair yields 1 stay and 1 car — they're already curated combos,
 * so we treat each stay as a separate option.
 */
export function buildEnginePairs(destination?: string): EngineInput {
  // Import here to avoid circular deps at module level
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { allPairs } = require('../../../web/lib/mock-data') as { allPairs: any[] };

  const stays: EngineStay[] = [];
  const cars:  EngineCar[]  = [];

  allPairs.forEach((pair, idx) => {
    const loc  = pair.stay.location as string;
    const base = DESTINATION_COORDS[loc] ?? { lat: 37.7749, lng: -122.4194 };
    const offset = CAR_OFFSETS[idx % CAR_OFFSETS.length];

    const nights = pair.totalNights ?? 4;

    stays.push({
      id:          pair.id,
      name:        pair.stay.name,
      lat:         base.lat,
      lng:         base.lng,
      total_price: pair.stay.price * nights,
      nights,
    });

    cars.push({
      id:          `${pair.id}-car`,
      name:        pair.car.name,
      pickup_lat:  base.lat  + offset.dlat,
      pickup_lng:  base.lng  + offset.dlng,
      total_price: pair.car.price * (pair.totalDays ?? nights),
      pickup_date: undefined, // same-day pickup → perfect date score
    });
  });

  // If destination filter given, narrow down
  if (destination && destination.toLowerCase() !== 'all') {
    const dest = destination.toLowerCase();
    const filtered = allPairs
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.stay.location.toLowerCase().includes(dest));

    if (filtered.length > 0) {
      return {
        stays: filtered.map(({ i }) => stays[i]),
        cars:  filtered.map(({ i }) => cars[i]),
      };
    }
  }

  return { stays, cars };
}
