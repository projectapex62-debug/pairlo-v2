import { useParams, useLocation } from "wouter";
import { allPairs } from "../lib/mock-data";
import { computePairScore, getScoreColor, getScoreLabel } from "../lib/pair-score";
import { PairScoreBadge } from "../components/pair-score-badge";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Copy, Check, Share2, Twitter, ArrowRight, Car, Home, Calendar, Users, Star, ChevronLeft } from "lucide-react";

export default function TripPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const [nights, setNights] = useState(3);

  // Parse nights from id if encoded as "pair-1-5n"
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

  const pairTotal = (pair.stay.price + pair.car.price) * nights;
  const savings = pair.separatePrice - (pair.stay.price + pair.car.price) * (pair.totalNights || nights);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetText = `Just found the perfect trip on @Pairlo — ${pair.stay.name} + ${pair.car.name} for $${pairTotal}/trip. Pair Score: ${score.overall}/10 ✈️`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-cream)" }}>
      {/* Minimal Header */}
      <div style={{ background: "var(--color-black)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/">
          <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "white", cursor: "pointer", letterSpacing: "-0.01em" }}>Pairlo</span>
        </Link>
        <Link to="/search">
          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.5)", cursor: "pointer", letterSpacing: "0.08em" }}>
            FIND YOUR OWN PAIR →
          </span>
        </Link>
      </div>

      {/* Hero image */}
      <div style={{ position: "relative", height: "340px", overflow: "hidden" }}>
        <img src={pair.stay.image} alt={pair.stay.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />
        <div style={{ position: "absolute", bottom: "28px", left: "32px", right: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            {pair.badge && (
              <span style={{ background: "var(--color-mocha)", color: "white", fontFamily: "var(--font-body)", fontSize: "10px", padding: "3px 10px", borderRadius: "2px", letterSpacing: "0.1em" }}>{pair.badge}</span>
            )}
            <PairScoreBadge
              stayPrice={pair.stay.price} carPrice={pair.car.price}
              separatePrice={pair.separatePrice} totalNights={nights}
              stayTags={pair.stay.tags} carType={pair.car.type}
              stayRating={pair.stay.rating} badge={pair.badge}
              size="sm"
            />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,4vw,38px)", fontWeight: 400, color: "white", lineHeight: 1.1 }}>
            {pair.stay.name}<br />
            <span style={{ color: "var(--color-mocha-pale)", fontSize: "0.7em" }}>+ {pair.car.name}</span>
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>

          {/* Left: details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Stay */}
            <div style={{ background: "white", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--color-gray-200)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-gray-100)", display: "flex", alignItems: "center", gap: "10px" }}>
                <Home size={16} color="var(--color-mocha)" />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-mocha)", fontWeight: 600 }}>The Stay</span>
              </div>
              <div style={{ display: "flex", gap: "0" }}>
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

            {/* Car */}
            <div style={{ background: "white", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--color-gray-200)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-gray-100)", display: "flex", alignItems: "center", gap: "10px" }}>
                <Car size={16} color="var(--color-mocha)" />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-mocha)", fontWeight: 600 }}>The Car</span>
              </div>
              <div style={{ display: "flex", gap: "0" }}>
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

            {/* Match reason */}
            <div style={{ background: "var(--color-black)", borderRadius: "6px", padding: "24px", color: "white" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", color: "var(--color-mocha-light)", textTransform: "uppercase", marginBottom: "10px" }}>Why This Pair Works</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontStyle: "italic", lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>"{pair.carMatchReason}"</p>
            </div>
          </div>

          {/* Right: booking card */}
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

              {/* Nights picker */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-gray-100)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-gray-400)", marginBottom: "8px" }}>Nights</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button onClick={() => setNights(n => Math.max(1, n - 1))} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--color-gray-200)", background: "white", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", minWidth: "24px", textAlign: "center" }}>{nights}</span>
                  <button onClick={() => setNights(n => Math.min(30, n + 1))} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--color-gray-200)", background: "white", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
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
                <PairScoreBadge
                  stayPrice={pair.stay.price} carPrice={pair.car.price}
                  separatePrice={pair.separatePrice} totalNights={nights}
                  stayTags={pair.stay.tags} carType={pair.car.type}
                  stayRating={pair.stay.rating} badge={pair.badge}
                  size="lg"
                />
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
                <button
                  onClick={handleCopy}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: copied ? "#e8f5e9" : "var(--color-cream)", border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "10px", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "12px", color: copied ? "#2d6a4f" : "var(--color-black)", transition: "all 0.2s" }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#000", border: "1px solid #000", borderRadius: "4px", padding: "10px 14px", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "12px", color: "white", textDecoration: "none" }}
                >
                  <Twitter size={14} /> Share
                </a>
                <button
                  onClick={() => { if (navigator.share) navigator.share({ title: `${pair.stay.name} + ${pair.car.name}`, url: shareUrl }); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-mocha)", border: "none", borderRadius: "4px", padding: "10px 14px", cursor: "pointer", color: "white" }}
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
