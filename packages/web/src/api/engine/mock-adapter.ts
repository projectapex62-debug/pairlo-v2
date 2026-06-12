// ============================================================
// PAIRLO MOCK ADAPTER
// Shapes allPairs mock data into EngineStay + EngineCar
// so the matching engine can score them exactly as it will
// with real Expedia + Booking.com data at launch.
// ============================================================

import type { EngineStay, EngineCar } from './matching-engine';
import { allPairs } from '../../web/lib/mock-data';

// ── Destination coordinates (geocoded once, hardcoded for mock) ──

const DEST_COORDS: Record<string, { lat: number; lng: number }> = {
  'Malibu, CA':            { lat: 34.0259,  lng: -118.7798 },
  'Pacific Palisades, CA': { lat: 34.0522,  lng: -118.5260 },
  'Aspen, CO':             { lat: 39.1911,  lng: -106.8175 },
  'Nashville, TN':         { lat: 36.1627,  lng: -86.7816  },
  'Miami Beach, FL':       { lat: 25.7907,  lng: -80.1300  },
  'Tribeca, New York':     { lat: 40.7195,  lng: -74.0089  },
  'Chicago, IL':           { lat: 41.8781,  lng: -87.6298  },
  'Scottsdale, AZ':        { lat: 33.4942,  lng: -111.9261 },
  'San Francisco, CA':     { lat: 37.7749,  lng: -122.4194 },
  'New Orleans, LA':       { lat: 29.9511,  lng: -90.0715  },
  'Denver, CO':            { lat: 39.7392,  lng: -104.9903 },
  'Sedona, AZ':            { lat: 34.8697,  lng: -111.7609 },
  'Charleston, SC':        { lat: 32.7765,  lng: -79.9311  },
  'Austin, TX':            { lat: 30.2672,  lng: -97.7431  },
  'Kauai, HI':             { lat: 22.0964,  lng: -159.5261 },
};

// Car pickup is near (but not identical to) the stay — simulates a
// nearby rental counter within 1–5 km, matching engine rewards this.
const PICKUP_OFFSET: Record<string, { dlat: number; dlng: number }> = {
  'pair-1':  { dlat:  0.008, dlng:  0.012 }, // ~1.2 km — same block
  'pair-2':  { dlat:  0.015, dlng:  0.018 }, // ~2.1 km — base of mountain
  'pair-3':  { dlat:  0.005, dlng:  0.006 }, // ~0.7 km — building garage
  'pair-4':  { dlat:  0.010, dlng:  0.014 }, // ~1.5 km — Star Island causeway
  'pair-5':  { dlat:  0.003, dlng:  0.004 }, // ~0.4 km — building valet
  'pair-6':  { dlat:  0.020, dlng:  0.025 }, // ~2.8 km — PCH rental lot
  'pair-7':  { dlat:  0.007, dlng:  0.009 }, // ~1.0 km — underground garage
  'pair-8':  { dlat:  0.018, dlng:  0.022 }, // ~2.5 km — resort motor court
  'pair-9':  { dlat:  0.025, dlng:  0.030 }, // ~3.4 km — Civic Center lot
  'pair-10': { dlat:  0.012, dlng:  0.015 }, // ~1.7 km — Magazine St depot
  'pair-11': { dlat:  0.009, dlng:  0.011 }, // ~1.2 km — Cherry Creek garage
  'pair-12': { dlat:  0.030, dlng:  0.035 }, // ~4.2 km — Sedona airport
  'pair-13': { dlat:  0.008, dlng:  0.010 }, // ~1.1 km — Market St depot
  'pair-14': { dlat:  0.011, dlng:  0.013 }, // ~1.5 km — SoCo lot
  'pair-15': { dlat:  0.050, dlng:  0.060 }, // ~7.0 km — Lihue airport
};

// ── Build engine-shaped stays + cars from allPairs ────────

export function buildEnginePairs(
  _destination?: string // reserved for future filtering
): { stays: EngineStay[]; cars: EngineCar[] } {
  const stays: EngineStay[] = [];
  const cars:  EngineCar[]  = [];

  for (const pair of allPairs) {
    const loc    = pair.stay.location ?? '';
    const coords = DEST_COORDS[loc] ?? { lat: 37.0902, lng: -95.7129 }; // fallback: US center
    const offset = PICKUP_OFFSET[pair.id] ?? { dlat: 0.02, dlng: 0.02 };
    const nights = pair.totalNights ?? 4;

    stays.push({
      id:          pair.id + '-stay',
      name:        pair.stay.name,
      lat:         coords.lat,
      lng:         coords.lng,
      total_price: pair.stay.price * nights,
      nights,
    });

    cars.push({
      id:          pair.id + '-car',
      name:        pair.car.name,
      pickup_lat:  coords.lat + offset.dlat,
      pickup_lng:  coords.lng + offset.dlng,
      total_price: pair.car.price * nights,
    });
  }

  return { stays, cars };
}

// ── Score a single pair by its IDs ───────────────────────

import { calculatePairScore } from './matching-engine';

export function scoreMockPair(
  pairId: string,
  search: { check_in: string; check_out: string }
) {
  const { stays, cars } = buildEnginePairs();
  const stay = stays.find(s => s.id === pairId + '-stay');
  const car  = cars.find(c  => c.id === pairId + '-car');
  if (!stay || !car) return null;
  return calculatePairScore(stay, car, search);
}

// ── Sort allPairs by engine score ────────────────────────

export function getScoredAndSortedPairs(
  pairs: typeof allPairs,
  search: { check_in: string; check_out: string }
): (typeof allPairs[number] & { engineScore: number; engineBreakdown: ReturnType<typeof calculatePairScore> })[] {
  const { stays, cars } = buildEnginePairs();

  return pairs
    .map(pair => {
      const stay = stays.find(s => s.id === pair.id + '-stay');
      const car  = cars.find(c  => c.id === pair.id + '-car');
      if (!stay || !car) return { ...pair, engineScore: 0, engineBreakdown: null as any };
      const breakdown = calculatePairScore(stay, car, search);
      return { ...pair, engineScore: breakdown.pairScore, engineBreakdown: breakdown };
    })
    .sort((a, b) => b.engineScore - a.engineScore);
}
