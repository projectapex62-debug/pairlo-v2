import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { SlidersHorizontal, MapPin, X, LayoutGrid, Map, SearchX, Shuffle } from "lucide-react";
import { allPairs, mapPins } from "../lib/mock-data";
import { PairCard } from "../components/pair-card";
import { PairModal } from "../components/pair-modal";
import { CompareDrawer } from "../components/compare-drawer";

const DESTINATIONS = ["All", "Miami", "Aspen", "New York", "Los Angeles", "Chicago"];
const SORT_OPTIONS = ["Recommended", "Price: Low to High", "Price: High to Low", "Top Rated"];
const CAR_TYPE_PILLS = [
  { label: "Any", icon: "🚗", value: "Any car" },
  { label: "Sedan", icon: "🚘", value: "Sedan" },
  { label: "SUV", icon: "🚙", value: "SUV" },
  { label: "Sports", icon: "🏎", value: "Convertible" },
  { label: "Electric", icon: "⚡", value: "EV" },
  { label: "Luxury", icon: "💼", value: "Luxury" },
];

// ── SKELETON CARD ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: "4px",
      overflow: "hidden",
      background: "white",
      border: "1px solid var(--color-gray-200)",
      height: "360px",
      position: "relative",
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
      {/* Image placeholder */}
      <div className="shimmer" style={{ height: "200px", width: "100%" }} />
      {/* Content placeholders */}
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
      {surprisePair && <PairModal pair={surprisePair} onClose={() => setSurprisePair(null)} />}
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
    <div style={{ position: "relative", width: "100%", height: "560px", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--color-gray-200)" }}>
      {/* Mock map background */}
      <div style={{
        width: "100%", height: "100%",
        background: "linear-gradient(135deg, #e8f0e4 0%, #d4e6cf 25%, #e8f0e4 50%, #cde0d8 75%, #e0ead6 100%)",
        position: "relative",
      }}>
        {/* Fake road lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }} xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="30%" x2="100%" y2="28%" stroke="#b8ccb0" strokeWidth="6" />
          <line x1="0" y1="60%" x2="100%" y2="62%" stroke="#b8ccb0" strokeWidth="4" />
          <line x1="22%" y1="0" x2="20%" y2="100%" stroke="#b8ccb0" strokeWidth="5" />
          <line x1="55%" y1="0" x2="57%" y2="100%" stroke="#b8ccb0" strokeWidth="4" />
          <line x1="80%" y1="0" x2="79%" y2="100%" stroke="#b8ccb0" strokeWidth="3" />
          <line x1="0" y1="45%" x2="100%" y2="48%" stroke="#c8d8c0" strokeWidth="2" />
          <line x1="38%" y1="0" x2="40%" y2="100%" stroke="#c8d8c0" strokeWidth="2" />
          {/* Water body */}
          <ellipse cx="85%" cy="75%" rx="12%" ry="9%" fill="#a8c8d8" opacity="0.5" />
          <ellipse cx="10%" cy="80%" rx="8%" ry="5%" fill="#a8c8d8" opacity="0.4" />
        </svg>

        {/* Map label */}
        <div style={{
          position: "absolute", top: "12px", left: "12px",
          background: "rgba(255,255,255,0.85)", borderRadius: "2px",
          padding: "6px 10px",
          fontFamily: "var(--font-body)", fontSize: "11px",
          color: "var(--color-gray-500)", letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          Preview Map — {pairs.length} pairs
        </div>

        {/* Pins */}
        {mapPins.filter(pin => pairs.some(p => p.id === pin.id)).map((pin) => {
          const isActive = activePinId === pin.id;
          const pair = pairs.find(p => p.id === pin.id);
          return (
            <button
              key={pin.id}
              onClick={() => onPinClick(pin.id)}
              style={{
                position: "absolute",
                left: `${pin.left}%`,
                top: `${pin.top}%`,
                transform: "translate(-50%, -100%)",
                background: isActive ? "var(--color-mocha)" : "var(--color-black)",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "5px 10px",
                fontSize: "12px",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 4px 16px rgba(123,91,58,0.5)"
                  : "0 2px 8px rgba(0,0,0,0.3)",
                transform: `translate(-50%, -100%) scale(${isActive ? 1.15 : 1})`,
                transition: "all 0.2s",
                zIndex: isActive ? 10 : 1,
                whiteSpace: "nowrap",
              }}
            >
              ${pin.price.toLocaleString()}
              {/* Pin tail */}
              <span style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0, height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `6px solid ${isActive ? "var(--color-mocha)" : "var(--color-black)"}`,
              }} />
            </button>
          );
        })}

        {/* Active pair tooltip */}
        {activePinId && (() => {
          const pair = pairs.find(p => p.id === activePinId);
          const pin = mapPins.find(p => p.id === activePinId);
          if (!pair || !pin) return null;
          const name = pair.stay?.name ?? (pair as any).hotel?.name ?? "Pair";
          return (
            <div style={{
              position: "absolute",
              left: `${Math.min(Math.max(pin.left, 20), 75)}%`,
              top: `${Math.min(pin.top + 5, 80)}%`,
              background: "white",
              borderRadius: "4px",
              padding: "12px 14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              zIndex: 20,
              minWidth: "180px",
              border: "1px solid var(--color-gray-200)",
            }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "var(--color-black)", marginBottom: "2px" }}>
                {name}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-500)" }}>
                From ${pair.grandTotal?.toLocaleString() ?? pin.price.toLocaleString()} total
              </p>
              <button
                onClick={() => onPinClick("")}
                style={{
                  position: "absolute", top: "6px", right: "6px",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--color-gray-400)", fontSize: "12px", lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          );
        })()}
      </div>
      {surprisePair && <PairModal pair={surprisePair} onClose={() => setSurprisePair(null)} />}
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
  const [surprisePair, setSurprisePair] = useState<typeof allPairs[0] | null>(null);

  // Simulate loading on mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // Pick up query params from homepage search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
  }, []);

  const filtered = allPairs
    .filter((p) => {
      const loc = p.stay?.location ?? (p as any).hotel?.location ?? "";
      const name = p.stay?.name ?? (p as any).hotel?.name ?? "";
      const stayPrice = p.stay?.price ?? (p as any).hotel?.price ?? 0;
      if (destination !== "All" && !loc.includes(destination)) return false;
      if (query && !name.toLowerCase().includes(query.toLowerCase()) &&
          !loc.toLowerCase().includes(query.toLowerCase())) return false;
      if (maxPrice < 800 && stayPrice > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return (a.stay?.price ?? 0) - (b.stay?.price ?? 0);
      if (sortBy === "Price: High to Low") return (b.stay?.price ?? 0) - (a.stay?.price ?? 0);
      if (sortBy === "Top Rated") return (b.stay?.rating ?? 0) - (a.stay?.rating ?? 0);
      return 0;
    });

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--color-gray-500)",
    marginBottom: "8px",
    display: "block",
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "2px",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--color-black)",
    background: "white",
    appearance: "none" as const,
    cursor: "pointer",
    outline: "none",
  };

  const viewBtnStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 12px",
    border: `1px solid ${active ? "var(--color-mocha)" : "var(--color-gray-200)"}`,
    borderRadius: "2px",
    background: active ? "var(--color-mocha)" : "white",
    color: active ? "white" : "var(--color-gray-500)",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.05em",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-cream)", paddingTop: "72px" }}>

      {/* ── SEARCH HEADER ── */}
      <div style={{ background: "var(--color-black)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "white", marginBottom: "24px" }}>
            Find your perfect <em style={{ fontStyle: "italic", color: "var(--color-mocha-pale)" }}>pair</em>
          </h1>
          <div style={{
            display: "flex", gap: "0", background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: "2px", overflow: "hidden"
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px" }}>
              <MapPin size={16} color="var(--color-mocha-light)" />
              <input
                type="text"
                placeholder="Search destination, hotel…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-body)", fontSize: "14px", color: "white", width: "100%" }}
              />
              {query && <X size={14} color="rgba(255,255,255,0.4)" style={{ cursor: "pointer" }} onClick={() => setQuery("")} />}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 20px", borderLeft: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}
              onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} color="var(--color-mocha-light)" />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>Filters</span>
            </div>
          </div>

          {/* Filter row */}
          {showFilters && (
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Destination dropdown */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                <div>
                  <label style={{ ...labelStyle, color: "rgba(255,255,255,0.45)" }}>Destination</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)}
                    style={{ ...selectStyle, background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(255,255,255,0.14)" }}>
                    {DESTINATIONS.map(o => <option key={o} value={o} style={{ background: "#1a1a1a" }}>{o}</option>)}
                  </select>
                </div>
              </div>
              {/* Price range slider */}
              <div>
                <label style={{ ...labelStyle, color: "rgba(255,255,255,0.45)" }}>
                  Max stay price per night
                  <span style={{ float: "right", color: "var(--color-mocha-light)", fontWeight: 600 }}>
                    {maxPrice >= 800 ? "Any" : `${maxPrice}/night`}
                  </span>
                </label>
                <div style={{ position: "relative", padding: "4px 0 2px" }}>
                  <input
                    type="range"
                    min={100}
                    max={800}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--color-mocha)", cursor: "pointer", height: "4px" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>$100</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>$800+</span>
                  </div>
                </div>
              </div>
              {/* Car type pills */}
              <div>
                <label style={{ ...labelStyle, color: "rgba(255,255,255,0.45)" }}>Car Type</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CAR_TYPE_PILLS.map((pill) => {
                    const active = carType === pill.value;
                    return (
                      <button
                        key={pill.value}
                        onClick={() => setCarType(pill.value)}
                        style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          padding: "7px 14px",
                          border: `1px solid ${active ? "var(--color-mocha)" : "rgba(255,255,255,0.18)"}`,
                          borderRadius: "100px",
                          background: active ? "var(--color-mocha)" : "rgba(255,255,255,0.07)",
                          color: active ? "white" : "rgba(255,255,255,0.72)",
                          fontFamily: "var(--font-body)",
                          fontSize: "13px",
                          fontWeight: active ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.18s",
                          letterSpacing: "0.02em",
                        }}
                        onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.color = "white"; }}}
                        onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)"; }}}
                      >
                        <span style={{ fontSize: "15px", lineHeight: 1 }}>{pill.icon}</span>
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── DESTINATION TABS ── */}
      <div style={{ background: "white", borderBottom: "1px solid var(--color-gray-200)", overflowX: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "0" }}>
          {DESTINATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDestination(d)}
              style={{
                padding: "16px 20px",
                border: "none",
                borderBottom: destination === d ? "2px solid var(--color-mocha)" : "2px solid transparent",
                background: "transparent",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: destination === d ? 600 : 400,
                color: destination === d ? "var(--color-mocha)" : "var(--color-gray-500)",
                cursor: "pointer",
                whiteSpace: "nowrap" as const,
                transition: "all 0.2s",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Results bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)" }}>
            {loading ? (
              <span style={{ color: "var(--color-gray-400)" }}>Finding pairs…</span>
            ) : (
              <><span style={{ fontWeight: 600, color: "var(--color-black)" }}>{filtered.length}</span> pairs found</>
            )}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Surprise Me */}
            <button
              onClick={() => {
                const r = allPairs[Math.floor(Math.random() * allPairs.length)];
                setSurprisePair(r);
              }}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--color-cream)", border: "1px solid var(--color-gray-200)", borderRadius: "2px", padding: "8px 14px", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-600)", cursor: "pointer", transition: "all 0.2s", fontWeight: 500 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-mocha)"; (e.currentTarget as HTMLElement).style.color = "var(--color-mocha)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gray-200)"; (e.currentTarget as HTMLElement).style.color = "var(--color-gray-600)"; }}
            >
              <Shuffle size={12} /> Surprise Me
            </button>

            {/* View toggle */}
            <div style={{ display: "flex", gap: "4px" }}>
              <button style={viewBtnStyle(viewMode === "grid")} onClick={() => setViewMode("grid")}>
                <LayoutGrid size={13} />
                Grid
              </button>
              <button style={viewBtnStyle(viewMode === "map")} onClick={() => setViewMode("map")}>
                <Map size={13} />
                Map
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ ...selectStyle, width: "auto", padding: "8px 12px", fontSize: "13px" }}
            >
              {SORT_OPTIONS.map(o => <option key={o} value={o}>Sort: {o}</option>)}
            </select>
          </div>
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : viewMode === "map" ? (
          <div>
            <MapView pairs={filtered} onPinClick={(id) => setActivePinId(id === activePinId ? null : id)} activePinId={activePinId} />
            {/* Mini list below map */}
            {activePinId && (
              <div style={{ marginTop: "28px" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", marginBottom: "16px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Selected pair
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px", maxWidth: "680px" }}>
                  {filtered.filter(p => p.id === activePinId).map(pair => (
                    <PairCard key={pair.id} pair={pair} />
                  ))}
                </div>
              </div>
            )}
            {/* All pairs mini scroll below */}
            <div style={{ marginTop: "36px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", marginBottom: "16px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                All pairs — click a pin or card to highlight
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {filtered.map((pair) => (
                  <div
                    key={pair.id}
                    onClick={() => setActivePinId(pair.id === activePinId ? null : pair.id)}
                    style={{
                      cursor: "pointer",
                      outline: pair.id === activePinId ? "2px solid var(--color-mocha)" : "2px solid transparent",
                      borderRadius: "4px",
                      transition: "outline 0.2s",
                    }}
                  >
                    <PairCard pair={pair} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--color-gray-100)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <SearchX size={36} color="var(--color-gray-300)" />
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--color-gray-400)", marginBottom: "12px" }}>No pairs found</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-400)", marginBottom: "28px" }}>Try adjusting your filters or clearing your search</p>
            <button
              onClick={() => { setQuery(""); setDestination("All"); setCarType("Any car"); setMaxPrice(800); setSortBy("Recommended"); }}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 24px", background: "var(--color-mocha)", color: "white", border: "none", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em" }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
            {filtered.map((pair) => (
              <PairCard key={pair.id} pair={pair} />
            ))}
          </div>
        )}
      </div>
      {surprisePair && <PairModal pair={surprisePair} onClose={() => setSurprisePair(null)} />}
    </div>
  );
}
