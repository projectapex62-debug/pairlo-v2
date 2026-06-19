// ============================================================
// PAIRLO MOCK ADAPTER
// Shapes mock-data.ts pairs into EngineStay / EngineCar format
// so the real matching engine can score them.
// Swap this out at launch — replace with real Expedia/Booking calls.
// ============================================================

import { allPairs } from "../../web/lib/mock-data";
import type { EngineStay, EngineCar } from "./matching-engine";

// Real-world coordinates for each pair's stay location
const STAY_COORDS: Record<string, { lat: number; lng: number }> = {
  "pair-1":  { lat: 34.0259,  lng: -118.7798 }, // Malibu
  "pair-2":  { lat: 39.1911,  lng: -106.8175 }, // Aspen
  "pair-3":  { lat: 36.1627,  lng: -86.7816  }, // Nashville
  "pair-4":  { lat: 25.7617,  lng: -80.1918  }, // Miami Beach
  "pair-5":  { lat: 40.7193,  lng: -74.0089  }, // Tribeca NYC
  "pair-6":  { lat: 34.0522,  lng: -118.5260 }, // Pacific Palisades
  "pair-7":  { lat: 41.8858,  lng: -87.6181  }, // Chicago Lakefront
  "pair-8":  { lat: 33.4942,  lng: -111.9261 }, // Scottsdale
  "pair-9":  { lat: 37.7924,  lng: -122.4382 }, // Pacific Heights SF
  "pair-10": { lat: 29.9277,  lng: -90.0715  }, // Garden District NOLA
  "pair-11": { lat: 39.7158,  lng: -104.9519 }, // Cherry Creek Denver
  "pair-12": { lat: 34.8697,  lng: -111.7609 }, // Sedona
  "pair-13": { lat: 32.7765,  lng: -79.9311  }, // Charleston
  "pair-14": { lat: 30.2430,  lng: -97.7498  }, // Travis Heights Austin
  "pair-15": { lat: 22.2053,  lng: -159.4785 }, // Hanalei Bay Kauai
};

// Car pickup coords — slightly offset from stay (simulating nearby rental lot)
const CAR_PICKUP_OFFSETS: Record<string, { dlat: number; dlng: number }> = {
  "pair-1":  { dlat:  0.010, dlng:  0.008 }, // ~1.2km
  "pair-2":  { dlat:  0.005, dlng:  0.006 }, // ~0.7km — ski-in/ski-out close
  "pair-3":  { dlat:  0.020, dlng:  0.015 }, // ~2.4km
  "pair-4":  { dlat:  0.008, dlng:  0.010 }, // ~1.2km
  "pair-5":  { dlat:  0.025, dlng:  0.020 }, // ~2.8km Manhattan
  "pair-6":  { dlat:  0.012, dlng:  0.009 }, // ~1.4km
  "pair-7":  { dlat:  0.018, dlng:  0.014 }, // ~2.2km Chicago
  "pair-8":  { dlat:  0.006, dlng:  0.007 }, // ~0.8km resort area
  "pair-9":  { dlat:  0.022, dlng:  0.018 }, // ~2.6km SF hills
  "pair-10": { dlat:  0.030, dlng:  0.025 }, // ~3.8km NOLA
  "pair-11": { dlat:  0.014, dlng:  0.011 }, // ~1.7km Denver
  "pair-12": { dlat:  0.009, dlng:  0.008 }, // ~1.1km Sedona
  "pair-13": { dlat:  0.016, dlng:  0.013 }, // ~2.0km Charleston
  "pair-14": { dlat:  0.019, dlng:  0.015 }, // ~2.3km Austin
  "pair-15": { dlat:  0.007, dlng:  0.006 }, // ~0.9km Hawaii island
};

