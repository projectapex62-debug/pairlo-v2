import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  SlidersHorizontal, MapPin, X, LayoutGrid, Map, SearchX,
  Star, Car, TrendingUp, Zap, Filter, ChevronDown, ChevronUp,
} from "lucide-react";
import { allPairs, mapPins } from "../lib/mock-data";
import { PairCard } from "../components/pair-card";
import { CompareDrawer } from "../components/compare-drawer";
import { getScoredAndSortedPairs } from "../../api/engine/mock-adapter";

// Pre-score all pairs once using the matching engine (mock dates — representative trip)
const MOCK_SEARCH = { check_in: "2026-10-15", check_out: "2026-10-20" };
const scoredPairs = getScoredAndSortedPairs(allPairs, MOCK_SEARCH);

type ApiPair = typeof scoredPairs[number];

// Helper: inject engineBreakdown into PairCard's engineScore prop
function ScoredPairCard({ pair }: { pair: typeof scoredPairs[number] }) {
  return (
    <PairCard
      pair={{
        ...pair,
        engineScore: pair.engineBreakdown ?? undefined,
      }}
    />
  );
}

const DESTINATIONS = ["All", "Miami", "Aspen", "New York", "Los Angeles", "Nashville"];
const SORT_OPTIONS = ["Recommended", "Price: Low to High", "Price: High to Low", "Top Rated"];
const CAR_TYPE_PILLS = [
  { label: "Any", icon: "🚗", value: "Any car" },
  { label: "Sedan", icon: "🚘", value: "Sedan" },
  { label: "SUV", icon: "🚙", value: "SUV" },
  { label: "Sports", icon: "🏎", value: "Convertible" },
  { label: "Electric", icon: "⚡", value: "EV" },
  { label: "Luxury", icon: "💼", value: "Luxury" },
];

const VIBE_FILTERS = [
  { label: "Beach", icon: "🏖️" },
  { label: "Mountain", icon: "⛰️" },
  { label: "City", icon: "🏙️" },
  { label: "Romantic", icon: "🌹" },
  { label: "Adventure", icon: "🧗" },
  { label: "Family", icon: "👨‍👩‍👧" },
];

