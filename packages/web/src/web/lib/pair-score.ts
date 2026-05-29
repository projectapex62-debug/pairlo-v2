// Pair Score Algorithm — Pairlo's proprietary matching score
// Scores a hotel+car pair on 4 dimensions, returns 1–10

export interface PairScoreBreakdown {
  overall: number;          // 1–10
  priceMatch: number;       // 1–10: car price relative to stay price (balance)
  locationSync: number;     // 1–10: proximity-based (inferred from tags/type)
  styleHarmony: number;     // 1–10: stay vibe vs car category
  value: number;            // 1–10: combined savings vs separate booking
}

interface ScoringInput {
  stayPrice: number;         // per night
  carPrice: number;          // per day
  separatePrice: number;     // what it'd cost booked separately
  totalNights: number;
  stayTags: string[];
  carType: string;
  stayRating: number;
  badge?: string;
}

export function computePairScore(input: ScoringInput): PairScoreBreakdown {
  const { stayPrice, carPrice, separatePrice, totalNights, stayTags, carType, stayRating, badge } = input;

  // ── Price Match ──
  // Ideal ratio: car should be 25–45% of stay price
  const ratio = carPrice / stayPrice;
  const idealRatio = 0.35;
  const ratioDistance = Math.abs(ratio - idealRatio);
  const priceMatch = Math.max(1, Math.min(10, 10 - ratioDistance * 15));

  // ── Location Sync ──
  // Inferred from car type and stay tags
  const adventureTags = ["mountain", "canyon", "national park", "offroad", "outdoor", "ski", "trail"];
  const urbanTags = ["downtown", "city", "skyline", "tribeca", "manhattan", "district", "rooftop"];
  const beachTags = ["beach", "ocean", "coastal", "surf", "waterfront", "island", "bay"];
  const luxuryTags = ["infinity pool", "private pool", "penthouse", "villa", "estate", "spa"];

  const tagStr = stayTags.join(" ").toLowerCase();
  const isAdventure = adventureTags.some(t => tagStr.includes(t));
  const isUrban = urbanTags.some(t => tagStr.includes(t));
  const isBeach = beachTags.some(t => tagStr.includes(t));

  const carTypeLower = carType.toLowerCase();
  const isSUV = carTypeLower.includes("suv") || carTypeLower.includes("4x4");
  const isSedan = carTypeLower.includes("sedan") || carTypeLower.includes("executive") || carTypeLower.includes("luxury");
  const isSports = carTypeLower.includes("sport") || carTypeLower.includes("convert");
  const isElectric = carTypeLower.includes("electric") || carTypeLower.includes("tesla");

  let locationSync = 7;
  if (isAdventure && isSUV) locationSync = 10;
  if (isBeach && isSports) locationSync = 9.5;
  if (isUrban && isSedan) locationSync = 9;
  if (isUrban && isElectric) locationSync = 9.5;
  if (isAdventure && isSports) locationSync = 6;
  if (isBeach && isSedan) locationSync = 7;
  locationSync = Math.min(10, locationSync);

  // ── Style Harmony ──
  // Stay rating + luxury tags + car prestige
  const luxuryCarBrands = ["bmw", "mercedes", "porsche", "range rover", "land rover", "tesla", "ferrari", "bentley"];
  const isLuxuryCar = luxuryCarBrands.some(b => carTypeLower.includes(b) || input.carType.toLowerCase().includes(b));
  const isLuxuryStay = luxuryTags.some(t => tagStr.includes(t)) || stayPrice > 300;

  let styleHarmony = 6;
  if (isLuxuryCar && isLuxuryStay) styleHarmony = 9.5;
  if (!isLuxuryCar && !isLuxuryStay) styleHarmony = 8.5;
  if (isLuxuryCar && !isLuxuryStay) styleHarmony = 5;
  if (!isLuxuryCar && isLuxuryStay) styleHarmony = 5.5;
  // Rating bonus
  styleHarmony = Math.min(10, styleHarmony + (stayRating - 4.5) * 1.5);

  // ── Value ──
  // How much savings vs separate booking
  const pairPrice = (stayPrice + carPrice) * totalNights;
  const savings = separatePrice - pairPrice;
  const savingsPct = savings / separatePrice;
  const value = Math.max(1, Math.min(10, 5 + savingsPct * 30));

  // ── Badge bonus ──
  let overallBonus = 0;
  if (badge === "Top Pick") overallBonus = 0.3;
  if (badge === "Trending") overallBonus = 0.2;

  const overall = Math.min(10, Math.max(1,
    (priceMatch * 0.25 + locationSync * 0.30 + styleHarmony * 0.30 + value * 0.15) + overallBonus
  ));

  return {
    overall: Math.round(overall * 10) / 10,
    priceMatch: Math.round(priceMatch * 10) / 10,
    locationSync: Math.round(locationSync * 10) / 10,
    styleHarmony: Math.round(styleHarmony * 10) / 10,
    value: Math.round(value * 10) / 10,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 9) return "#2d6a4f";   // deep green
  if (score >= 7.5) return "#52796f"; // muted green
  if (score >= 6) return "#7b5b3a";   // mocha amber
  return "#9b2226";                   // red
}

export function getScoreLabel(score: number): string {
  if (score >= 9.5) return "Perfect Match";
  if (score >= 9) return "Exceptional";
  if (score >= 8) return "Excellent";
  if (score >= 7) return "Great Match";
  if (score >= 6) return "Good";
  return "Fair";
}
