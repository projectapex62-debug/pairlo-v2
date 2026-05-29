import { useParams, useLocation } from "wouter";
import { allPairs } from "../lib/mock-data";
import { computePairScore, getScoreColor, getScoreLabel } from "../lib/pair-score";
import { PairScoreBadge } from "../components/pair-score-badge";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Copy, Check, Share2, Twitter, ArrowRight, Car, Home, Star,
  Wifi, Wind, Dumbbell, PawPrint, Smile, MapPin, Plane, Zap, Gift, Clock
} from "lucide-react";

// ─── Static per-pair data ────────────────────────────────────────────────────

type HotelInfo = {
  checkIn: string; checkOut: string; currency: string;
  smoking: string; pets: string; families: string;
  amenityChips: { label: string; icon: React.ReactNode }[];
  nearby: { name: string; miles: string }[];
  airports: { name: string; miles: string }[];
  driveMinutes: number;
  localIntel: string[];
  perks: string[];
  vibes: { label: string; color: string }[];
  scoreBreakdown: { label: string; value: number; color: string }[];
};

const hotelData: Record<string, HotelInfo> = {
  "pair-1": {
    checkIn: "4:00 PM", checkOut: "11:00 AM", currency: "US Dollar",
    smoking: "Non-smoking. Designated outdoor areas available.",
    pets: "Pets allowed. $150 non-refundable fee. Under 30 lbs.",
    families: "Family-friendly. Cribs on request.",
    amenityChips: [
      { label: "Free WiFi", icon: <Wifi size={12} /> },
      { label: "Non-smoking", icon: <Wind size={12} /> },
      { label: "Fitness center", icon: <Dumbbell size={12} /> },
      { label: "Pet-friendly", icon: <PawPrint size={12} /> },
      { label: "Concierge", icon: <Smile size={12} /> },
    ],
    nearby: [
      { name: "Malibu Pier", miles: "0.2 mi" },
      { name: "Nobu Malibu", miles: "0.4 mi" },
      { name: "Zuma Beach", miles: "1.1 mi" },
      { name: "Malibu Country Mart", miles: "1.5 mi" },
      { name: "Point Dume State Beach", miles: "3.0 mi" },
    ],
    airports: [
      { name: "Santa Monica Airport (SMO)", miles: "14 mi" },
      { name: "Los Angeles International (LAX)", miles: "26 mi" },
      { name: "Burbank Bob Hope Airport (BUR)", miles: "38 mi" },
    ],
    driveMinutes: 4,
    localIntel: [
      "Go to Nobu at sunset — grab a window seat, no reservation needed if you sit at the bar.",
      "PCH is best driven north between 9–11am before tourist traffic builds.",
      "The hidden Escondido Falls trailhead is 10 min from the villa — locals-only vibe.",
      "El Compadre in West Hollywood for late-night tacos on the way back from the city.",
    ],
    perks: [
      "Early check-in at 2 PM (standard is 4 PM)",
      "Complimentary beach gear: 2 kayaks + snorkel set",
      "Welcome bottle of Champagne on arrival",
      "Free airport transfer from LAX (one way)",
    ],
    vibes: [
      { label: "Romantic", color: "#e8b4b8" },
      { label: "Luxury", color: "#C8A96E" },
      { label: "Beach", color: "#7ec8c8" },
      { label: "Adventure", color: "#a8c5a0" },
    ],
    scoreBreakdown: [
      { label: "Location", value: 9.2, color: "#8A9E7B" },
      { label: "Amenities", value: 8.8, color: "#8A9E7B" },
      { label: "Value", value: 7.4, color: "#C8A96E" },
      { label: "Car Match", value: 9.5, color: "#8A9E7B" },
    ],
  },
  "pair-2": {
    checkIn: "3:00 PM", checkOut: "11:00 AM", currency: "US Dollar",
    smoking: "Non-smoking. Outdoor areas designated.",
    pets: "Pets allowed with deposit. Keep off furniture.",
    families: "Family-friendly. Kids ski rentals nearby.",
    amenityChips: [
      { label: "Free WiFi", icon: <Wifi size={12} /> },
      { label: "Ski-In/Out", icon: <Wind size={12} /> },
      { label: "Hot Tub", icon: <Dumbbell size={12} /> },
      { label: "Pet-friendly", icon: <PawPrint size={12} /> },
      { label: "Concierge", icon: <Smile size={12} /> },
    ],
    nearby: [
      { name: "Aspen Highlands Base", miles: "0.1 mi" },
      { name: "Ajax Mountain", miles: "0.8 mi" },
      { name: "Aspen Art Museum", miles: "1.2 mi" },
      { name: "The Little Nell", miles: "1.5 mi" },
      { name: "Snowmass Village", miles: "9 mi" },
    ],
    airports: [
      { name: "Aspen/Pitkin County Airport (ASE)", miles: "4 mi" },
      { name: "Eagle County Regional (EGE)", miles: "70 mi" },
      { name: "Denver International (DEN)", miles: "210 mi" },
    ],
    driveMinutes: 7,
    localIntel: [
      "Ski Highlands Bowl for powder — it's the most challenging terrain and least crowded.",
      "Meat & Cheese Farm Shop opens at 7am. Best breakfast sandwich in Aspen, no debate.",
      "Drive Maroon Bells road at sunrise — gate opens at 5am, before the crowds.",
      "Cache Cache on Monday nights — locals' dinner spot, cheaper prix-fixe menu.",
    ],
    perks: [
      "Lift tickets for 2 (1 day) included",
      "Complimentary ski valet at Highlands Base",
      "Hot cocoa & fireside welcome on arrival",
      "Late checkout at 1 PM (standard is 11 AM)",
    ],
    vibes: [
      { label: "Adventure", color: "#a8c5a0" },
      { label: "Winter", color: "#b8d4e8" },
      { label: "Romantic", color: "#e8b4b8" },
      { label: "Luxury", color: "#C8A96E" },
    ],
    scoreBreakdown: [
      { label: "Location", value: 9.5, color: "#8A9E7B" },
      { label: "Amenities", value: 9.0, color: "#8A9E7B" },
      { label: "Value", value: 7.8, color: "#C8A96E" },
      { label: "Car Match", value: 9.8, color: "#8A9E7B" },
    ],
  },
  "pair-3": {
    checkIn: "4:00 PM", checkOut: "12:00 PM", currency: "US Dollar",
    smoking: "No smoking on premises.",
    pets: "Pet-free property.",
    families: "Adults only.",
    amenityChips: [
      { label: "Free WiFi", icon: <Wifi size={12} /> },
      { label: "Rooftop Pool", icon: <Wind size={12} /> },
      { label: "Fitness center", icon: <Dumbbell size={12} /> },
      { label: "Valet Parking", icon: <PawPrint size={12} /> },
      { label: "Concierge", icon: <Smile size={12} /> },
    ],
    nearby: [
      { name: "Broadway Strip", miles: "0.2 mi" },
      { name: "Ryman Auditorium", miles: "0.4 mi" },
      { name: "Country Music Hall of Fame", miles: "0.6 mi" },
      { name: "Honky Tonk Highway", miles: "0.3 mi" },
      { name: "Centennial Park", miles: "1.8 mi" },
    ],
    airports: [
      { name: "Nashville International (BNA)", miles: "9 mi" },
    ],
    driveMinutes: 12,
    localIntel: [
      "Bluebird Café — tiny listening room, birthplace of 'Friends in Low Places'. Book 3 weeks out.",
      "Hattie B's Hot Chicken line moves fast after 2pm. Order the 'Shut the Cluck Up' level.",
      "East Nashville for the non-touristy version of the city — Cinco de Mayo is peak.",
      "The Gulch rooftop bars after 10pm: L.A. Jackson has the best skyline views.",
    ],
    perks: [
      "Complimentary Nashville bar crawl map from our concierge",
      "VIP wristbands to 3rd & Lindsley on Friday nights",
      "Welcome whiskey flight on arrival",
      "Free valet for the duration of your stay",
    ],
    vibes: [
      { label: "Nightlife", color: "#9b8ec4" },
      { label: "Music", color: "#C8A96E" },
      { label: "City", color: "#8ab4c8" },
      { label: "Work-friendly", color: "#8A9E7B" },
    ],
    scoreBreakdown: [
      { label: "Location", value: 9.4, color: "#8A9E7B" },
      { label: "Amenities", value: 8.2, color: "#8A9E7B" },
      { label: "Value", value: 8.6, color: "#8A9E7B" },
      { label: "Car Match", value: 8.9, color: "#8A9E7B" },
    ],
  },
};

