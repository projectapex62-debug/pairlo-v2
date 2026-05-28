import { useState, useEffect, useRef } from "react";
import { Star, MapPin, Car, Zap, TrendingUp, Sparkles, Tag, ArrowDown, Heart, GitCompare, Clock } from "lucide-react";
import { PairModal } from "./pair-modal";
import { toggleWishlist, isWishlisted } from "../lib/wishlist";
import { toggleCompare, getCompare, COMPARE_EVENT } from "../lib/compare";

export interface PairCardData {
  id: string;
  badge?: "Trending" | "New" | "Deal" | "Top Pick";
  separatePrice?: number;
  carMatchReason?: string;
  lastBooked?: string; // e.g. "2 hours ago"
  stay: {
    name: string;
    location: string;
    image: string;
    gallery?: string[];
    price: number;
    rating: number;
    reviews: number;
    beds: number;
    baths: number;
    sqft?: number;
    yearBuilt?: number;
    tags: string[];
    description?: string;
    amenities?: string[];
  };
  car: {
    name: string;
    brand?: string;
    year?: number;
    type: string;
    image: string;
    price: number;
    mileage?: string;
    engine?: string;
    transmission?: string;
    features: string[];
    color?: string;
    seats?: number;
  };
  totalNights: number;
  totalDays: number;
}

const BADGE_CONFIG = {
  Trending: { bg: "#E8F4FD", color: "#1a6fa8", icon: <TrendingUp size={9} /> },
  New: { bg: "#EDF7ED", color: "#2e7d32", icon: <Sparkles size={9} /> },
  Deal: { bg: "#FFF3E0", color: "#e65100", icon: <Tag size={9} /> },
  "Top Pick": { bg: "#F3E5F5", color: "#6a1b9a", icon: <Star size={9} fill="#6a1b9a" /> },
};

// Social proof timestamps — deterministic per id
const BOOKED_AGO: Record<string, string> = {
  "pair-1": "3 hours ago",
  "pair-2": "47 min ago",
  "pair-3": "1 day ago",
  "pair-4": "2 hours ago",
  "pair-5": "18 min ago",
  "pair-6": "5 hours ago",
};

function PriceTooltip({ stay, car, nights, days, grandTotal }: {
  stay: number; car: number; nights: number; days: number; grandTotal: number;
}) {
  return (
    <div style={{
      position: "absolute", bottom: "calc(100% + 8px)", right: 0,
      background: "var(--color-black)", borderRadius: "4px", padding: "12px 14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)", zIndex: 20, minWidth: "200px",
      pointerEvents: "none",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
            Stay × {nights} nights
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "white" }}>
            ${(stay * nights).toLocaleString()}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
            Car × {days} days
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "white" }}>
            ${(car * days).toLocaleString()}
          </span>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: "4px", paddingTop: "6px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "var(--color-mocha-pale)" }}>Total</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, color: "white" }}>${grandTotal.toLocaleString()}</span>
        </div>
      </div>
      {/* Arrow */}
      <div style={{ position: "absolute", bottom: "-5px", right: "20px", width: "10px", height: "10px", background: "var(--color-black)", transform: "rotate(45deg)" }} />
    </div>
  );
}

