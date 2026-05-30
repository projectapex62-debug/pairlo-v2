import { useState } from "react";
import { Link } from "wouter";
import { Instagram, Twitter, Facebook } from "lucide-react";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"];

export function Footer() {
  const [currency, setCurrency] = useState("USD");
  return (
    <footer style={{ background: "var(--color-black)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 500,
                color: "white",
                letterSpacing: "0.05em",
              }}
            >
              Pairlo
            </span>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}
            >
              One Search. Two Keys.<br />Zero Hassle.
            </p>
            <div className="mt-5 flex gap-3">
              {([
                { Icon: Instagram, href: "https://instagram.com/pairlo.co", label: "Instagram" },
                { Icon: Twitter, href: "https://x.com/pairloco", label: "X / Twitter" },
                { Icon: Facebook, href: "https://facebook.com/pairlo", label: "Facebook" },
              ] as { Icon: React.FC<{ size: number; color: string }>; href: string; label: string }[]).map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  style={{
                    width: "34px", height: "34px", borderRadius: "2px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-mocha)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(138,158,123,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <Icon size={14} color="rgba(255,255,255,0.5)" />
                </a>
              ) as any)}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)" }}>
              Explore
            </p>
            {[
              { href: "/search", label: "Search Pairs" },
              { href: "/stays", label: "Vacation Stays" },
              { href: "/blog", label: "Travel Journal" },
              { href: "/about", label: "About Pairlo" },
            ].map((l) => (
              <Link key={l.href} to={l.href}>
                <span
                  className="block text-sm mb-3 cursor-pointer"
                  style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-mocha-light)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
                >
                  {l.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)" }}>
              Company
            </p>
            {[
              { href: "/rewards", label: "Rewards" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.href} to={l.href}>
                <span
                  className="block text-sm mb-3 cursor-pointer"
                  style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-mocha-light)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
                >
                  {l.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)" }}>
              Launching October 2026
            </p>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
              Be first to know when we go live.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "2px",
                  padding: "10px 12px",
                  fontSize: "13px",
                  color: "white",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                }}
              />
              <button
                style={{
                  background: "var(--color-mocha)",
                  color: "white",
                  border: "none",
                  borderRadius: "2px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Notify
              </button>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-4">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-body)" }}>
              © 2026 Pairlo. All rights reserved.
            </p>
            {/* Currency switcher */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-body)" }}>
                Currency
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "2px",
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  outline: "none",
                  appearance: "none" as const,
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c} style={{ background: "#1a1a1a" }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map((t) => (
              <Link key={t.href} to={t.href}>
                <span
                  className="text-xs cursor-pointer"
                  style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-body)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-mocha-light)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.25)")}
                >
                  {t.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
