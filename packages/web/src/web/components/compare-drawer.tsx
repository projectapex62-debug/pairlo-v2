import { useState, useEffect } from "react";
import { X, Star, Car, BedDouble, Bath, Zap, ArrowDown, ShieldCheck } from "lucide-react";
import { getCompare, clearCompare, COMPARE_EVENT } from "../lib/compare";
import { allPairs } from "../lib/mock-data";
import type { PairCardData } from "./pair-card";

function Row({ label, a, b }: { label: string; a: React.ReactNode; b: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--color-gray-200)" }}>
      <div style={{ padding: "12px 16px", borderRight: "1px solid var(--color-gray-200)", display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-400)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-black)", fontWeight: 500 }}>{a}</span>
      </div>
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-400)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-black)", fontWeight: 500 }}>{b}</span>
      </div>
    </div>
  );
}

export function CompareDrawer() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const handler = () => setIds(getCompare());
    window.addEventListener(COMPARE_EVENT, handler);
    return () => window.removeEventListener(COMPARE_EVENT, handler);
  }, []);

  const pairs = ids
    .map((id) => (allPairs as any[]).find((p) => p.id === id))
    .filter(Boolean) as PairCardData[];

  const visible = pairs.length > 0;

  if (!visible) return null;

  const [a, b] = pairs;

  const totalA = a ? a.stay.price * a.totalNights + a.car.price * a.totalDays : 0;
  const totalB = b ? b.stay.price * b.totalNights + b.car.price * b.totalDays : 0;
  const cheaperIdx = b && totalA !== totalB ? (totalA < totalB ? 0 : 1) : -1;

  return (
    <>
      {/* Backdrop when 2 selected and expanded */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
      `}</style>

      {/* Floating compare bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 500,
        animation: "slideUp 0.3s ease",
      }}>
        {/* Full comparison table — only when 2 selected */}
        {pairs.length === 2 && (
          <div style={{
            background: "white",
            borderTop: "2px solid var(--color-mocha)",
            maxHeight: "70vh",
            overflow: "auto",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
          }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", position: "sticky", top: 0, zIndex: 5 }}>
              {pairs.map((pair, i) => {
                const total = i === 0 ? totalA : totalB;
                const isCheaper = cheaperIdx === i;
                return (
                  <div
                    key={pair.id}
                    style={{
                      background: isCheaper ? "rgba(138,158,123,0.06)" : "white",
                      borderRight: i === 0 ? "1px solid var(--color-gray-200)" : "none",
                      borderBottom: "1px solid var(--color-gray-200)",
                      padding: "16px",
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={pair.stay.image}
                      alt={pair.stay.name}
                      style={{ width: "56px", height: "42px", borderRadius: "2px", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pair.stay.name}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-500)", marginTop: "1px" }}>{pair.stay.location}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, color: isCheaper ? "var(--color-mocha)" : "var(--color-black)" }}>
                          ${total.toLocaleString()}
                        </span>
                        {isCheaper && (
                          <span style={{ background: "var(--color-mocha)", color: "white", fontSize: "9px", fontFamily: "var(--font-body)", fontWeight: 700, padding: "2px 6px", borderRadius: "2px", letterSpacing: "0.06em" }}>
                            BETTER VALUE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparison rows */}
            <Row
              label="Rating"
              a={<span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Star size={12} fill="var(--color-mocha)" color="var(--color-mocha)" /> {a.stay.rating} ({a.stay.reviews} reviews)</span>}
              b={b ? <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Star size={12} fill="var(--color-mocha)" color="var(--color-mocha)" /> {b.stay.rating} ({b.stay.reviews} reviews)</span> : "—"}
            />
            <Row
              label="Bedrooms / Baths"
              a={<span style={{ display: "flex", alignItems: "center", gap: "8px" }}><BedDouble size={12} /> {a.stay.beds} beds <Bath size={12} /> {a.stay.baths} baths</span>}
              b={b ? <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><BedDouble size={12} /> {b.stay.beds} beds <Bath size={12} /> {b.stay.baths} baths</span> : "—"}
            />
            <Row
              label="Square Footage"
              a={(a.stay as any).sqft ? `${(a.stay as any).sqft.toLocaleString()} sqft` : "—"}
              b={b && (b.stay as any).sqft ? `${(b.stay as any).sqft.toLocaleString()} sqft` : "—"}
            />
            <Row
              label="Stay / night"
              a={`$${a.stay.price}/night`}
              b={b ? `$${b.stay.price}/night` : "—"}
            />
            <Row
              label="Car"
              a={<span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Car size={12} /> {a.car.name}</span>}
              b={b ? <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Car size={12} /> {b.car.name}</span> : "—"}
            />
            <Row
              label="Car type / day"
              a={`${a.car.type} · $${a.car.price}/day`}
              b={b ? `${b.car.type} · $${b.car.price}/day` : "—"}
            />
            <Row
              label="Nights + Days"
              a={`${a.totalNights}n + ${a.totalDays}d`}
              b={b ? `${b.totalNights}n + ${b.totalDays}d` : "—"}
            />
            <Row
              label="Savings vs. separate"
              a={(() => {
                const sep = (a as any).separatePrice ? (a as any).separatePrice * a.totalNights + a.car.price * a.totalDays * 1.18 : null;
                const s = sep ? Math.round(sep - totalA) : null;
                return s && s > 0 ? <span style={{ color: "#15803d", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}><ArrowDown size={12} color="#15803d" /> ${s} saved</span> : "—";
              })()}
              b={(() => {
                if (!b) return "—";
                const sep = (b as any).separatePrice ? (b as any).separatePrice * b.totalNights + b.car.price * b.totalDays * 1.18 : null;
                const s = sep ? Math.round(sep - totalB) : null;
                return s && s > 0 ? <span style={{ color: "#15803d", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}><ArrowDown size={12} color="#15803d" /> ${s} saved</span> : "—";
              })()}
            />
          </div>
        )}

        {/* Bottom bar */}
        <div style={{
          background: "var(--color-black)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Zap size={13} fill="var(--color-mocha)" color="var(--color-mocha)" />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "white" }}>
                Comparing {pairs.length}/2 pairs
              </span>
            </div>
            {pairs.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <img src={p.stay.image} alt="" style={{ width: "28px", height: "21px", borderRadius: "2px", objectFit: "cover" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.65)" }}>
                  {p.stay.name}
                </span>
              </div>
            ))}
            {pairs.length === 1 && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                Select one more to compare
              </span>
            )}
          </div>
          <button
            onClick={() => { clearCompare(); setIds([]); }}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "2px",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              padding: "6px 14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
          >
            <X size={12} /> Clear
          </button>
        </div>
      </div>
    </>
  );
}
