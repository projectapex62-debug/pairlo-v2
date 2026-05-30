import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, MapPin, Calendar, ChevronDown, Star, ChevronUp, Shuffle, Trophy, Calculator, HelpCircle } from "lucide-react";
import { featuredPairs, destinations, stats, howItWorks, testimonials, allPairs } from "../lib/mock-data";
import { PairCard } from "../components/pair-card";
import { PairModal } from "../components/pair-modal";

// ── SAVINGS STRIP ──────────────────────────────────────────────────────────
function SavingsStrip() {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const TARGET = 2400000;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        const duration = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = Math.floor(eased * TARGET);
          el.textContent = "$" + (val / 1000000).toFixed(1) + "M+";
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "var(--color-mocha-pale)", borderBottom: "1px solid var(--color-gray-200)", padding: "18px 24px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "8px 20px", textAlign: "center" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 500, color: "var(--color-black)" }}>
          🎉 Pairlo travelers have saved{" "}
          <span ref={ref} style={{ color: "var(--color-mocha)" }}>$0.0M+</span>
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>
          vs. booking stays & cars separately
        </span>
      </div>
    </div>
  );
}

// ── PAIR OF THE WEEK ───────────────────────────────────────────────────────
function PairOfTheWeek() {
  const [, navigate] = useLocation();
  // Rotate weekly — use ISO week number to pick from allPairs
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const potw = allPairs[weekNum % allPairs.length];
  const grandTotal = potw.stay.price * potw.totalNights + potw.car.price * potw.totalDays;

  return (
    <section style={{ background: "var(--color-white)", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--color-mocha-pale)", borderRadius: "20px", padding: "6px 16px", marginBottom: "16px" }}>
            <Trophy size={13} color="var(--color-mocha)" />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-mocha)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Pair of the Week</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 400, color: "var(--color-black)" }}>
            This week's top pick
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "0", borderRadius: "6px", overflow: "hidden", boxShadow: "0 16px 60px rgba(0,0,0,0.12)", border: "1px solid var(--color-gray-200)" }} className="potw-grid">
          {/* Image */}
          <div style={{ position: "relative", minHeight: "360px" }}>
            <img src={potw.stay.image} alt={potw.stay.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(255,255,255,0.03) 100%)" }} />
            <div style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(27,46,31,0.75)", backdropFilter: "blur(8px)", borderRadius: "3px", padding: "8px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Star size={12} color="#F4C056" fill="#F4C056" />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 700, color: "white" }}>{potw.stay.rating}</span>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 500, color: "white", marginBottom: "4px" }}>{potw.stay.name}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{potw.stay.location}</p>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: "var(--color-cream)", padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-mocha)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>
                This Week's Pair
              </p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 500, color: "var(--color-black)", marginBottom: "8px" }}>
                {potw.stay.name}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-600)", marginBottom: "24px" }}>
                + {potw.car.name}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                {[
                  `${potw.totalNights} nights · ${potw.totalDays} day rental`,
                  potw.stay.location,
                  `${potw.car.seats} seats · ${potw.car.fuel}`,
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-mocha)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-600)" }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--color-gray-200)", paddingTop: "20px", marginBottom: "24px" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", marginBottom: "4px" }}>Bundle total</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 500, color: "var(--color-black)" }}>
                  ${grandTotal.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/checkout?pair=${potw.id}&nights=${potw.totalNights}&days=${potw.totalDays}`)}
              style={{ width: "100%", background: "var(--color-mocha)", color: "white", border: "none", padding: "14px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha-light)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha)")}
            >
              BOOK THIS WEEK'S PAIR <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .potw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ── ANIMATED STATS STRIP ──────────────────────────────────────────────────
function parseStatValue(val: string): { num: number; suffix: string } {
  const match = val.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: val };
  return { num: parseFloat(match[1]), suffix: match[2] };
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const { num, suffix } = parseStatValue(value);
  const isFloat = !Number.isInteger(num);
  const ref = useRef<HTMLParagraphElement>(null);
  const [displayed, setDisplayed] = useState("0" + suffix);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const duration = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * num;
            const formatted = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
            setDisplayed(formatted + suffix);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num, suffix, isFloat]);

  return (
    <div style={{ textAlign: "center" }}>
      <p ref={ref} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 500, color: "var(--color-black)", transition: "none" }}>
        {displayed}
      </p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)", letterSpacing: "0.08em", marginTop: "4px" }}>
        {label.toUpperCase()}
      </p>
    </div>
  );
}

function StatsStrip() {
  return (
    <section style={{ background: "var(--color-gray-100)", padding: "32px 24px", borderTop: "1px solid var(--color-gray-200)", borderBottom: "1px solid var(--color-gray-200)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {stats.map((s, i) => (
          <AnimatedStat key={i} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [destination, setDestination] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [, navigate] = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [surprisePair, setSurprisePair] = useState<typeof allPairs[0] | null>(null);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("q", destination);
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    navigate(`/search${params.toString() ? "?" + params.toString() : ""}`);
  };

  return (
    <div style={{ background: "var(--color-white)" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "100vh", minHeight: "640px", overflow: "hidden" }}>
        <img
          src="/hero-bg.jpg"
          alt="Luxury travel"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Overlay — richer cinematic gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 45%, rgba(10,10,10,0.65) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />

        {/* Hero content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <div className="fade-in d100" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(138,158,123,0.35)", backdropFilter: "blur(8px)", border: "1px solid rgba(138,158,123,0.5)", borderRadius: "100px", padding: "6px 18px", marginBottom: "28px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8A9E7B", boxShadow: "0 0 8px rgba(138,158,123,0.8)", display: "inline-block" }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase" }}>The smarter way to travel</span>
          </div>
          <h1
            className="fade-up d200"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(50px, 7.5vw, 96px)",
              fontWeight: 400,
              color: "white",
              lineHeight: 1.02,
              maxWidth: "860px",
              textShadow: "0 2px 40px rgba(0,0,0,0.4)",
            }}
          >
            One Search.<br />
            <em style={{ fontStyle: "italic", color: "#E8C99A" }}>Two Keys.</em><br />
            Zero Hassle.
          </h1>
          <p className="fade-up d300" style={{ color: "rgba(255,255,255,0.72)", fontFamily: "var(--font-body)", fontSize: "clamp(14px,1.5vw,18px)", marginTop: "28px", maxWidth: "520px", lineHeight: 1.75, textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
            Every great trip starts with the right place to stay and the right car to explore it. We find both.
          </p>

          {/* Catchphrase */}
          <div className="fade-up d350" style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ height: "1px", width: "40px", background: "var(--color-mocha)" }} />
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(15px, 1.6vw, 19px)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.01em",
            }}>
              Don't book twice —{" "}
              <span style={{ color: "var(--color-mocha-pale)", fontWeight: 500 }}>Pairlo</span>
              {" "}it.
            </p>
            <div style={{ height: "1px", width: "40px", background: "var(--color-mocha)" }} />
          </div>

          {/* Search box */}
          <div
            className="fade-up d400"
            style={{
              marginTop: "52px",
              background: "rgba(255,255,255,0.98)",
              borderRadius: "6px",
              display: "flex",
              flexWrap: "wrap",
              gap: "0",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.15)",
              overflow: "hidden",
              width: "100%",
              maxWidth: "740px",
            }}
          >
            <div style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: "10px", padding: "16px 20px", borderRight: "1px solid var(--color-gray-200)" }}>
              <MapPin size={16} color="var(--color-mocha)" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{ border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-black)", background: "transparent", width: "100%" }}
              />
            </div>
            <div style={{ flex: "1 1 130px", display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", borderRight: "1px solid var(--color-gray-200)" }}>
              <Calendar size={16} color="var(--color-mocha)" style={{ flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                <span style={{ fontSize: "10px", color: "var(--color-gray-400)", fontFamily: "var(--font-body)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Check-in</span>
                <input
                  type="date"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  style={{ border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-700)", background: "transparent", width: "100%" }}
                />
              </div>
            </div>
            <div style={{ flex: "1 1 130px", display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", borderRight: "1px solid var(--color-gray-200)" }}>
              <Calendar size={16} color="var(--color-gray-400)" style={{ flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                <span style={{ fontSize: "10px", color: "var(--color-gray-400)", fontFamily: "var(--font-body)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Check-out</span>
                <input
                  type="date"
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  style={{ border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-700)", background: "transparent", width: "100%" }}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              style={{
                background: "var(--color-mocha)",
                color: "white",
                border: "none",
                padding: "0 32px",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.06em",
                minHeight: "56px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha-light)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha)")}
            >
              SEARCH
            </button>
          </div>

          {/* Surprise Me */}
          <button
            className="fade-up d450"
            onClick={() => {
              const r = allPairs[Math.floor(Math.random() * allPairs.length)];
              setSurprisePair(r);
            }}
            style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", padding: "9px 20px", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)", fontSize: "13px", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
          >
            <Shuffle size={13} /> Surprise Me
          </button>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}>SCROLL</span>
          <ChevronDown size={16} color="rgba(255,255,255,0.5)" />
        </div>
      </section>

      {/* Surprise Me Modal */}
      {surprisePair && <PairModal pair={surprisePair} onClose={() => setSurprisePair(null)} />}

      {/* ── TRUST BAR ── */}
      <div style={{ background: "white", borderBottom: "1px solid var(--color-gray-200)", padding: "18px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "0 40px", rowGap: "12px" }}>
          {/* As seen in label */}
          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.2em", color: "var(--color-gray-400)", textTransform: "uppercase", flexShrink: 0 }}>As seen in</span>

          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "var(--color-gray-200)", flexShrink: 0 }} />

          {/* Publications */}
          {["Forbes Travel", "CNN Travel", "Condé Nast", "Travel + Leisure", "The Points Guy"].map((pub, i, arr) => (
            <span key={pub} style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontStyle: "italic", color: "var(--color-gray-500)", letterSpacing: "0.02em", whiteSpace: "nowrap" as const, display: "inline-flex", alignItems: "center", gap: "40px" }}>
              {pub}
              {i < arr.length - 1 && <span style={{ display: "inline-block", width: "3px", height: "3px", borderRadius: "50%", background: "var(--color-gray-300)", marginLeft: "0" }} />}
            </span>
          ))}

          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "var(--color-gray-200)", flexShrink: 0 }} />

          {/* Stats */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= 4 ? "#f59e0b" : "none"} color="#f59e0b" strokeWidth={s === 5 ? 1.5 : 0} />)}
              <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, color: "var(--color-black)", marginLeft: "3px" }}>4.9</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>/ 5</span>
            </div>
            <span style={{ width: "1px", height: "14px", background: "var(--color-gray-200)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)" }}>
              <strong style={{ color: "var(--color-black)", fontWeight: 700 }}>50,000+</strong> trips booked
            </span>
          </div>
        </div>
      </div>

      {/* ── SAVINGS COUNTER STRIP ── */}
      <SavingsStrip />

      {/* ── FEATURED PAIRS ── */}
      <section style={{ background: "var(--color-white)", padding: "96px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "48px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "12px" }}>
                Featured Pairs
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400 }}>
                Curated stays + cars
              </h2>
            </div>
            <Link to="/search">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-mocha)", cursor: "pointer", fontWeight: 500, letterSpacing: "0.04em" }}>
                View all pairs <ArrowRight size={14} />
              </span>
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
            {featuredPairs.map((pair, i) => (
              <PairCard key={pair.id} pair={pair} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section style={{ background: "var(--color-gray-100)", padding: "96px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "12px" }}>
              Top Destinations
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400 }}>
              Where will you pair next?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {destinations.map((dest) => (
              <Link key={dest.id} to="/search">
                <div
                  style={{ position: "relative", borderRadius: "4px", overflow: "hidden", cursor: "pointer", height: "300px" }}
                  onMouseEnter={(e) => {
                    const img = (e.currentTarget as HTMLElement).querySelector("img") as HTMLImageElement;
                    if (img) img.style.transform = "scale(1.07)";
                  }}
                  onMouseLeave={(e) => {
                    const img = (e.currentTarget as HTMLElement).querySelector("img") as HTMLImageElement;
                    if (img) img.style.transform = "scale(1)";
                  }}
                >
                  <img src={dest.image} alt={dest.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,46,31,0.75) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
                    <span style={{ background: "var(--color-mocha)", color: "white", fontSize: "10px", padding: "3px 8px", borderRadius: "2px", fontFamily: "var(--font-body)", letterSpacing: "0.08em" }}>{dest.tag}</span>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "white", marginTop: "6px" }}>{dest.name}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.65)", marginTop: "2px" }}>{dest.pairs} pairs available</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <StatsStrip />

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: "var(--color-cream)", padding: "96px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "16px" }}>
              How Pairlo Works
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 400, color: "var(--color-black)" }}>
              The matching engine<br />
              <em style={{ fontStyle: "italic", color: "var(--color-mocha)" }}>nobody else built</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
            {howItWorks.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 400, color: "var(--color-gray-200)", lineHeight: 1, flexShrink: 0 }}>{item.step}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 500, marginBottom: "10px" }}>{item.title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)", lineHeight: 1.75 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL BLEED IMAGE ── */}
      <section style={{ position: "relative", height: "420px", overflow: "hidden" }}>
        <img src="/car-rover.jpg" alt="Road trip" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(27,46,31,0.5)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 400, color: "white", marginBottom: "20px" }}>
              Your stay. Your car.<br />
              <em style={{ fontStyle: "italic", color: "var(--color-mocha-pale)" }}>Perfectly timed.</em>
            </h2>
            <Link to="/search">
              <span
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "var(--color-mocha)", color: "white",
                  padding: "14px 32px", borderRadius: "2px",
                  fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500,
                  cursor: "pointer", letterSpacing: "0.06em",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha-light)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha)")}
              >
                START SEARCHING <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PAIR OF THE WEEK ── */}
      <PairOfTheWeek />

      {/* ── TOOLS BAR ── */}
      <section style={{ background: "var(--color-cream)", borderTop: "1px solid var(--color-gray-200)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
          {[
            { icon: <Calculator size={16} />, label: "Trip Cost Calculator", sub: "See exactly what you'll pay", href: "/trip-calculator" },
            { icon: <HelpCircle size={16} />, label: "What's Your Pair Style?", sub: "Take the quiz → get matched", href: "/quiz" },
          ].map((tool) => (
            <Link key={tool.href} to={tool.href}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px", background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "16px 24px", cursor: "pointer", transition: "all 0.2s", minWidth: "240px" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-mocha)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(138,158,123,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gray-200)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "var(--color-mocha-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--color-mocha)" }}>
                  {tool.icon}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)" }}>{tool.label}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>{tool.sub}</p>
                </div>
              </div>
            </Link>
          ))}
          {/* Surprise Me — opens modal directly instead of navigating */}
          <div
            onClick={() => { const r = allPairs[Math.floor(Math.random() * allPairs.length)]; setSurprisePair(r); }}
            style={{ display: "flex", alignItems: "center", gap: "14px", background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "16px 24px", cursor: "pointer", transition: "all 0.2s", minWidth: "240px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-mocha)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(138,158,123,0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gray-200)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "var(--color-mocha-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--color-mocha)" }}>
              <Shuffle size={16} />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)" }}>Surprise Me</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>Random pair, curated for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: "var(--color-gray-100)", padding: "96px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "16px" }}>
              Real Travelers
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "var(--color-black)" }}>
              Don't take our word for it
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "24px" }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  border: "1px solid var(--color-gray-200)",
                  borderRadius: "4px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: "3px" }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} fill="var(--color-mocha)" color="var(--color-mocha)" />
                  ))}
                </div>
                {/* Quote */}
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "var(--color-black)",
                  lineHeight: 1.7,
                  flex: 1,
                }}>
                  "{t.quote}"
                </p>
                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "var(--color-mocha)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    color: "white",
                    flexShrink: 0,
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "var(--color-black)" }}>{t.name}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{ background: "var(--color-mocha)", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: "20px" }}>
          Launching October 2026
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 400, color: "white", marginBottom: "16px" }}>
          Be the first to pair.
        </h2>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(16px, 1.8vw, 22px)",
          fontStyle: "italic",
          color: "rgba(255,255,255,0.85)",
          marginBottom: "10px",
        }}>
          Your keys. Your wheels. One booking.
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "rgba(255,255,255,0.65)", maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Join the waitlist and get early access when Pairlo launches.
        </p>
        <div style={{ display: "flex", gap: "0", maxWidth: "440px", margin: "0 auto", overflow: "hidden", borderRadius: "2px" }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRight: "none",
              padding: "14px 18px",
              fontSize: "14px",
              color: "white",
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
          />
          <button
            style={{
              background: "white",
              color: "var(--color-mocha)",
              border: "none",
              padding: "14px 28px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.06em",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha-pale)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "white")}
          >
            JOIN
          </button>
        </div>
      </section>
      {/* ── STICKY MOBILE CTA ── */}
      <div className="mobile-sticky-cta" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 500, background: "white", borderTop: "1px solid var(--color-gray-200)", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", padding: "12px 16px", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-500)", marginBottom: "2px" }}>Ready to travel?</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 500, color: "var(--color-black)" }}>Find your pair</p>
        </div>
        <Link to="/search">
          <button style={{ background: "var(--color-mocha)", color: "white", border: "none", padding: "12px 24px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", whiteSpace: "nowrap" as const }}>
            SEARCH NOW
          </button>
        </Link>
      </div>
      <style>{`@media (max-width: 768px) { .mobile-sticky-cta { display: flex !important; } }`}</style>

      {/* ── SCROLL TO TOP ── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            width: "44px",
            height: "44px",
            borderRadius: "2px",
            background: "var(--color-mocha)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            zIndex: 200,
            transition: "background 0.2s, opacity 0.3s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha-light)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha)")}
        >
          <ChevronUp size={18} color="white" />
        </button>
      )}
    </div>
  );
}