const fallbackData: HotelInfo = {
  checkIn: "4:00 PM", checkOut: "11:00 AM", currency: "US Dollar",
  smoking: "Non-smoking property.",
  pets: "Contact host for pet policy.",
  families: "Family-friendly.",
  amenityChips: [
    { label: "Free WiFi", icon: <Wifi size={12} /> },
    { label: "Non-smoking", icon: <Wind size={12} /> },
    { label: "Fitness center", icon: <Dumbbell size={12} /> },
    { label: "Concierge", icon: <Smile size={12} /> },
  ],
  nearby: [
    { name: "City Center", miles: "0.5 mi" },
    { name: "Local Market", miles: "0.8 mi" },
    { name: "Beach / Park", miles: "1.0 mi" },
    { name: "Top Restaurant", miles: "1.2 mi" },
  ],
  airports: [
    { name: "Nearest Regional Airport", miles: "15 mi" },
    { name: "International Airport", miles: "45 mi" },
  ],
  driveMinutes: 8,
  localIntel: [
    "Ask the concierge for the locals-only restaurant list — it's not on Yelp.",
    "Best sunrise views are from the north side of the property.",
  ],
  perks: [
    "Early check-in when available",
    "Complimentary welcome drink on arrival",
  ],
  vibes: [
    { label: "Relaxing", color: "#a8c5a0" },
    { label: "Luxury", color: "#C8A96E" },
  ],
  scoreBreakdown: [
    { label: "Location", value: 8.5, color: "#8A9E7B" },
    { label: "Amenities", value: 8.0, color: "#8A9E7B" },
    { label: "Value", value: 8.0, color: "#C8A96E" },
    { label: "Car Match", value: 8.5, color: "#8A9E7B" },
  ],
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function TripPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const [nights, setNights] = useState(3);
  const [locationTab, setLocationTab] = useState<"nearby" | "airport">("nearby");

  const pairId = id?.replace(/-\d+n$/, "") || "";
  const nightsFromId = id?.match(/-(\d+)n$/)?.[1];
  useEffect(() => {
    if (nightsFromId) setNights(parseInt(nightsFromId));
  }, [nightsFromId]);

  const pair = allPairs.find(p => p.id === pairId) || allPairs.find(p => id?.startsWith(p.id));

  if (!pair) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", flexDirection: "column", gap: "16px" }}>
        <p style={{ color: "var(--color-gray-400)", fontSize: "14px" }}>Trip not found</p>
        <Link to="/search"><span style={{ color: "var(--color-mocha)", fontSize: "13px", cursor: "pointer" }}>Browse all pairs →</span></Link>
      </div>
    );
  }

  const score = computePairScore({
    stayPrice: pair.stay.price,
    carPrice: pair.car.price,
    separatePrice: pair.separatePrice,
    totalNights: nights,
    stayTags: pair.stay.tags,
    carType: pair.car.type,
    stayRating: pair.stay.rating,
    badge: pair.badge,
  });

  const details = hotelData[pair.id] ?? fallbackData;
  const pairTotal = (pair.stay.price + pair.car.price) * nights;
  const savings = pair.separatePrice - (pair.stay.price + pair.car.price) * (pair.totalNights || nights);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetText = `Just found the perfect trip on @Pairlo — ${pair.stay.name} + ${pair.car.name} for $${pairTotal}/trip. Pair Score: ${score.overall}/10 ✈️`;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: "9px 0", fontFamily: "var(--font-body)", fontSize: "11px",
    letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
    border: "none", cursor: "pointer", transition: "all 0.15s",
    background: active ? "var(--color-mocha)" : "transparent",
    color: active ? "white" : "var(--color-gray-400)",
    borderRadius: "3px",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-cream)" }}>

      {/* Header */}
      <div style={{ background: "var(--color-black)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/"><span style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "white", cursor: "pointer", letterSpacing: "-0.01em" }}>Pairlo</span></Link>
        <Link to="/search"><span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.5)", cursor: "pointer", letterSpacing: "0.08em" }}>FIND YOUR OWN PAIR →</span></Link>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", height: "340px", overflow: "hidden" }}>
        <img src={pair.stay.image} alt={pair.stay.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />
        <div style={{ position: "absolute", bottom: "28px", left: "32px", right: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            {pair.badge && (
              <span style={{ background: "var(--color-mocha)", color: "white", fontFamily: "var(--font-body)", fontSize: "10px", padding: "3px 10px", borderRadius: "2px", letterSpacing: "0.1em" }}>{pair.badge}</span>
            )}
            <PairScoreBadge stayPrice={pair.stay.price} carPrice={pair.car.price} separatePrice={pair.separatePrice} totalNights={nights} stayTags={pair.stay.tags} carType={pair.car.type} stayRating={pair.stay.rating} badge={pair.badge} size="sm" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,4vw,38px)", fontWeight: 400, color: "white", lineHeight: 1.1 }}>
            {pair.stay.name}<br />
            <span style={{ color: "var(--color-mocha-pale)", fontSize: "0.7em" }}>+ {pair.car.name}</span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }} className="trip-grid">

          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* 1. Vibe Match */}
            <div style={{ background: "white", borderRadius: "6px", border: "1px solid var(--color-gray-200)", padding: "20px 24px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-mocha)", fontWeight: 600, marginBottom: "14px" }}>Vibe Match</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {details.vibes.map(v => (
                  <span key={v.label} style={{ background: v.color + "28", color: v.color, border: `1px solid ${v.color}60`, fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, padding: "5px 14px", borderRadius: "20px", letterSpacing: "0.04em" }}>{v.label}</span>
                ))}
              </div>
            </div>

            {/* 2. Stay */}
            <div style={{ background: "white", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--color-gray-200)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-gray-100)", display: "flex", alignItems: "center", gap: "10px" }}>
                <Home size={16} color="var(--color-mocha)" />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-mocha)", fontWeight: 600 }}>The Stay</span>
              </div>
              <div style={{ display: "flex" }}>
                <img src={pair.stay.image} alt={pair.stay.name} style={{ width: "140px", height: "120px", objectFit: "cover", flexShrink: 0 }} />
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "4px" }}>{pair.stay.name}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", marginBottom: "10px" }}>{pair.stay.location}</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {pair.stay.tags.slice(0, 3).map(t => (
                      <span key={t} style={{ background: "var(--color-mocha-pale)", color: "var(--color-mocha)", fontFamily: "var(--font-body)", fontSize: "10px", padding: "2px 8px", borderRadius: "20px" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Star size={12} fill="var(--color-mocha)" color="var(--color-mocha)" />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600 }}>{pair.stay.rating}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>({pair.stay.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: "12px 24px", borderTop: "1px solid var(--color-gray-100)", background: "var(--color-cream)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)" }}>${pair.stay.price}/night × {nights} nights</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 700 }}>${pair.stay.price * nights}</span>
              </div>
            </div>

            {/* 3. Car */}
            <div style={{ background: "white", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--color-gray-200)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-gray-100)", display: "flex", alignItems: "center", gap: "10px" }}>
                <Car size={16} color="var(--color-mocha)" />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-mocha)", fontWeight: 600 }}>The Car</span>
              </div>
              <div style={{ display: "flex" }}>
                <img src={pair.car.image} alt={pair.car.name} style={{ width: "140px", height: "120px", objectFit: "cover", flexShrink: 0 }} />
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "4px" }}>{pair.car.name}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", marginBottom: "10px" }}>{pair.car.type} · {pair.car.engine}</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {pair.car.features.slice(0, 3).map(f => (
                      <span key={f} style={{ background: "var(--color-mocha-pale)", color: "var(--color-mocha)", fontFamily: "var(--font-body)", fontSize: "10px", padding: "2px 8px", borderRadius: "20px" }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: "12px 24px", borderTop: "1px solid var(--color-gray-100)", background: "var(--color-cream)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)" }}>${pair.car.price}/day × {nights} days</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 700 }}>${pair.car.price * nights}</span>
              </div>
            </div>

            {/* 4. Pair Score Breakdown */}
            <div style={{ background: "white", borderRadius: "6px", border: "1px solid var(--color-gray-200)", padding: "20px 24px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-mocha)", fontWeight: 600, marginBottom: "16px" }}>Score Breakdown</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {details.scoreBreakdown.map(s => (
                  <div key={s.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)" }}>{s.label}</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, color: s.color }}>{s.value}/10</span>
                    </div>
                    <div style={{ height: "4px", background: "var(--color-gray-100)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.value * 10}%`, background: s.color, borderRadius: "4px", transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Hotel amenity chips — condensed, no policy table */}
            <div style={{ background: "var(--color-cream)", borderRadius: "6px", padding: "14px 16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {details.amenityChips.map(a => (
                <span key={a.label} style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "20px", padding: "4px 12px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-500)" }}>
                  {a.icon}{a.label}
                </span>
              ))}
            </div>

            {/* 6. Drive Time */}
            <div style={{ background: "white", borderRadius: "6px", border: "1px solid var(--color-gray-200)", padding: "20px 24px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-mocha)", fontWeight: 600, marginBottom: "14px" }}>Drive Time</p>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1, background: "var(--color-mocha-pale)", borderRadius: "6px", padding: "16px 12px" }}>
                  <Home size={20} color="var(--color-mocha)" />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-400)", marginTop: "2px" }}>Your Stay</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: "30px", height: "2px", background: "var(--color-mocha)", borderRadius: "2px" }} />
                    <Clock size={14} color="var(--color-mocha)" />
                    <div style={{ width: "30px", height: "2px", background: "var(--color-mocha)", borderRadius: "2px" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 500 }}>{details.driveMinutes} min</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-400)" }}>drive</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1, background: "var(--color-mocha-pale)", borderRadius: "6px", padding: "16px 12px" }}>
                  <Car size={20} color="var(--color-mocha)" />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-400)", marginTop: "2px" }}>Car Pickup</span>
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)", marginTop: "12px", textAlign: "center" }}>Car rental delivered to hotel on arrival day</p>
            </div>

            {/* 7. Location & Transportation */}
            <div style={{ background: "white", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--color-gray-200)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-gray-100)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-mocha)", fontWeight: 600 }}>Location & Transportation</p>
              </div>
              {/* Tabs */}
              <div style={{ padding: "10px 16px", background: "var(--color-cream)", display: "flex", gap: "4px" }}>
                <button style={tabStyle(locationTab === "nearby")} onClick={() => setLocationTab("nearby")}>
                  What's nearby
                </button>
                <button style={tabStyle(locationTab === "airport")} onClick={() => setLocationTab("airport")}>
                  Airport info
                </button>
              </div>
              {/* Tab content */}
              <div style={{ padding: "8px 0" }}>
                {(locationTab === "nearby" ? details.nearby : details.airports).map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 24px", borderBottom: "1px solid var(--color-gray-100)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {locationTab === "nearby" ? <MapPin size={13} color="var(--color-mocha)" /> : <Plane size={13} color="var(--color-mocha)" />}
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "13px" }}>{item.name}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)" }}>{item.miles}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Local Intel */}
            <div style={{ background: "var(--color-black)", borderRadius: "6px", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-mocha-light)", fontWeight: 600 }}>Local Intel</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "3px" }}>Curated tips — not on TripAdvisor</p>
              </div>
              {details.localIntel.slice(0, 2).map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", padding: "16px 24px", borderBottom: i < Math.min(details.localIntel.length, 2) - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--color-mocha)", lineHeight: 1, marginTop: "1px", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{tip}</span>
                </div>
              ))}
            </div>

            {/* 9. Pairlo Perks */}
            <div style={{ background: "white", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--color-gray-200)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-gray-100)", display: "flex", alignItems: "center", gap: "10px" }}>
                <Gift size={15} color="var(--color-mocha)" />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-mocha)", fontWeight: 600 }}>Pairlo Perks</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", background: "var(--color-mocha)", color: "white", padding: "2px 8px", borderRadius: "20px", letterSpacing: "0.06em" }}>EXCLUSIVE</span>
              </div>
              {details.perks.map((perk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 24px", borderBottom: i < details.perks.length - 1 ? "1px solid var(--color-gray-100)" : "none" }}>
                  <Zap size={13} fill="var(--color-mocha)" color="var(--color-mocha)" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px" }}>{perk}</span>
                </div>
              ))}
            </div>


          </div>

          {/* ── Right column (sticky) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "24px" }}>

            {/* Price summary */}
            <div style={{ background: "white", borderRadius: "6px", border: "1px solid var(--color-gray-200)", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-gray-100)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-gray-400)", marginBottom: "6px" }}>Total for {nights} nights</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 500 }}>${pairTotal.toLocaleString()}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", textDecoration: "line-through", marginTop: "2px" }}>${pair.separatePrice} if booked separately</p>
                {savings > 0 && (
                  <div style={{ marginTop: "8px", background: "#e8f5e9", borderRadius: "4px", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "#2d6a4f" }}>You save ${savings}</span>
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-gray-100)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-gray-400)", marginBottom: "8px" }}>Nights</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button onClick={() => setNights(n => Math.max(1, n - 1))} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--color-gray-200)", background: "white", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", minWidth: "24px", textAlign: "center" }}>{nights}</span>
                  <button onClick={() => setNights(n => Math.min(30, n + 1))} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--color-gray-200)", background: "white", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <button
                  onClick={() => navigate(`/checkout?pair=${pair.id}&nights=${nights}&days=${nights}`)}
                  style={{ width: "100%", background: "var(--color-mocha)", color: "white", border: "none", padding: "15px", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  BOOK THIS PAIR <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Pair Score */}
            <div style={{ background: "white", borderRadius: "6px", border: "1px solid var(--color-gray-200)", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <PairScoreBadge stayPrice={pair.stay.price} carPrice={pair.car.price} separatePrice={pair.separatePrice} totalNights={nights} stayTags={pair.stay.tags} carType={pair.car.type} stayRating={pair.stay.rating} badge={pair.badge} size="lg" />
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "18px" }}>{getScoreLabel(score.overall)}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", marginTop: "3px" }}>Pairlo match score</p>
                </div>
              </div>
            </div>

            {/* Share */}
            <div style={{ background: "white", borderRadius: "6px", border: "1px solid var(--color-gray-200)", padding: "20px 24px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-gray-400)", marginBottom: "12px" }}>Share This Trip</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleCopy} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: copied ? "#e8f5e9" : "var(--color-cream)", border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "10px", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "12px", color: copied ? "#2d6a4f" : "var(--color-black)", transition: "all 0.2s" }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#000", border: "1px solid #000", borderRadius: "4px", padding: "10px 14px", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "12px", color: "white", textDecoration: "none" }}>
                  <Twitter size={14} /> Share
                </a>
                <button onClick={() => { if (navigator.share) navigator.share({ title: `${pair.stay.name} + ${pair.car.name}`, url: shareUrl }); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-mocha)", border: "none", borderRadius: "4px", padding: "10px 14px", cursor: "pointer", color: "white" }}>
                  <Share2 size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .trip-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
