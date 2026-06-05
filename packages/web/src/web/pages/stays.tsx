import { useState } from "react";
import { Link } from "wouter";
import { Star, MapPin, ArrowRight, Wifi, Car, Coffee } from "lucide-react";
import { allPairs } from "../lib/mock-data";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "WiFi": <Wifi size={14} />,
  "Parking": <Car size={14} />,
  "Breakfast": <Coffee size={14} />,
};

export default function StaysPage() {
  const [activeTag, setActiveTag] = useState("All");
  const tags = ["All", "Beach", "Mountain", "City", "Adventure", "Romantic"];

  // Deduplicate by hotel id, preserving the full pair so we can access stay.image
  const seen = new Set<string>();
  const allUnique = allPairs.filter((p) => {
    if (seen.has(p.hotel.id)) return false;
    seen.add(p.hotel.id);
    return true;
  });

  // Filter by active tag
  const unique = activeTag === "All"
    ? allUnique
    : allUnique.filter((p) => p.stay.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase())));

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)", paddingTop: "72px" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "420px", overflow: "hidden" }}>
        <img src="/stay-villa1.jpg" alt="Stays" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(27,46,31,0.75) 0%, rgba(27,46,31,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 10vw" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha-pale)", textTransform: "uppercase", marginBottom: "16px" }}>
              Handpicked Properties
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 400, color: "white", lineHeight: 1.1, maxWidth: "520px" }}>
              Stays that<br />
              <em style={{ fontStyle: "italic", color: "var(--color-mocha-pale)" }}>set the stage</em>
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "rgba(255,255,255,0.65)", marginTop: "20px", maxWidth: "400px", lineHeight: 1.7 }}>
              Every property is vetted for pairing potential — proximity, pickup, and polish.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <div style={{ background: "var(--color-black)", borderBottom: "1px solid rgba(255,255,255,0.08)", overflowX: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "0" }}>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              style={{
                padding: "16px 22px",
                border: "none",
                borderBottom: activeTag === t ? "2px solid var(--color-mocha)" : "2px solid transparent",
                background: "transparent",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: activeTag === t ? 600 : 400,
                color: activeTag === t ? "var(--color-mocha-pale)" : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                whiteSpace: "nowrap" as const,
                transition: "all 0.2s",
                letterSpacing: "0.04em",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── STAYS GRID ── */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "36px" }}>
          {unique.map((pair, i) => {
            const hotel = pair.hotel;
            const stayImage = pair.stay.image;
            return (
            <div
              key={hotel.id}
              style={{
                background: "white",
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                transition: "box-shadow 0.25s, transform 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 36px rgba(0,0,0,0.13)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
                <img
                  src={stayImage}
                  alt={hotel.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div style={{ position: "absolute", top: "14px", left: "14px" }}>
                  <span style={{ background: "var(--color-mocha)", color: "white", fontSize: "10px", padding: "4px 10px", borderRadius: "2px", fontFamily: "var(--font-body)", letterSpacing: "0.1em", fontWeight: 600 }}>
                    PAIR READY
                  </span>
                </div>
                <div style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(27,46,31,0.75)", borderRadius: "2px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Star size={11} fill="var(--color-mocha-pale)" color="var(--color-mocha-pale)" />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "white", fontWeight: 600 }}>{hotel.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 500, color: "var(--color-black)", marginBottom: "4px" }}>
                      {hotel.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={12} color="var(--color-mocha)" />
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>{hotel.location}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)", letterSpacing: "0.05em" }}>from</p>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--color-black)" }}>${hotel.pricePerNight}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>/night</p>
                  </div>
                </div>

                {/* Amenities */}
                <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                  {["WiFi", "Parking", "Breakfast"].map((a) => (
                    <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "var(--color-cream)", padding: "5px 10px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-600)" }}>
                      {AMENITY_ICONS[a]} {a}
                    </span>
                  ))}
                </div>

                <Link to="/search">
                  <button
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      padding: "13px",
                      background: "var(--color-black)",
                      color: "white",
                      border: "none",
                      borderRadius: "2px",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha)")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "var(--color-black)")}
                  >
                    VIEW PAIRS <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* ── QUALITY PROMISE ── */}
      <section style={{ background: "var(--color-mocha-pale)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "16px" }}>
            The Pairlo Promise
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,46px)", fontWeight: 400, color: "var(--color-black)", marginBottom: "16px" }}>
            Every stay. <em style={{ fontStyle: "italic", color: "var(--color-mocha)" }}>Vetted to pair.</em>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-gray-500)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.8 }}>
            We only list properties with confirmed car rental access nearby — so your pair is never just a booking, it's a guarantee.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", marginTop: "56px" }}>
            {[
              { n: "500+", l: "Vetted Properties" },
              { n: "98%", l: "Pair Match Rate" },
              { n: "<2mi", l: "Avg. Car Pickup" },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "44px", fontWeight: 400, color: "var(--color-mocha)" }}>{n}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)", letterSpacing: "0.08em", marginTop: "6px" }}>{l.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
