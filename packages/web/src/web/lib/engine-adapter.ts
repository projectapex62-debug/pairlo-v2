// ============================================================
// ENGINE ADAPTER — ties matching-engine to mock-data pairs
// Used by search.tsx to score + sort results live
// ============================================================

import {
  calculatePairScore,
  generatePairs,
  getFallbackPairs,
  getEngineScoreLabel,
  getEngineScoreColor,
  type EngineStay,
  type EngineCar,
  type EngineSearch,
} from '../../api/engine/matching-engine';
import { allPairs } from './mock-data';

// Real city-center coordinates for every destination in mock-data
const DEST_COORDS: Record<string, { lat: number; lng: number }> = {
  "Malibu, CA":              { lat: 34.0259,  lng: -118.7798 },
  "Pacific Palisades, CA":   { lat: 34.0522,  lng: -118.5260 },
  "Aspen, CO":               { lat: 39.1911,  lng: -106.8175 },
  "Nashville, TN":           { lat: 36.1627,  lng:  -86.7816 },
  "Miami Beach, FL":         { lat: 25.7907,  lng:  -80.1300 },
  "Tribeca, New York":       { lat: 40.7195,  lng:  -74.0089 },
  "Chicago, IL":             { lat: 41.8781,  lng:  -87.6298 },
  "Scottsdale, AZ":          { lat: 33.4942,  lng: -111.9261 },
  "San Francisco, CA":       { lat: 37.7749,  lng: -122.4194 },
  "New Orleans, LA":         { lat: 29.9511,  lng:  -90.0715 },
  "Denver, CO":              { lat: 39.7392,  lng: -104.9903 },
  "Sedona, AZ":              { lat: 34.8697,  lng: -111.7609 },
  "Charleston, SC":          { lat: 32.7765,  lng:  -79.9311 },
  "Austin, TX":              { lat: 30.2672,  lng:  -97.7431 },
  "Kauai, HI":               { lat: 22.0964,  lng: -159.5261 },
};

// Car pickup offsets (realistic — nearby but not identical to stay)
const CAR_OFFSETS = [
  { dlat:  0.005,  dlng:  0.007  }, // ~0.8 km
  { dlat:  0.018,  dlng:  0.015  }, // ~2.3 km
  { dlat: -0.012,  dlng:  0.025  }, // ~2.8 km
  { dlat:  0.030,  dlng: -0.010  }, // ~3.3 km
  { dlat: -0.025,  dlng: -0.020  }, // ~3.2 km
  { dlat:  0.045,  dlng:  0.038  }, // ~5.9 km
  { dlat: -0.008,  dlng:  0.012  }, // ~1.5 km
  { dlat:  0.022,  dlng: -0.018  }, // ~2.8 km
  { dlat: -0.035,  dlng:  0.005  }, // ~3.9 km
  { dlat:  0.010,  dlng:  0.030  }, // ~3.2 km
  { dlat: -0.050,  dlng: -0.040  }, // ~6.4 km
  { dlat:  0.003,  dlng: -0.006  }, // ~0.7 km
  { dlat: -0.020,  dlng:  0.035  }, // ~4.0 km
  { dlat:  0.040,  dlng:  0.020  }, // ~4.5 km
  { dlat: -0.015,  dlng: -0.045  }, // ~4.8 km
];

export interface ScoredMockPair {
  pair: typeof allPairs[number];
  engineScore: {
    pairScore:      number;
    proximityScore: number;
    dateScore:      number;
    priceScore:     number;
    styleScore:     number;
    distanceKm:     number;
    label:          string;
    color:          string;
  };
}

/**
 * Scores all mock pairs using the real matching engine.
 * Pass a search date range; defaults to a 5-night trip starting today.
 */
export function scoreMockPairs(
  checkIn?: string,
  checkOut?: string
): ScoredMockPair[] {
  // Default: 5-night trip starting today
  const today = new Date();
  const defaultIn  = checkIn  ?? today.toISOString().split('T')[0];
  const outDate    = new Date(today);
  outDate.setDate(today.getDate() + 5);
  const defaultOut = checkOut ?? outDate.toISOString().split('T')[0];

  const search: EngineSearch = { check_in: defaultIn, check_out: defaultOut };

  return allPairs.map((pair, idx) => {
    const loc    = pair.stay.location;
    const base   = DEST_COORDS[loc] ?? { lat: 37.7749, lng: -122.4194 };
    const offset = CAR_OFFSETS[idx % CAR_OFFSETS.length];
    const nights = pair.totalNights ?? 4;

    const stay: EngineStay = {
      id:          pair.id,
      name:        pair.stay.name,
      lat:         base.lat,
      lng:         base.lng,
      total_price: pair.stay.price * nights,
      nights,
    };

    const car: EngineCar = {
      id:          `${pair.id}-car`,
      name:        pair.car.name,
      pickup_lat:  base.lat  + offset.dlat,
      pickup_lng:  base.lng  + offset.dlng,
      total_price: pair.car.price * (pair.totalDays ?? nights),
      pickup_date: undefined, // same-day = perfect date score
    };

    const scores = calculatePairScore(stay, car, search);

    return {
      pair,
      engineScore: {
        ...scores,
        label: getEngineScoreLabel(scores.pairScore),
        color: getEngineScoreColor(scores.pairScore),
      },
    };
  });
}

/**
 * Returns allPairs sorted by engine pairScore (highest first).
 * Pairs with score < 5.0 are pushed to the bottom (not hidden).
 */
export function getSortedPairs(checkIn?: string, checkOut?: string) {
  return scoreMockPairs(checkIn, checkOut)
    .sort((a, b) => b.engineScore.pairScore - a.engineScore.pairScore)
    .map(({ pair, engineScore }) => ({ ...pair, engineScore }));
}

export { getEngineScoreLabel, getEngineScoreColor };
