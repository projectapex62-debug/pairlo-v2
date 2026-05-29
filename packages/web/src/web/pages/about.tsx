import { Link } from "wouter";
import { ArrowRight, Zap, MapPin, Clock } from "lucide-react";

const values = [
  {
    icon: <Zap size={20} color="var(--color-mocha)" />,
    title: "Matching, not searching",
    desc: "We built an engine that understands proximity, timing, and logistics — so you don't have to coordinate two bookings manually.",
  },
  {
    icon: <MapPin size={20} color="var(--color-mocha)" />,
    title: "Location-aware pairing",
    desc: "Your hotel and car rental are matched by distance — never more than 2 miles apart. Pickup is always nearby.",
  },
  {
    icon: <Clock size={20} color="var(--color-mocha)" />,
    title: "Timing that clicks",
    desc: "Check-in and car pickup times are synchronized. You land, you go. No juggling confirmation emails.",
  },
];

const team = [
  { name: "Javon Lawhorn", role: "Founder & CEO", bg: "var(--color-mocha)" },
  { name: "Lawrence Lawhorn", role: "Co-Founder & CTO", bg: "var(--color-black)" },

];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)", paddingTop: "72px" }}>

      {/* ── HERO ── */}
      <section style={{ background: "var(--color-black)", padding: "100px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha-light)", textTransform: "uppercase", marginBottom: "20px" }}>
          Our Story
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,6vw,72px)", fontWeight: 400, color: "white", lineHeight: 1.08, maxWidth: "800px", margin: "0 auto 24px" }}>
          We were tired of<br />
          <em style={{ fontStyle: "italic", color: "var(--color-mocha-pale)" }}>booking twice.</em>
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(255,255,255,0.55)", maxWidth: "580px", margin: "0 auto", lineHeight: 1.8 }}>
          Every trip used to mean two separate searches, two separate confirmation emails, and hoping the rental counter was near the hotel. We built Pairlo to fix that — permanently.
        </p>
      </section>

      {/* ── ORIGIN STORY ── */}
      <section style={{ padding: "96px 24px", background: "var(--color-cream)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "16px" }}>
              Founded 2025
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 400, marginBottom: "24px", lineHeight: 1.15 }}>
              One missed shuttle.<br />
              One idea.
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-gray-500)", lineHeight: 1.85, marginBottom: "20px" }}>
              Our founder missed a rental pickup because check-in ran late and the counter was across town. A 3-hour delay, a blown itinerary, a lesson learned.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-gray-500)", lineHeight: 1.85, marginBottom: "32px" }}>
              That trip became a whiteboard sketch, then a prototype, then Pairlo — a platform that treats your hotel and your car as a single, synchronized booking.
            </p>
            <Link to="/search">
              <span
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600,
                  color: "var(--color-mocha)", cursor: "pointer", letterSpacing: "0.04em",
                }}
              >
                Try it yourself <ArrowRight size={14} />
              </span>
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <img src="/dest-city.jpg" alt="City" style={{ width: "100%", height: "360px", objectFit: "cover", borderRadius: "4px" }} />
            <div style={{
              position: "absolute", bottom: "-20px", left: "-20px",
              background: "var(--color-black)", padding: "24px 28px", borderRadius: "4px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 400, color: "white" }}>2025</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>FOUNDED</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: "var(--color-white)", padding: "96px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "12px" }}>
              What We Stand For
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,46px)", fontWeight: 400 }}>
              Built on one principle
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
            {values.map(({ icon, title, desc }) => (
              <div key={title} style={{ borderLeft: "3px solid var(--color-mocha-pale)", paddingLeft: "28px" }}>
                <div style={{ marginBottom: "16px" }}>{icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 500, marginBottom: "12px", color: "var(--color-black)" }}>{title}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)", lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: "var(--color-cream)", padding: "96px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "12px" }}>
              The People
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,46px)", fontWeight: 400 }}>
              Built by travelers
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "28px" }}>
            {team.map(({ name, role, bg }) => (
              <div key={name} style={{ background: "white", borderRadius: "4px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ height: "180px", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "52px", fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>
                    {name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--color-black)", marginBottom: "4px" }}>{name}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-mocha)", letterSpacing: "0.04em" }}>{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "var(--color-mocha)", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: "white", marginBottom: "20px" }}>
          Ready to pair?
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "rgba(255,255,255,0.7)", maxWidth: "440px", margin: "0 auto 36px", lineHeight: 1.7 }}>
          Join the waitlist and be among the first to experience travel without the booking chaos.
        </p>
        <Link to="/contact">
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "white", color: "var(--color-mocha)",
              padding: "15px 36px", borderRadius: "2px",
              fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.07em", transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
          >
            GET IN TOUCH <ArrowRight size={16} />
          </span>
        </Link>
      </section>
    </div>
  );
}
