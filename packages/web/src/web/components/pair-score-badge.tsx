import { useState } from "react";
import { computePairScore, getScoreColor, getScoreLabel, PairScoreBreakdown } from "../lib/pair-score";
import { MapPin, DollarSign, Sparkles, TrendingUp, Navigation } from "lucide-react";

interface EngineScoreShape {
  pairScore:      number;
  proximityScore: number;
  dateScore:      number;
  priceScore:     number;
  styleScore:     number;
  distanceKm:     number;
}

interface PairScoreBadgeProps {
  stayPrice: number;
  carPrice: number;
  separatePrice: number;
  totalNights: number;
  stayTags: string[];
  carType: string;
  stayRating: number;
  badge?: string;
  size?: "sm" | "md" | "lg";
  /** When present, engine score overrides the UI-computed score */
  engineScore?: EngineScoreShape;
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ flex: 1, height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value * 10}%`, background: color, borderRadius: "2px", transition: "width 0.6s ease" }} />
    </div>
  );
}

export function PairScoreBadge({ stayPrice, carPrice, separatePrice, totalNights, stayTags, carType, stayRating, badge, size = "md", engineScore }: PairScoreBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Use real engine score if available, fall back to UI-computed score
  const uiScores = computePairScore({ stayPrice, carPrice, separatePrice, totalNights, stayTags, carType, stayRating, badge });
  const displayScore = engineScore ? engineScore.pairScore : uiScores.overall;
  const color = getScoreColor(displayScore);
  const label = getScoreLabel(displayScore);

  // Tooltip dimensions: engine score shows its 4 real dimensions, UI score shows UI dimensions
  const dimensions = engineScore ? [
    { key: "proximity",  label: "Proximity",     icon: <Navigation size={11} />, value: engineScore.proximityScore },
    { key: "dateAlign",  label: "Date Alignment", icon: <TrendingUp size={11} />, value: engineScore.dateScore },
    { key: "priceValue", label: "Price Value",    icon: <DollarSign size={11} />, value: engineScore.priceScore },
    { key: "styleMatch", label: "Style Match",    icon: <Sparkles size={11} />,  value: engineScore.styleScore },
  ] : [
    { key: "locationSync", label: "Location Sync", icon: <MapPin size={11} />, value: uiScores.locationSync },
    { key: "styleHarmony", label: "Style Harmony", icon: <Sparkles size={11} />, value: uiScores.styleHarmony },
    { key: "priceMatch",   label: "Price Balance", icon: <DollarSign size={11} />, value: uiScores.priceMatch },
    { key: "value",        label: "Value Score",   icon: <TrendingUp size={11} />, value: uiScores.value },
  ];

  const sizes = {
    sm: { outer: 40, fontSize: "13px", labelSize: "9px" },
    md: { outer: 52, fontSize: "16px", labelSize: "10px" },
    lg: { outer: 68, fontSize: "21px", labelSize: "11px" },
  };
  const s = sizes[size];

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Badge */}
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: s.outer,
          height: s.outer,
          borderRadius: "50%",
          background: `${color}15`,
          border: `2px solid ${color}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: "var(--font-display)", fontSize: s.fontSize, fontWeight: 600, color, lineHeight: 1 }}>
          {displayScore}
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: s.labelSize, color, letterSpacing: "0.04em", lineHeight: 1.2, marginTop: "2px" }}>
          SCORE
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            background: "white",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "8px",
            padding: "16px",
            width: "220px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
            pointerEvents: "none",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(0,0,0,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {engineScore ? "Engine Score" : "Pair Score"}
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", color, fontWeight: 600, lineHeight: 1 }}>
                {displayScore}<span style={{ fontSize: "13px", color: "rgba(0,0,0,0.35)" }}>/10</span>
              </p>
              {engineScore && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.35)", marginTop: "2px" }}>
                  {engineScore.distanceKm.toFixed(1)} km pickup distance
                </p>
              )}
            </div>
            <span style={{ background: `${color}15`, color, fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", letterSpacing: "0.04em" }}>
              {label}
            </span>
          </div>

          {/* Dimension bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {dimensions.map((d) => (
              <div key={d.key}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "rgba(0,0,0,0.55)", fontFamily: "var(--font-body)", fontSize: "11px" }}>
                    {d.icon} {d.label}
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color }}>{d.value}</span>
                </div>
                <ScoreBar value={d.value} color={color} />
              </div>
            ))}
          </div>

          {/* Tip */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.35)", marginTop: "12px", lineHeight: 1.5 }}>
            Pairlo's proprietary match score — timing, style, location & value combined.
          </p>

          {/* Arrow */}
          <div style={{ position: "absolute", bottom: "-6px", left: "50%", transform: "translateX(-50%) rotate(45deg)", width: "10px", height: "10px", background: "white", border: "1px solid rgba(0,0,0,0.1)", borderTop: "none", borderLeft: "none" }} />
        </div>
      )}
    </div>
  );
}

// Compact inline version for cards
export function PairScoreInline({ score, size = "sm" }: { score: number; size?: "sm" | "md" }) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: `${color}12`, border: `1px solid ${color}30`, borderRadius: "20px", padding: "3px 9px" }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: size === "sm" ? "11px" : "13px", fontWeight: 700, color }}>{score}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: `${color}cc`, letterSpacing: "0.04em" }}>{label}</span>
    </div>
  );
}