export function PairCard({ pair, featured = false, onCompareChange }: {
  pair: PairCardData;
  featured?: boolean;
  onCompareChange?: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(pair.id));
  const [inCompare, setInCompare] = useState(() => getCompare().includes(pair.id));
  const [showTooltip, setShowTooltip] = useState(false);
  const [maxedOut, setMaxedOut] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const grandTotal = pair.stay.price * pair.totalNights + pair.car.price * pair.totalDays;
  const separateTotal = pair.separatePrice
    ? pair.separatePrice * pair.totalNights + pair.car.price * pair.totalDays * 1.18
    : null;
  const savings = separateTotal ? Math.round(separateTotal - grandTotal) : null;
  const badge = pair.badge ? BADGE_CONFIG[pair.badge] : null;
  const bookedAgo = BOOKED_AGO[pair.id];

  // Sync compare state from external changes
  useEffect(() => {
    const handler = () => setInCompare(getCompare().includes(pair.id));
    window.addEventListener(COMPARE_EVENT, handler);
    return () => window.removeEventListener(COMPARE_EVENT, handler);
  }, [pair.id]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleWishlist(pair.id);
    setWishlisted(added);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = toggleCompare(pair.id);
    if (result.maxed) {
      setMaxedOut(true);
      setTimeout(() => setMaxedOut(false), 2000);
    } else {
      setInCompare(result.added);
      onCompareChange?.();
    }
  };

  return (
    <>
      <div
        style={{
          background: "var(--color-white)",
          border: `1px solid ${inCompare ? "var(--color-mocha)" : "var(--color-gray-200)"}`,
          borderRadius: "6px",
          overflow: "hidden",
          boxShadow: featured ? "0 8px 40px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.05)",
          transition: "all 0.25s ease",
          cursor: "pointer",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 64px rgba(0,0,0,0.14)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = featured ? "0 8px 40px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.05)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
        onClick={() => setModalOpen(true)}
      >
        {/* Compare indicator strip */}
        {inCompare && (
          <div style={{ height: "3px", background: "var(--color-mocha)", position: "absolute", top: 0, left: 0, right: 0, zIndex: 5 }} />
        )}

        {/* ── SPLIT IMAGE: Stay top + Car bottom ── */}
        <div style={{ display: "grid", gridTemplateRows: "1fr auto", height: "320px", position: "relative" }}>

          {/* Stay image — top */}
          <div style={{ position: "relative", overflow: "hidden", height: "210px" }}>
            <img
              src={pair.stay.image}
              alt={pair.stay.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
              onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
            />
            {/* Badge + STAY row */}
            <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ background: "rgba(27,46,31,0.72)", color: "white", fontSize: "10px", padding: "4px 10px", borderRadius: "2px", backdropFilter: "blur(4px)", fontFamily: "var(--font-body)", letterSpacing: "0.08em" }}>
                STAY
              </span>
              {badge && (
                <span style={{ background: badge.bg, color: badge.color, fontSize: "10px", padding: "4px 9px", borderRadius: "2px", fontFamily: "var(--font-body)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  {badge.icon} {pair.badge}
                </span>
              )}
            </div>

            {/* Action buttons — top right */}
            <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: wishlisted ? "rgba(220,38,38,0.9)" : "rgba(255,255,255,0.88)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <Heart
                  size={14}
                  fill={wishlisted ? "white" : "none"}
                  color={wishlisted ? "white" : "var(--color-gray-600)"}
                  strokeWidth={2}
                />
              </button>

              {/* Compare */}
              <button
                onClick={handleCompare}
                title={inCompare ? "Remove from compare" : maxedOut ? "Max 2 pairs" : "Add to compare"}
                style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: inCompare ? "rgba(139,94,60,0.9)" : maxedOut ? "rgba(220,38,38,0.8)" : "rgba(255,255,255,0.88)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <GitCompare size={14} color={inCompare || maxedOut ? "white" : "var(--color-gray-600)"} strokeWidth={2} />
              </button>
            </div>

            {/* Rating */}
            <div style={{ position: "absolute", top: 52, right: 10, background: "rgba(255,255,255,0.93)", padding: "4px 8px", borderRadius: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Star size={11} fill="var(--color-mocha)" color="var(--color-mocha)" />
              <span style={{ fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-body)" }}>{pair.stay.rating}</span>
              <span style={{ fontSize: "11px", color: "var(--color-gray-500)", fontFamily: "var(--font-body)" }}>({pair.stay.reviews})</span>
            </div>

            {/* Stay name overlay */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(27,46,31,0.72) 0%, transparent 100%)", padding: "28px 14px 12px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "white", fontWeight: 400, lineHeight: 1.2 }}>{pair.stay.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                <MapPin size={11} color="rgba(255,255,255,0.65)" />
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)" }}>{pair.stay.location}</span>
              </div>
            </div>
          </div>

          {/* ── PAIRED WITH connector ── */}
          <div style={{ position: "absolute", top: "195px", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "var(--color-mocha)", borderRadius: "20px", padding: "4px 12px", display: "flex", alignItems: "center", gap: "5px", boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
              <Zap size={10} fill="white" color="white" />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "white", fontWeight: 600, letterSpacing: "0.1em" }}>PAIRED WITH</span>
              <Zap size={10} fill="white" color="white" />
            </div>
          </div>

          {/* Car image — bottom strip */}
          <div style={{ position: "relative", overflow: "hidden", height: "110px" }}>
            <img
              src={pair.car.image}
              alt={pair.car.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", transition: "transform 0.5s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
              onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(27,46,31,0.65) 0%, rgba(27,46,31,0.15) 60%)" }} />
            <div style={{ position: "absolute", top: 10, left: 12 }}>
              <span style={{ background: "rgba(123,91,58,0.85)", color: "white", fontSize: "10px", padding: "3px 9px", borderRadius: "2px", backdropFilter: "blur(4px)", fontFamily: "var(--font-body)", letterSpacing: "0.08em" }}>
                CAR
              </span>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 14px 10px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Car size={12} color="rgba(255,255,255,0.85)" />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "white" }}>{pair.car.name}</span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>
                  {pair.car.type} · {pair.car.features.slice(0, 2).join(" · ")}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 700, color: "white" }}>${pair.car.price}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.55)" }}>/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── INFO + PRICING FOOTER ── */}
        <div style={{ padding: "14px 16px" }}>
          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" }}>
            {pair.stay.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{ background: "var(--color-mocha-pale)", color: "var(--color-mocha-dark)", fontSize: "10px", padding: "3px 8px", borderRadius: "2px", fontFamily: "var(--font-body)" }}>
                {tag}
              </span>
            ))}
            <span style={{ fontSize: "10px", color: "var(--color-gray-400)", padding: "3px 6px", fontFamily: "var(--font-body)" }}>
              {pair.stay.beds}bd · {pair.stay.baths}ba{pair.stay.sqft ? ` · ${pair.stay.sqft.toLocaleString()} sqft` : ""}
            </span>
          </div>

          {/* Social proof */}
          {bookedAgo && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
              <Clock size={11} color="#16a34a" />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#16a34a" }}>
                Last booked <strong>{bookedAgo}</strong>
              </span>
            </div>
          )}

          {/* Savings bar */}
          {savings && savings > 0 && (
            <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0", borderRadius: "3px", padding: "7px 10px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "7px" }}>
              <ArrowDown size={13} color="#16a34a" />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#15803d", fontWeight: 600 }}>
                Save ${savings} vs booking separately
              </span>
            </div>
          )}

          {/* Pricing row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: "11px", color: "var(--color-gray-400)", fontFamily: "var(--font-body)" }}>
                {pair.totalNights}n + {pair.totalDays}d
              </p>
              <div
                style={{ display: "inline-block", cursor: "help" }}
                onMouseEnter={() => {
                  if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
                  setShowTooltip(true);
                }}
                onMouseLeave={() => {
                  tooltipTimer.current = setTimeout(() => setShowTooltip(false), 150);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 500, marginTop: "1px", borderBottom: "1px dashed var(--color-gray-300)" }}>
                  ${grandTotal.toLocaleString()} <span style={{ fontSize: "12px", fontWeight: 400, color: "var(--color-gray-400)" }}>total</span>
                </p>
                {showTooltip && (
                  <PriceTooltip
                    stay={pair.stay.price}
                    car={pair.car.price}
                    nights={pair.totalNights}
                    days={pair.totalDays}
                    grandTotal={grandTotal}
                  />
                )}
              </div>
            </div>
            <button
              style={{
                background: "var(--color-black)",
                color: "white",
                border: "none",
                fontSize: "12px",
                fontWeight: 600,
                padding: "10px 20px",
                borderRadius: "2px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.05em",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-black)")}
              onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
            >
              Book Pair
            </button>
          </div>
        </div>
      </div>

      {modalOpen && <PairModal pair={pair} onClose={() => setModalOpen(false)} />}
    </>
  );
}
