import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Calculator, Car, Bed, Share2, ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { allPairs } from "../lib/mock-data";

const DESTINATIONS = [
  { label: "Malibu, CA", id: "pair-1", carRate: 95 },
  { label: "Aspen, CO", id: "pair-2", carRate: 105 },
  { label: "Nashville, TN", id: "pair-3", carRate: 65 },
  { label: "Miami Beach, FL", id: "pair-4", carRate: 110 },
  { label: "New York, NY", id: "pair-5", carRate: 145 },
  { label: "Malibu Cliffside, CA", id: "pair-6", carRate: 120 },
];

const GROUP_PRESETS = [
  { label: "Solo", value: 1 },
  { label: "Couple", value: 2 },
  { label: "Small group (4)", value: 4 },
  { label: "Large group (6)", value: 6 },
];

function formatCurrency(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function TripCalculator() {
  const [, navigate] = useLocation();
  const [destIdx, setDestIdx] = useState(0);
  const [nights, setNights] = useState(3);
  const [group, setGroup] = useState(2);
  const [copied, setCopied] = useState(false);

  const dest = DESTINATIONS[destIdx];
  const pair = allPairs.find((p) => p.id === dest.id) ?? allPairs[0];

  const calc = useMemo(() => {
    const stayTotal = pair.stay.price * nights;
    const carDays = Math.max(nights, 1);
    const carTotal = dest.carRate * carDays;
    const bundleTotal = stayTotal + carTotal;
    const separateStay = pair.stay.price * nights * 1.15; // 15% markup
    const separateCar = dest.carRate * carDays * 1.22; // 22% markup
    const separateTotal = separateStay + separateCar;
    const savings = separateTotal - bundleTotal;
    const perPerson = bundleTotal / Math.max(group, 1);
    return { stayTotal, carTotal, bundleTotal, separateTotal, savings, perPerson, carDays };
  }, [pair, nights, dest, group]);

  const shareLink = () => {
    const url = `${window.location.origin}/trip-calculator?dest=${destIdx}&nights=${nights}&group=${group}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)", paddingTop: "72px" }}>
      {/* Header */}
      <div style={{ background: "var(--color-black)", padding: "48px 24px 40px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <Calculator size={26} color="var(--color-mocha)" />
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 500, color: "white", letterSpacing: "0.01em" }}>
              Trip Cost Calculator
            </h1>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
            See exactly what your trip costs — and how much you save by bundling.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }} className="calc-grid">

          {/* ── LEFT: INPUTS ── */}
          <div>
            <h2 style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-mocha)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "24px" }}>
              Trip Details
            </h2>

            {/* Destination */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)", display: "block", marginBottom: "10px" }}>
                Destination
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {DESTINATIONS.map((d, i) => (
                  <button
                    key={d.id}
                    onClick={() => setDestIdx(i)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "20px",
                      border: `1.5px solid ${destIdx === i ? "var(--color-mocha)" : "var(--color-gray-200)"}`,
                      background: destIdx === i ? "var(--color-mocha)" : "transparent",
                      color: destIdx === i ? "white" : "var(--color-gray-600)",
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: destIdx === i ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.18s",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nights slider */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)" }}>
                  Nights
                </label>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 500, color: "var(--color-mocha)" }}>
                  {nights}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={14}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--color-mocha)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>1 night</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>2 weeks</span>
              </div>
            </div>

            {/* Group size */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)", display: "block", marginBottom: "10px" }}>
                Group Size
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {GROUP_PRESETS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGroup(g.value)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "20px",
                      border: `1.5px solid ${group === g.value ? "var(--color-mocha)" : "var(--color-gray-200)"}`,
                      background: group === g.value ? "var(--color-mocha)" : "transparent",
                      color: group === g.value ? "white" : "var(--color-gray-600)",
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: group === g.value ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.18s",
                    }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected pair preview */}
            <div style={{ background: "var(--color-cream)", border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "16px", display: "flex", gap: "14px", alignItems: "center" }}>
              <img src={pair.stay.image} alt={pair.stay.name} style={{ width: "64px", height: "64px", borderRadius: "3px", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "var(--color-black)", marginBottom: "3px" }}>{pair.stay.name}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-500)", marginBottom: "3px" }}>+ {pair.car.name}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>{pair.stay.location}</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: BREAKDOWN ── */}
          <div>
            <h2 style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-mocha)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "24px" }}>
              Cost Breakdown
            </h2>

            {/* Bundle cost */}
            <div style={{ background: "var(--color-cream)", border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "20px", marginBottom: "16px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-mocha)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px", fontWeight: 600 }}>
                Pairlo Bundle
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Bed size={14} color="var(--color-gray-500)" />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-600)" }}>
                      {pair.stay.name} · {nights} nights
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)" }}>
                    {formatCurrency(calc.stayTotal)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Car size={14} color="var(--color-gray-500)" />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-600)" }}>
                      {pair.car.name} · {calc.carDays} days
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)" }}>
                    {formatCurrency(calc.carTotal)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>Pairlo service fee</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "#4ade80" }}>FREE</span>
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--color-gray-200)", marginTop: "16px", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)" }}>Bundle Total</span>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 500, color: "var(--color-black)" }}>
                    {formatCurrency(calc.bundleTotal)}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>
                    {formatCurrency(Math.round(calc.perPerson))} per person
                  </p>
                </div>
              </div>
            </div>

            {/* Savings */}
            <div style={{ background: "linear-gradient(135deg, #14532d, #166534)", borderRadius: "4px", padding: "18px 20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
                  You save vs. booking separately
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 500, color: "white" }}>
                  {formatCurrency(Math.round(calc.savings))}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>Separately</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.7)", textDecoration: "line-through" }}>
                  {formatCurrency(Math.round(calc.separateTotal))}
                </p>
              </div>
            </div>

            {/* Perks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              {["Pickup within 2 miles of your stay", "Timing synced to check-in", "One invoice, one support line"].map((perk) => (
                <div key={perk} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={13} color="#4ade80" />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-600)" }}>{perk}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate(`/checkout?pair=${pair.id}&nights=${nights}&days=${calc.carDays}`)}
                style={{ flex: 1, background: "var(--color-mocha)", color: "white", border: "none", padding: "14px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha-light)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha)")}
              >
                BOOK THIS PAIR <ArrowRight size={14} />
              </button>
              <button
                onClick={shareLink}
                style={{ background: "var(--color-cream)", color: "var(--color-black)", border: "1px solid var(--color-gray-200)", padding: "14px 18px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--color-mocha)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--color-gray-200)")}
              >
                {copied ? <><CheckCircle2 size={14} color="#4ade80" /> Copied!</> : <><Share2 size={14} /> Share</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
