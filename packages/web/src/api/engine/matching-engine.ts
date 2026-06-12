// ============================================================
// PAIRLO MATCHING ENGINE (TypeScript — Frontend + Backend)
// Ported from 02-matching-engine.js
// No DB dependency — pure scoring logic, runs in browser or server
// ============================================================

export const WEIGHTS = {
  proximity:  0.35,
  dateAlign:  0.30,
  priceValue: 0.20,
  styleMatch: 0.15,
};

// ── Types ─────────────────────────────────────────────────

export interface EngineStay {
  id:          string;
  name:        string;
  lat:         number;
  lng:         number;
  total_price: number; // total for the trip
  nights:      number;
}

export interface EngineCar {
  id:          string;
  name:        string;
  pickup_lat:  number;
  pickup_lng:  number;
  total_price: number;
  pickup_date?: string;
}

export interface EngineSearch {
  check_in:  string; // YYYY-MM-DD
  check_out: string;
}

export interface PairScoreResult {
  pairScore:      number;
  proximityScore: number;
  dateScore:      number;
  priceScore:     number;
  styleScore:     number;
  distanceKm:     number;
}

export interface ScoredPair {
  stay:            EngineStay;
  car:             EngineCar;
  pairScore:       number;
  proximityScore:  number;
  dateScore:       number;
  priceScore:      number;
  styleScore:      number;
  distanceKm:      number;
  totalPrice:      number;
  stayCommission:  number;
  carCommission:   number;
  totalCommission: number;
}

// ── Haversine Distance ─────────────────────────────────────

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Individual Scoring Functions ──────────────────────────

export function scoreProximity(stay: EngineStay, car: EngineCar): number {
  const distKm = getDistanceKm(stay.lat, stay.lng, car.pickup_lat, car.pickup_lng);
  if (distKm <= 1)  return 10;
  if (distKm <= 3)  return 8.5;
  if (distKm <= 7)  return 7;
  if (distKm <= 15) return 5;
  if (distKm <= 30) return 3;
  return 1;
}

export function scoreDateAlignment(search: EngineSearch, car: EngineCar): number {
  const checkIn  = new Date(search.check_in);
  const pickup   = new Date(car.pickup_date ?? search.check_in);
  const diffDays = Math.abs((pickup.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 10;
  if (diffDays === 1) return 7;
  if (diffDays === 2) return 4;
  return 2;
}

export function scorePriceValue(stay: EngineStay, car: EngineCar): number {
  const total    = stay.total_price + car.total_price;
  const nights   = stay.nights || 5;
  const perNight = total / nights;
  if (perNight < 200)  return 10;
  if (perNight < 350)  return 8.5;
  if (perNight < 500)  return 7;
  if (perNight < 750)  return 5.5;
  if (perNight < 1000) return 4;
  return 3;
}

export function scoreStyleMatch(stay: EngineStay, car: EngineCar): number {
  const getStayTier = (price: number) => {
    if (price <= 1000) return 1;
    if (price <= 2500) return 2;
    if (price <= 5000) return 3;
    return 4;
  };
  const getCarTier = (price: number) => {
    if (price <= 150) return 1;
    if (price <= 300) return 2;
    if (price <= 600) return 3;
    return 4;
  };
  const diff = Math.abs(getStayTier(stay.total_price) - getCarTier(car.total_price));
  if (diff === 0) return 10;
  if (diff === 1) return 7;
  if (diff === 2) return 4;
  return 1;
}

// ── Master Pair Score ─────────────────────────────────────

export function calculatePairScore(
  stay: EngineStay,
  car: EngineCar,
  search: EngineSearch
): PairScoreResult {
  const proximity  = scoreProximity(stay, car);
  const dateAlign  = scoreDateAlignment(search, car);
  const priceValue = scorePriceValue(stay, car);
  const styleMatch = scoreStyleMatch(stay, car);

  const weighted =
    proximity  * WEIGHTS.proximity  +
    dateAlign  * WEIGHTS.dateAlign  +
    priceValue * WEIGHTS.priceValue +
    styleMatch * WEIGHTS.styleMatch;

  return {
    pairScore:      Math.round(weighted * 10) / 10,
    proximityScore: proximity,
    dateScore:      dateAlign,
    priceScore:     priceValue,
    styleScore:     styleMatch,
    distanceKm:     getDistanceKm(stay.lat, stay.lng, car.pickup_lat, car.pickup_lng),
  };
}

// ── Main Matching Function ────────────────────────────────

export function generatePairs(
  stays: EngineStay[],
  cars: EngineCar[],
  search: EngineSearch,
  limit = 20
): ScoredPair[] {
  const pairs: ScoredPair[] = [];

  for (const stay of stays) {
    for (const car of cars) {
      const scores = calculatePairScore(stay, car, search);
      if (scores.pairScore >= 5.0) {
        pairs.push({
          stay,
          car,
          ...scores,
          totalPrice:      stay.total_price + car.total_price,
          stayCommission:  Math.round(stay.total_price * 0.06),
          carCommission:   Math.round(car.total_price  * 0.06),
          totalCommission: Math.round((stay.total_price + car.total_price) * 0.06),
        });
      }
    }
  }

  pairs.sort((a, b) => b.pairScore - a.pairScore);
  return pairs.slice(0, limit);
}

export function getFallbackPairs(
  stays: EngineStay[],
  cars: EngineCar[],
  search: EngineSearch
): ScoredPair[] {
  const all: ScoredPair[] = [];
  for (const stay of stays) {
    for (const car of cars) {
      const scores = calculatePairScore(stay, car, search);
      all.push({
        stay, car, ...scores,
        totalPrice:      stay.total_price + car.total_price,
        stayCommission:  Math.round(stay.total_price * 0.06),
        carCommission:   Math.round(car.total_price  * 0.06),
        totalCommission: Math.round((stay.total_price + car.total_price) * 0.06),
      });
    }
  }
  all.sort((a, b) => b.pairScore - a.pairScore);
  return all.slice(0, 5);
}

// ── Score Label / Color helpers (UI) ─────────────────────

export function getEngineScoreLabel(score: number): string {
  if (score >= 9.5) return "Perfect Match";
  if (score >= 9.0) return "Exceptional";
  if (score >= 8.0) return "Excellent";
  if (score >= 7.0) return "Great Match";
  if (score >= 6.0) return "Good";
  if (score >= 5.0) return "Fair";
  return "Low";
}

export function getEngineScoreColor(score: number): string {
  if (score >= 9)   return "#2d6a4f";
  if (score >= 7.5) return "#52796f";
  if (score >= 6)   return "#7b5b3a";
  return "#9b2226";
}