export function buildEnginePairs(destinationFilter?: string): {
  stays: EngineStay[];
  cars:  EngineCar[];
  pairMap: Record<string, string>; // stayId → pairId (for reassembling)
} {
  const stays: EngineStay[] = [];
  const cars:  EngineCar[]  = [];
  const pairMap: Record<string, string> = {};

  const pairs = destinationFilter && destinationFilter !== "All"
    ? allPairs.filter(p =>
        p.stay.location.toLowerCase().includes(destinationFilter.toLowerCase())
      )
    : allPairs;

  for (const pair of pairs) {
    const coords  = STAY_COORDS[pair.id]  ?? { lat: 37.0, lng: -95.0 };
    const offsets = CAR_PICKUP_OFFSETS[pair.id] ?? { dlat: 0.015, dlng: 0.012 };

    const stayId = `stay-${pair.id}`;
    const carId  = `car-${pair.id}`;

    stays.push({
      id:          stayId,
      name:        pair.stay.name,
      lat:         coords.lat,
      lng:         coords.lng,
      total_price: pair.stay.price * pair.totalNights,
      nights:      pair.totalNights,
    });

    cars.push({
      id:          carId,
      name:        pair.car.name,
      pickup_lat:  coords.lat + offsets.dlat,
      pickup_lng:  coords.lng + offsets.dlng,
      total_price: pair.car.price * pair.totalDays,
      pickup_date: undefined, // same-day pickup — scores 10 on dateAlignment
    });

    pairMap[stayId] = pair.id;
  }

  return { stays, cars, pairMap };
}

// ── Score all mock pairs and return enriched pair list ────────

import { calculatePairScore } from "./matching-engine";
import type { allPairs as AllPairsType } from "../../web/lib/mock-data";

export interface ScoredMockPair {
  pairId:         string;
  engineScore: {
    pairScore:      number;
    proximityScore: number;
    dateScore:      number;
    priceScore:     number;
    styleScore:     number;
    distanceKm:     number;
  };
}

export function scoreMockPairs(checkIn = "2026-10-15", checkOut = "2026-10-20"): ScoredMockPair[] {
  const { stays, cars, pairMap } = buildEnginePairs();
  const search = { check_in: checkIn, check_out: checkOut };
  const results: ScoredMockPair[] = [];

  for (let i = 0; i < stays.length; i++) {
    const stay = stays[i];
    const car  = cars[i];
    const scores = calculatePairScore(stay, car, search);
    const pairId = pairMap[stay.id];
    results.push({ pairId, engineScore: scores });
  }

  results.sort((a, b) => b.engineScore.pairScore - a.engineScore.pairScore);
  return results;
}

// ── getScoredAndSortedPairs ───────────────────────────────────
// Takes the full allPairs array + a search context, scores every pair
// using the real engine, injects engineBreakdown + engineScore onto each,
// and returns sorted by pairScore descending (used by search.tsx).

type RawPair = typeof AllPairsType[number];

export type ScoredPairWithBreakdown = RawPair & {
  engineScore:     number;       // top-level for sort comparisons
  engineBreakdown: {
    pairScore:      number;
    proximityScore: number;
    dateScore:      number;
    priceScore:     number;
    styleScore:     number;
    distanceKm:     number;
  };
};

export function getScoredAndSortedPairs(
  pairs: RawPair[],
  search: { check_in: string; check_out: string }
): ScoredPairWithBreakdown[] {
  const { stays, cars, pairMap } = buildEnginePairs();

  // Build lookup: pairId → scores
  const scoreMap: Record<string, ScoredMockPair["engineScore"]> = {};
  for (let i = 0; i < stays.length; i++) {
    const scores = calculatePairScore(stays[i], cars[i], search);
    const pairId = pairMap[stays[i].id];
    if (pairId) scoreMap[pairId] = scores;
  }

  const scored: ScoredPairWithBreakdown[] = pairs.map((p) => {
    const breakdown = scoreMap[p.id] ?? {
      pairScore: 7.0, proximityScore: 7, dateScore: 10,
      priceScore: 7, styleScore: 7, distanceKm: 2.0,
    };
    return {
      ...p,
      engineScore:     breakdown.pairScore,
      engineBreakdown: breakdown,
    };
  });

  // Default sort: highest pairScore first
  scored.sort((a, b) => b.engineScore - a.engineScore);
  return scored;
}