// ── SKELETON CARD ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: "6px",
      overflow: "hidden",
      background: "white",
      border: "1px solid var(--color-gray-200)",
      height: "380px",
    }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite linear;
        }
      `}</style>
      <div className="shimmer" style={{ height: "220px", width: "100%" }} />
      <div style={{ padding: "18px" }}>
        <div className="shimmer" style={{ height: "14px", borderRadius: "2px", width: "65%", marginBottom: "10px" }} />
        <div className="shimmer" style={{ height: "11px", borderRadius: "2px", width: "40%", marginBottom: "20px" }} />
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          <div className="shimmer" style={{ height: "10px", borderRadius: "2px", width: "80px" }} />
          <div className="shimmer" style={{ height: "10px", borderRadius: "2px", width: "60px" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="shimmer" style={{ height: "10px", borderRadius: "2px", width: "70px", marginBottom: "6px" }} />
            <div className="shimmer" style={{ height: "22px", borderRadius: "2px", width: "100px" }} />
          </div>
          <div className="shimmer" style={{ height: "34px", borderRadius: "2px", width: "90px" }} />
        </div>
      </div>
    </div>
  );
}

// ── MAP VIEW ──────────────────────────────────────────────────────────────
function MapView({ pairs, onPinClick, activePinId }: {
  pairs: typeof allPairs;
  onPinClick: (id: string) => void;
  activePinId: string | null;
}) {
  return (
    <div style={{ position: "relative", width: "100%", height: "560px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--color-gray-200)" }}>
      <div style={{
        width: "100%", height: "100%",
        background: "linear-gradient(135deg, #e8f0e4 0%, #d4e6cf 25%, #e8f0e4 50%, #cde0d8 75%, #e0ead6 100%)",
        position: "relative",
      }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }} xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="30%" x2="100%" y2="28%" stroke="#b8ccb0" strokeWidth="6" />
          <line x1="0" y1="60%" x2="100%" y2="62%" stroke="#b8ccb0" strokeWidth="4" />
          <line x1="22%" y1="0" x2="20%" y2="100%" stroke="#b8ccb0" strokeWidth="5" />
          <line x1="55%" y1="0" x2="57%" y2="100%" stroke="#b8ccb0" strokeWidth="4" />
          <line x1="80%" y1="0" x2="79%" y2="100%" stroke="#b8ccb0" strokeWidth="3" />
          <line x1="0" y1="45%" x2="100%" y2="48%" stroke="#c8d8c0" strokeWidth="2" />
          <line x1="38%" y1="0" x2="40%" y2="100%" stroke="#c8d8c0" strokeWidth="2" />
          <ellipse cx="85%" cy="75%" rx="12%" ry="9%" fill="#a8c8d8" opacity="0.5" />
          <ellipse cx="10%" cy="80%" rx="8%" ry="5%" fill="#a8c8d8" opacity="0.4" />
        </svg>
        <div style={{
          position: "absolute", top: "12px", left: "12px",
          background: "rgba(255,255,255,0.85)", borderRadius: "2px",
          padding: "6px 10px",
          fontFamily: "var(--font-body)", fontSize: "11px",
          color: "var(--color-gray-500)", letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          Preview Map — {pairs.length} pairs
        </div>
        {mapPins.filter(pin => pairs.some(p => p.id === pin.id)).map((pin) => {
          const isActive = activePinId === pin.id;
          return (
            <button
              key={pin.id}
              onClick={() => onPinClick(pin.id)}
              style={{
                position: "absolute",
                left: `${pin.left}%`,
                top: `${pin.top}%`,
                background: isActive ? "var(--color-mocha)" : "var(--color-black)",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "5px 10px",
                fontSize: "12px",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: isActive ? "0 4px 16px rgba(138,158,123,0.5)" : "0 2px 8px rgba(0,0,0,0.3)",
                transform: `translate(-50%, -100%) scale(${isActive ? 1.15 : 1})`,
                transition: "all 0.2s",
                zIndex: isActive ? 10 : 1,
                whiteSpace: "nowrap",
              }}
            >
              ${pin.price.toLocaleString()}
              <span style={{
                position: "absolute", bottom: "-6px", left: "50%",
                transform: "translateX(-50%)",
                width: 0, height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `6px solid ${isActive ? "var(--color-mocha)" : "var(--color-black)"}`,
              }} />
            </button>
          );
        })}
        {activePinId && (() => {
          const pair = pairs.find(p => p.id === activePinId);
          const pin = mapPins.find(p => p.id === activePinId);
          if (!pair || !pin) return null;
          return (
            <div style={{
              position: "absolute",
              left: `${Math.min(Math.max(pin.left, 20), 75)}%`,
              top: `${Math.min(pin.top + 5, 80)}%`,
              background: "white", borderRadius: "4px", padding: "12px 14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)", zIndex: 20,
              minWidth: "180px", border: "1px solid var(--color-gray-200)",
            }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "var(--color-black)", marginBottom: "2px" }}>
                {pair.stay.name}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-500)" }}>
                From ${pin.price.toLocaleString()} total
              </p>
              <button onClick={() => onPinClick("")} style={{
                position: "absolute", top: "6px", right: "6px",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--color-gray-400)", fontSize: "14px", lineHeight: 1,
              }}>×</button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ── POPULAR DESTINATIONS ──────────────────────────────────────────────────
function PopularDestinations({ onSelect }: { onSelect: (d: string) => void }) {
  const dests = [
    { name: "Miami", img: "/stay-miami.jpg", pairs: 3, tag: "Sun & Surf" },
    { name: "Aspen", img: "/stay-villa3.jpg", pairs: 2, tag: "Mountain" },
    { name: "New York", img: "/stay-manhattan.jpg", pairs: 2, tag: "City Life" },
    { name: "Los Angeles", img: "/stay-villa6.jpg", pairs: 3, tag: "West Coast" },
    { name: "Nashville", img: "/stay-nashville.jpg", pairs: 2, tag: "Music City" },
  ];
  return (
    <div style={{ marginBottom: "48px" }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-gray-400)", marginBottom: "16px" }}>
        Popular Destinations
      </p>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "4px" }}>
        {dests.map((d) => (
          <button
            key={d.name}
            onClick={() => onSelect(d.name)}
            style={{
              flexShrink: 0, position: "relative", borderRadius: "6px", overflow: "hidden",
              width: "140px", height: "90px", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%)" }} />
            <div style={{ position: "absolute", bottom: "8px", left: "10px", right: "10px", textAlign: "left" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, color: "white", lineHeight: 1 }}>{d.name}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.65)", marginTop: "2px" }}>{d.tag}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── RECENTLY VIEWED ───────────────────────────────────────────────────────
function RecentlyViewed({ onSelect }: { onSelect: (pair: typeof allPairs[0]) => void }) {
  // Show last 3 pairs as "recently viewed"
  const recents = scoredPairs.slice(3, 6);
  return (
    <div style={{ marginBottom: "48px" }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-gray-400)", marginBottom: "16px" }}>
        Trending This Week
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "12px" }}>
        {recents.map((pair) => {
          const total = pair.stay.price * pair.totalNights + pair.car.price * pair.totalDays;
          return (
            <button
              key={pair.id}
              onClick={() => onSelect(pair)}
              style={{
                background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "6px",
                display: "flex", gap: "0", overflow: "hidden", cursor: "pointer", textAlign: "left",
                transition: "box-shadow 0.2s", padding: 0,
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}
            >
              <img src={pair.stay.image} alt={pair.stay.name} style={{ width: "90px", height: "72px", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {pair.stay.name}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)", marginTop: "2px" }}>
                  + {pair.car.name}
                </p>
              </div>
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--color-black)" }}>${total.toLocaleString()}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "2px" }}>
                  <Star size={10} fill="var(--color-mocha)" color="var(--color-mocha)" />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-400)" }}>{pair.stay.rating}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── STAT BAR ──────────────────────────────────────────────────────────────
function StatBar() {
  const stats = [
    { icon: <TrendingUp size={14} color="var(--color-mocha)" />, label: "18 pairs booked today" },
    { icon: <Star size={14} color="#f59e0b" fill="#f59e0b" />, label: "4.9 avg rating" },
    { icon: <Zap size={14} color="#3b82f6" />, label: "All pairs time-matched" },
    { icon: <Car size={14} color="var(--color-mocha)" />, label: "Unlimited mileage cars" },
  ];
  return (
    <div style={{ background: "white", borderBottom: "1px solid var(--color-gray-100)", padding: "10px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "32px", overflowX: "auto" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px", flexShrink: 0 }}>
            {s.icon}
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-600)", whiteSpace: "nowrap" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [, navigate] = useLocation();
  const [destination, setDestination] = useState("All");
  const [maxPrice, setMaxPrice] = useState(800);
  const [carType, setCarType] = useState("Any car");
  const [sortBy, setSortBy] = useState("Recommended");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [activePinId, setActivePinId] = useState<string | null>(null);

  const [vibeFilter, setVibeFilter] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [apiPairs, setApiPairs] = useState<ApiPair[] | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      // Also set destination tab if it matches
      const match = DESTINATIONS.find(d => d !== "All" && q.toLowerCase().includes(d.toLowerCase()));
      if (match) setDestination(match);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dest    = params.get("destination") ?? params.get("q");
    const checkIn  = params.get("checkIn");
    const checkOut = params.get("checkOut");
    const guests   = params.get("guests") ?? "2";
    if (!dest || !checkIn || !checkOut) return;

    setApiLoading(true);
    fetch(`/api/search?destination=${encodeURIComponent(dest)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${guests}`)
      .then(r => r.json())
      .then((data: { pairs?: ApiPair[] }) => {
        if (Array.isArray(data.pairs) && data.pairs.length > 0) {
          setApiPairs(data.pairs);
        }
      })
      .catch(() => { /* fall back to mock data */ })
      .finally(() => setApiLoading(false));
  }, []);

  const basePairs = apiPairs ?? scoredPairs;
  const filtered = basePairs
    .filter((p) => {
      const loc = p.stay?.location ?? "";
      const name = p.stay?.name ?? "";
      const stayPrice = p.stay?.price ?? 0;
      if (destination !== "All" && !loc.toLowerCase().includes(destination.toLowerCase())) return false;
      if (query && !name.toLowerCase().includes(query.toLowerCase()) &&
          !loc.toLowerCase().includes(query.toLowerCase()) &&
          !(p.car?.name ?? "").toLowerCase().includes(query.toLowerCase())) return false;
      if (maxPrice < 800 && stayPrice > maxPrice) return false;
      if (carType !== "Any car" && !(p.car?.type ?? "").includes(carType) && !(p.car?.name ?? "").includes(carType)) return false;
      if (minRating > 0 && p.stay.rating < minRating) return false;
      if (vibeFilter) {
        const tags = (p.stay.tags ?? []).join(" ").toLowerCase();
        const loc = (p.stay.location ?? "").toLowerCase();
        const vibe = vibeFilter.toLowerCase();
        const vibeMap: Record<string, string[]> = {
          beach: ["beach", "ocean", "coastal", "surf", "malibu", "miami", "hawaii"],
          mountain: ["mountain", "ski", "aspen", "alpine", "altitude", "sedona"],
          city: ["city", "urban", "manhattan", "new york", "chicago", "skyline"],
          romantic: ["romantic", "villa", "wine", "private", "butler", "suite"],
          adventure: ["adventure", "trail", "outdoor", "jeep", "canyon", "convertible"],
          family: ["family", "kids", "beds", "pool", "spacious"],
        };
        const keywords = vibeMap[vibe] ?? [vibe];
        const match = keywords.some(k => tags.includes(k) || loc.includes(k));
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return (a.stay?.price ?? 0) - (b.stay?.price ?? 0);
      if (sortBy === "Price: High to Low") return (b.stay?.price ?? 0) - (a.stay?.price ?? 0);
      if (sortBy === "Top Rated") return (b.stay?.rating ?? 0) - (a.stay?.rating ?? 0);
      // "Recommended" = matching engine score descending (already pre-sorted, but re-sort to be safe)
      return (b.engineScore ?? 0) - (a.engineScore ?? 0);
    });

  const activeFilterCount = [
    destination !== "All",
    maxPrice < 800,
    carType !== "Any car",
    minRating > 0,
    !!vibeFilter,
  ].filter(Boolean).length;

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em",
    textTransform: "uppercase" as const, color: "var(--color-gray-500)", marginBottom: "8px", display: "block",
  };
  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", border: "1px solid var(--color-gray-200)", borderRadius: "2px",
    fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-black)", background: "white",
    appearance: "none" as const, cursor: "pointer", outline: "none",
  };
  const viewBtnStyle = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px",
    border: `1px solid ${active ? "var(--color-mocha)" : "var(--color-gray-200)"}`,
    borderRadius: "2px",
    background: active ? "var(--color-mocha)" : "white",
    color: active ? "white" : "var(--color-gray-500)",
    fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: active ? 600 : 400,
    cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.05em",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-cream)", paddingTop: "72px" }}>

      {/* ── SEARCH HEADER ── */}
      <div style={{ background: "var(--color-black)", padding: "40px 24px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "white", marginBottom: "24px" }}>
            Find your perfect <em style={{ fontStyle: "italic", color: "var(--color-mocha-pale)" }}>pair</em>
          </h1>

          {/* Search bar */}
          <div style={{
            display: "flex", gap: "0", background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: "2px", overflow: "hidden"
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px" }}>
              <MapPin size={16} color="var(--color-mocha-light)" />
              <input
                type="text"
                placeholder="Search destination, hotel, or car…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-body)", fontSize: "14px", color: "white", width: "100%" }}
              />
              {query && <X size={14} color="rgba(255,255,255,0.4)" style={{ cursor: "pointer" }} onClick={() => setQuery("")} />}
            </div>
            <button
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 20px", cursor: "pointer", background: "transparent", border: "none", borderLeft: "1px solid rgba(255,255,255,0.12)" }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} color="var(--color-mocha-light)" />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </span>
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div style={{ marginTop: "16px", marginBottom: "0", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ ...labelStyle, color: "rgba(255,255,255,0.45)" }}>Destination</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)}
                    style={{ ...selectStyle, background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(255,255,255,0.14)" }}>
                    {DESTINATIONS.map(o => <option key={o} value={o} style={{ background: "#1a1a1a" }}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle, color: "rgba(255,255,255,0.45)" }}>Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    style={{ ...selectStyle, background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(255,255,255,0.14)" }}>
                    {SORT_OPTIONS.map(o => <option key={o} value={o} style={{ background: "#1a1a1a" }}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle, color: "rgba(255,255,255,0.45)" }}>
                    Min Rating
                    <span style={{ float: "right", color: "var(--color-mocha-light)" }}>{minRating === 0 ? "Any" : `${minRating}★+`}</span>
                  </label>
                  <input type="range" min={0} max={5} step={0.5} value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--color-mocha)", cursor: "pointer", marginTop: "8px" }}
                  />
                </div>
              </div>

              {/* Price slider */}
              <div>
                <label style={{ ...labelStyle, color: "rgba(255,255,255,0.45)" }}>
                  Max stay price per night
                  <span style={{ float: "right", color: "var(--color-mocha-light)", fontWeight: 600 }}>
                    {maxPrice >= 800 ? "Any" : `$${maxPrice}/night`}
                  </span>
                </label>
                <input type="range" min={100} max={800} step={50} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--color-mocha)", cursor: "pointer", height: "4px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>$100</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>$800+</span>
                </div>
              </div>

              {/* Car type pills */}
              <div>
                <label style={{ ...labelStyle, color: "rgba(255,255,255,0.45)" }}>Car Type</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CAR_TYPE_PILLS.map((pill) => {
                    const active = carType === pill.value;
                    return (
                      <button key={pill.value} onClick={() => setCarType(pill.value)} style={{
                        display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px",
                        border: `1px solid ${active ? "var(--color-mocha)" : "rgba(255,255,255,0.18)"}`,
                        borderRadius: "100px",
                        background: active ? "var(--color-mocha)" : "rgba(255,255,255,0.07)",
                        color: active ? "white" : "rgba(255,255,255,0.72)",
                        fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: active ? 600 : 400,
                        cursor: "pointer", transition: "all 0.18s",
                      }}>
                        <span style={{ fontSize: "15px", lineHeight: 1 }}>{pill.icon}</span>
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setQuery(""); setDestination("All"); setCarType("Any car"); setMaxPrice(800); setSortBy("Recommended"); setMinRating(0); setVibeFilter(null); }}
                  style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "4px", color: "#fca5a5", fontFamily: "var(--font-body)", fontSize: "12px", cursor: "pointer" }}
                >
                  <X size={12} /> Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
                </button>
              )}
            </div>
          )}

          {/* ── DESTINATION TABS ── */}
          <div style={{ marginTop: "24px", display: "flex", gap: "0", overflowX: "auto" }}>
            {DESTINATIONS.map((d) => (
              <button key={d} onClick={() => setDestination(d)} style={{
                padding: "14px 20px", border: "none",
                borderBottom: destination === d ? "2px solid var(--color-mocha)" : "2px solid transparent",
                background: "transparent",
                fontFamily: "var(--font-body)", fontSize: "13px",
                fontWeight: destination === d ? 600 : 400,
                color: destination === d ? "var(--color-mocha-pale)" : "rgba(255,255,255,0.5)",
                cursor: "pointer", whiteSpace: "nowrap" as const, transition: "all 0.2s",
              }}>
                {d}
              </button>
            ))}
          </div>

          {/* ── VIBE FILTER PILLS ── */}
          <div style={{ paddingBottom: "16px", display: "flex", alignItems: "center", gap: "8px", overflowX: "auto" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", flexShrink: 0, marginRight: "4px" }}>Vibe</span>
            {VIBE_FILTERS.map((v) => {
              const active = vibeFilter === v.label;
              return (
                <button key={v.label} onClick={() => setVibeFilter(active ? null : v.label)} style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "6px 14px", border: `1px solid ${active ? "var(--color-mocha)" : "rgba(255,255,255,0.18)"}`,
                  borderRadius: "100px", flexShrink: 0,
                  background: active ? "var(--color-mocha)" : "rgba(255,255,255,0.06)",
                  color: active ? "white" : "rgba(255,255,255,0.65)",
                  fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: active ? 600 : 400,
                  cursor: "pointer", transition: "all 0.18s", letterSpacing: "0.02em",
                }}>
                  <span>{v.icon}</span> {v.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── STAT BAR ── */}
      <StatBar />

      {/* ── RESULTS AREA ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Popular destinations (only when showing all, no query) */}
        {!loading && destination === "All" && !query && (
          <PopularDestinations onSelect={(d) => setDestination(d)} />
        )}

        {/* Trending pairs (only when showing all, no query) */}
        {!loading && destination === "All" && !query && (
          <RecentlyViewed onSelect={() => {}} />
        )}

        {/* Results bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)" }}>
              {loading ? (
                <span style={{ color: "var(--color-gray-400)" }}>Finding pairs…</span>
              ) : (
                <>
                  <span style={{ fontWeight: 600, color: "var(--color-black)" }}>{filtered.length}</span> pairs found
                  {destination !== "All" && <> in <strong>{destination}</strong></>}
                </>
              )}
            </p>
            {/* Active filter chips */}
            {activeFilterCount > 0 && !loading && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                {destination !== "All" && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "var(--color-mocha-pale)", color: "var(--color-mocha)", fontFamily: "var(--font-body)", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", cursor: "pointer" }}
                    onClick={() => setDestination("All")}>
                    {destination} <X size={10} />
                  </span>
                )}
                {carType !== "Any car" && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "var(--color-mocha-pale)", color: "var(--color-mocha)", fontFamily: "var(--font-body)", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", cursor: "pointer" }}
                    onClick={() => setCarType("Any car")}>
                    {carType} <X size={10} />
                  </span>
                )}
                {maxPrice < 800 && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "var(--color-mocha-pale)", color: "var(--color-mocha)", fontFamily: "var(--font-body)", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", cursor: "pointer" }}
                    onClick={() => setMaxPrice(800)}>
                    Under ${maxPrice}/n <X size={10} />
                  </span>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* View toggle */}
            <div style={{ display: "flex", gap: "4px" }}>
              <button style={viewBtnStyle(viewMode === "grid")} onClick={() => setViewMode("grid")}>
                <LayoutGrid size={13} /> Grid
              </button>
              <button style={viewBtnStyle(viewMode === "map")} onClick={() => setViewMode("map")}>
                <Map size={13} /> Map
              </button>
            </div>

            {/* Sort */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ ...selectStyle, width: "auto", padding: "8px 12px", fontSize: "13px" }}>
              {SORT_OPTIONS.map(o => <option key={o} value={o}>Sort: {o}</option>)}
            </select>
          </div>
        </div>

        {/* ── CONTENT ── */}
        {(loading || apiLoading) ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : viewMode === "map" ? (
          <div>
            <MapView pairs={filtered} onPinClick={(id) => setActivePinId(id === activePinId ? null : id)} activePinId={activePinId} />
            {activePinId && (
              <div style={{ marginTop: "28px" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", marginBottom: "16px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Selected Pair
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px", maxWidth: "680px" }}>
                  {filtered.filter(p => p.id === activePinId).map(pair => <ScoredPairCard key={pair.id} pair={pair} />)}
                </div>
              </div>
            )}
            <div style={{ marginTop: "36px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", marginBottom: "16px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                All {filtered.length} Pairs
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {filtered.map((pair) => (
                  <div key={pair.id} onClick={() => setActivePinId(pair.id === activePinId ? null : pair.id)}
                    style={{ cursor: "pointer", outline: pair.id === activePinId ? "2px solid var(--color-mocha)" : "2px solid transparent", borderRadius: "6px", transition: "outline 0.2s" }}>
                    <ScoredPairCard pair={pair} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div>
            {/* Empty state */}
            <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: "6px", border: "1px solid var(--color-gray-200)" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--color-gray-100)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <SearchX size={36} color="var(--color-gray-300)" />
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--color-gray-400)", marginBottom: "12px" }}>No pairs found</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-400)", marginBottom: "28px" }}>
                Try adjusting filters or a different destination
              </p>
              <button
                onClick={() => { setQuery(""); setDestination("All"); setCarType("Any car"); setMaxPrice(800); setSortBy("Recommended"); setMinRating(0); }}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 24px", background: "var(--color-mocha)", color: "white", border: "none", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
              >
                Clear all filters
              </button>
            </div>

            {/* Show all pairs as suggestions */}
            <div style={{ marginTop: "40px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px" }}>
                You might like
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
                {scoredPairs.slice(0, 3).map((pair) => <ScoredPairCard key={pair.id} pair={pair} />)}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
              {filtered.map((pair) => <ScoredPairCard key={pair.id} pair={pair} />)}
            </div>

            {/* Bottom CTA after results */}
            <div style={{ marginTop: "60px", background: "var(--color-black)", borderRadius: "8px", padding: "48px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,28px)", color: "white", marginBottom: "8px" }}>
                  Not seeing the right pair?
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>
                  Take our 2-min quiz — we'll match you to the perfect stay + car.
                </p>
              </div>
              <button
                onClick={() => navigate("/quiz")}
                style={{ background: "var(--color-mocha)", color: "white", border: "none", padding: "14px 32px", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", whiteSpace: "nowrap" }}
              >
                TAKE THE QUIZ →
              </button>
            </div>
          </>
        )}
      </div>


    </div>
  );
}
