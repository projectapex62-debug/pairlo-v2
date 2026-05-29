import { Link } from "wouter";
import { Check, ArrowRight, Star } from "lucide-react";

const tiers = [
  {
    name: "Explorer",
    level: "01",
    nights: "0–9 nights/year",
    color: "var(--color-gray-600)",
    bg: "var(--color-cream)",
    border: "var(--color-gray-200)",
    perks: [
      "Early access to new destinations",
      "5% off car rental upgrades",
      "Pairlo member pricing",
      "24/7 chat support",
    ],
  },
  {
    name: "Roamer",
    level: "02",
    nights: "10–29 nights/year",
    color: "var(--color-mocha)",
    bg: "var(--color-mocha-pale)",
    border: "var(--color-mocha-light)",
    perks: [
      "Everything in Explorer",
      "10% off all bookings",
      "Free car class upgrade (1x/year)",
      "Priority pair matching",
      "Flexible cancellation",
    ],
    featured: true,
  },
  {
    name: "Wanderer",
    level: "03",
    nights: "30+ nights/year",
    color: "white",
    bg: "var(--color-black)",
    border: "var(--color-mocha)",
    perks: [
      "Everything in Roamer",
      "Complimentary room upgrades",
      "Dedicated travel concierge",
      "Exclusive airport transfers",
      "VIP partner experiences",
      "Annual bonus nights",
    ],
    dark: true,
  },
];

const faqs = [
  { q: "How do I earn nights?", a: "Every night you stay through Pairlo counts toward your annual total, resetting each January 1st." },
  { q: "Do car rentals count?", a: "Car rental days count as 0.5 nights each toward your tier total when booked as part of a pair." },
  { q: "Can I lose my tier status?", a: "Status is locked for 12 months once earned. You'll keep your perks until the following year's reset." },
  { q: "Is there a points system?", a: "Pairlo Rewards is tier-based, not points-based — your perks come from loyalty, not math." },
];

export default function RewardsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)", paddingTop: "72px" }}>

      {/* ── HERO ── */}
      <section style={{ background: "var(--color-black)", padding: "80px 24px 96px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha-light)", textTransform: "uppercase", marginBottom: "20px" }}>
          Pairlo Rewards
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px,6vw,72px)", fontWeight: 400, color: "white", lineHeight: 1.05, marginBottom: "20px" }}>
          Travel more.<br />
          <em style={{ fontStyle: "italic", color: "var(--color-mocha-pale)" }}>Earn more.</em>
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(255,255,255,0.55)", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.75 }}>
          Every stay, every pair, every journey builds toward benefits that matter. Three tiers. Real perks.
        </p>
        <Link to="/search">
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "var(--color-mocha)", color: "white",
              padding: "15px 36px", borderRadius: "2px",
              fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600,
              cursor: "pointer", letterSpacing: "0.07em", transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha-light)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha)")}
          >
            START EARNING <ArrowRight size={16} />
          </span>
        </Link>
      </section>

      {/* ── TIER PROGRESS BAR ── */}
      <div style={{ background: "rgba(27,46,31,0.96)", padding: "20px 24px", overflowX: "auto" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", alignItems: "center", gap: "0" }}>
          {["Explorer", "Roamer", "Wanderer"].map((t, i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", flex: i < 2 ? "1" : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: i === 0 ? "var(--color-mocha)" : "rgba(255,255,255,0.12)",
                  border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {i === 0 ? <Star size={14} fill="white" color="white" /> : <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{i + 1}</span>}
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: i === 0 ? "var(--color-mocha-pale)" : "rgba(255,255,255,0.35)", letterSpacing: "0.08em", whiteSpace: "nowrap" as const }}>{t.toUpperCase()}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)", margin: "0 12px", marginBottom: "20px" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── TIERS ── */}
      <section style={{ background: "var(--color-cream)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,46px)", fontWeight: 400 }}>
              Choose your journey
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>
            {tiers.map((tier) => (
              <div
                key={tier.name}
                style={{
                  background: tier.bg,
                  border: `1px solid ${tier.border}`,
                  borderRadius: "4px",
                  padding: "40px 32px",
                  position: "relative",
                  overflow: "hidden",
                  ...(tier.featured ? { transform: "scale(1.03)", boxShadow: "0 12px 48px rgba(138,158,123,0.18)" } : {}),
                }}
              >
                {tier.featured && (
                  <div style={{ position: "absolute", top: "16px", right: "16px", background: "var(--color-mocha)", color: "white", fontSize: "10px", padding: "4px 10px", borderRadius: "2px", fontFamily: "var(--font-body)", letterSpacing: "0.1em", fontWeight: 700 }}>
                    MOST POPULAR
                  </div>
                )}
                <span style={{ fontFamily: "var(--font-display)", fontSize: "64px", fontWeight: 400, color: tier.dark ? "rgba(255,255,255,0.07)" : "var(--color-gray-100)", position: "absolute", top: "16px", left: "24px", lineHeight: 1 }}>{tier.level}</span>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", color: tier.color, textTransform: "uppercase", marginBottom: "8px", opacity: tier.dark ? 0.7 : 1 }}>
                    {tier.nights}
                  </p>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 400, color: tier.dark ? "white" : "var(--color-black)", marginBottom: "28px" }}>
                    {tier.name}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {tier.perks.map((perk) => (
                      <div key={perk} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <Check size={15} color={tier.dark ? "var(--color-mocha-light)" : "var(--color-mocha)"} style={{ marginTop: "1px", flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: tier.dark ? "rgba(255,255,255,0.75)" : "var(--color-gray-600)", lineHeight: 1.5 }}>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TIERS WORK ── */}
      <section style={{ background: "var(--color-white)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,46px)", fontWeight: 400, textAlign: "center", marginBottom: "56px" }}>
            How it <em style={{ fontStyle: "italic", color: "var(--color-mocha)" }}>works</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px" }}>
            {[
              { step: "01", title: "Book a Pair", desc: "Every stay+car booking earns toward your annual night count." },
              { step: "02", title: "Hit Your Tier", desc: "Hit 10 nights to unlock Roamer, 30 for Wanderer — no complex math." },
              { step: "03", title: "Perks Activate", desc: "Your new tier kicks in immediately and lasts the full year." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: "flex", gap: "18px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "52px", fontWeight: 400, color: "var(--color-gray-100)", lineHeight: 1, flexShrink: 0 }}>{step}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "8px" }}>{title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)", lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--color-cream)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,3vw,40px)", fontWeight: 400, marginBottom: "48px" }}>
            Questions about rewards
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderTop: "1px solid var(--color-gray-200)", padding: "24px 0" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 500, marginBottom: "10px", color: "var(--color-black)" }}>{faq.q}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)", lineHeight: 1.75 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
