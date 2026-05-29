import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { X, Star, MapPin, Car, CheckCircle2, ArrowRight, Gauge, Fuel, Palette, Users, ChevronLeft, ChevronRight, ArrowDown, Share2 } from "lucide-react";
import { PairCardData } from "./pair-card";
import { PairScoreBadge } from "./pair-score-badge";

interface PairModalProps {
  pair: PairCardData;
  onClose: () => void;
}

export function PairModal({ pair, onClose }: PairModalProps) {
  const [, navigate] = useLocation();
  const [shareCopied, setShareCopied] = useState(false);
  const grandTotal = pair.stay.price * pair.totalNights + pair.car.price * pair.totalDays;

  const handleShare = () => {
    const url = `${window.location.origin}/trip/${pair.id}-${pair.totalNights}n`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };
  const separateTotal = (pair as any).separatePrice
    ? (pair as any).separatePrice * pair.totalNights + pair.car.price * pair.totalDays * 1.18
    : null;
  const savings = separateTotal ? Math.round(separateTotal - grandTotal) : null;

  const gallery: string[] = (pair.stay as any).gallery ?? [pair.stay.image];
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setActiveImg((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft") setActiveImg((i) => (i - 1 + gallery.length) % gallery.length);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, gallery.length]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(27,46,31,0.75)", backdropFilter: "blur(6px)" }} onClick={onClose} />

      {/* Modal */}
      <div
        style={{ position: "relative", background: "white", borderRadius: "6px", width: "100%", maxWidth: "880px", maxHeight: "92vh", overflow: "auto", boxShadow: "0 32px 100px rgba(0,0,0,0.4)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10, background: "rgba(27,46,31,0.6)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)", transition: "background 0.2s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(27,46,31,0.9)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(27,46,31,0.6)")}
        >
          <X size={16} color="white" />
        </button>

        {/* ── PHOTO GALLERY HERO ── */}
        <div style={{ position: "relative", height: "280px", overflow: "hidden", background: "#111" }}>
          {gallery.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={pair.stay.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === activeImg ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
          ))}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,46,31,0.7) 0%, transparent 50%)" }} />

          {/* Arrow nav */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s", zIndex: 5 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.4)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)")}
              >
                <ChevronLeft size={18} color="white" />
              </button>
              <button
                onClick={() => setActiveImg((i) => (i + 1) % gallery.length)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s", zIndex: 5 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.4)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)")}
              >
                <ChevronRight size={18} color="white" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          <div style={{ position: "absolute", bottom: "68px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 5 }}>
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                style={{ width: i === activeImg ? "20px" : "6px", height: "6px", borderRadius: "3px", background: i === activeImg ? "white" : "rgba(255,255,255,0.45)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 5 }}>
            {gallery.map((src, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{ width: "48px", height: "34px", borderRadius: "3px", overflow: "hidden", cursor: "pointer", border: i === activeImg ? "2px solid var(--color-mocha)" : "2px solid rgba(255,255,255,0.3)", transition: "border 0.2s", flexShrink: 0 }}
              >
                <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>

          {/* Stay info overlay */}
          <div style={{ position: "absolute", bottom: "56px", left: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ background: "rgba(27,46,31,0.75)", color: "white", fontSize: "10px", padding: "3px 10px", borderRadius: "2px", backdropFilter: "blur(4px)", fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}>STAY</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", padding: "3px 10px", borderRadius: "2px" }}>
                <Star size={11} fill="white" color="white" />
                <span style={{ fontSize: "12px", color: "white", fontFamily: "var(--font-body)", fontWeight: 500 }}>{pair.stay.rating}</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}>({pair.stay.reviews} reviews)</span>
              </div>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, color: "white", marginBottom: "3px" }}>{pair.stay.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <MapPin size={13} color="rgba(255,255,255,0.7)" />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}>{pair.stay.location}</span>
            </div>
          </div>
        </div>

        {/* Car image strip */}
        <div style={{ position: "relative", height: "90px", overflow: "hidden" }}>
          <img src={pair.car.image} alt={pair.car.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(27,46,31,0.72) 0%, rgba(27,46,31,0.2) 55%)" }} />
          <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "var(--color-mocha)", borderRadius: "20px", padding: "4px 14px", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 12px rgba(0,0,0,0.3)", zIndex: 5 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "white", fontWeight: 700, letterSpacing: "0.12em" }}>PAIRED WITH</span>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Car size={15} color="white" />
              <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "white", fontWeight: 400 }}>
                {(pair.car as any).year ? `${(pair.car as any).year} ` : ""}{pair.car.name}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)", marginLeft: "4px" }}>{pair.car.type}</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.92)", padding: "5px 12px", borderRadius: "2px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700, color: "var(--color-black)" }}>${pair.car.price}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-500)" }}>/day</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px", display: "grid", gridTemplateColumns: "1fr 280px", gap: "28px" }} className="modal-grid">
          {/* Left col */}
          <div>
            {/* Stay details */}
            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 500, marginBottom: "14px" }}>About This Stay</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
                {[
                  { label: "Bedrooms", value: `${pair.stay.beds}` },
                  { label: "Bathrooms", value: `${pair.stay.baths}` },
                  { label: "Sq Ft", value: (pair.stay as any).sqft ? `${((pair.stay as any).sqft).toLocaleString()}` : "—" },
                  { label: "Nights", value: `${pair.totalNights}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "var(--color-cream)", padding: "12px 10px", borderRadius: "3px", textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-500)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "5px" }}>{label}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 700, color: "var(--color-black)" }}>{value}</p>
                  </div>
                ))}
              </div>
              {(pair.stay as any).description && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-600)", lineHeight: 1.8, marginBottom: "16px" }}>
                  {(pair.stay as any).description}
                </p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: (pair.stay as any).amenities ? "16px" : "0" }}>
                {pair.stay.tags.map((tag) => (
                  <span key={tag} style={{ background: "var(--color-mocha-pale)", color: "var(--color-mocha)", fontSize: "12px", padding: "5px 12px", borderRadius: "2px", fontFamily: "var(--font-body)", fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
              {(pair.stay as any).amenities && (
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Amenities</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
                    {(pair.stay as any).amenities.map((a: string) => (
                      <div key={a} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <CheckCircle2 size={13} color="var(--color-mocha)" style={{ flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-600)" }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Car details */}
            <div style={{ borderTop: "1px solid var(--color-gray-200)", paddingTop: "24px", marginBottom: "28px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 500, marginBottom: "14px" }}>Paired Car</h3>
              <div style={{ position: "relative", height: "200px", borderRadius: "4px", overflow: "hidden", marginBottom: "14px" }}>
                <img src={pair.car.image} alt={pair.car.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,46,31,0.85) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ background: "var(--color-mocha)", color: "white", fontSize: "10px", padding: "3px 9px", borderRadius: "2px", fontFamily: "var(--font-body)", letterSpacing: "0.08em", display: "inline-block", marginBottom: "6px" }}>
                        {pair.car.type.toUpperCase()}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Car size={14} color="white" />
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "white", fontWeight: 400 }}>
                          {(pair.car as any).year ? `${(pair.car as any).year} ` : ""}{pair.car.name}
                        </span>
                      </div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.93)", padding: "8px 14px", borderRadius: "2px", textAlign: "right" }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "18px", fontWeight: 700, color: "var(--color-black)" }}>${pair.car.price}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-500)" }}>/day · {pair.totalDays} days</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                {[
                  { icon: <Gauge size={12} color="var(--color-mocha)" />, label: "Engine", value: (pair.car as any).engine || pair.car.type },
                  { icon: <Fuel size={12} color="var(--color-mocha)" />, label: "Mileage", value: (pair.car as any).mileage || "Unlimited" },
                  { icon: <Palette size={12} color="var(--color-mocha)" />, label: "Color", value: (pair.car as any).color || "—" },
                  { icon: <Users size={12} color="var(--color-mocha)" />, label: "Seats", value: (pair.car as any).seats ? `${(pair.car as any).seats} passengers` : "—" },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ background: "var(--color-cream)", padding: "10px 12px", borderRadius: "3px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{ marginTop: "2px", flexShrink: 0 }}>{icon}</div>
                    <div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-gray-400)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>{label}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "var(--color-black)", lineHeight: 1.3 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {pair.car.features.map((f) => (
                  <span key={f} style={{ display: "flex", alignItems: "center", gap: "5px", background: "var(--color-cream)", border: "1px solid var(--color-gray-200)", fontSize: "12px", color: "var(--color-gray-600)", fontFamily: "var(--font-body)", padding: "5px 12px", borderRadius: "2px" }}>
                    <CheckCircle2 size={12} color="var(--color-mocha)" /> {f}
                  </span>
                ))}
              </div>

              {/* Why this car */}
              {(pair as any).carMatchReason && (
                <div style={{ background: "rgba(138,158,123,0.06)", border: "1px solid rgba(138,158,123,0.18)", borderRadius: "3px", padding: "14px 16px", marginTop: "18px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>🔑</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-mocha)", marginBottom: "5px" }}>Why this car</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-600)", lineHeight: 1.65 }}>{(pair as any).carMatchReason}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Why this pair */}
            <div style={{ borderTop: "1px solid var(--color-gray-200)", paddingTop: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 500, marginBottom: "14px" }}>Why this pair works</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Pickup location is within 1.2 miles of the property",
                  "Car return matches your checkout time window",
                  "Both bookings covered under Pairlo guarantee",
                ].map((reason) => (
                  <div key={reason} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle2 size={15} color="var(--color-mocha)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-600)", lineHeight: 1.6 }}>{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col — booking summary */}
          <div>
            <div style={{ border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "24px", position: "sticky", top: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", color: "var(--color-mocha)", textTransform: "uppercase" }}>Pair Summary</p>
                <PairScoreBadge
                  stayPrice={pair.stay.price}
                  carPrice={pair.car.price}
                  separatePrice={(pair as any).separatePrice}
                  totalNights={pair.totalNights}
                  stayTags={pair.stay.tags}
                  carType={pair.car.type}
                  stayRating={pair.stay.rating}
                  badge={(pair as any).badge}
                  size="sm"
                />
              </div>

              {/* Savings callout */}
              {savings && savings > 0 && (
                <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0", borderRadius: "3px", padding: "10px 12px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ArrowDown size={14} color="#16a34a" />
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, color: "#15803d" }}>Save ${savings}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#16a34a" }}>vs booking separately</p>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>Stay · {pair.totalNights} nights</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500 }}>${(pair.stay.price * pair.totalNights).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>Car · {pair.totalDays} days</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500 }}>${(pair.car.price * pair.totalDays).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>Pairlo service fee</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--color-mocha)" }}>Free</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--color-gray-200)", paddingTop: "16px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>Total</span>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 500 }}>${grandTotal.toLocaleString()}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>taxes not included</p>
                </div>
              </div>

              <button
                onClick={() => { onClose(); navigate(`/checkout?pair=${pair.id}&nights=${pair.totalNights}&days=${pair.totalDays}`); }}
                style={{ width: "100%", background: "var(--color-mocha)", color: "white", border: "none", padding: "14px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s", marginBottom: "10px" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha-light)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha)")}
              >
                BOOK THIS PAIR <ArrowRight size={15} />
              </button>

              <button
                onClick={handleShare}
                style={{ width: "100%", background: "transparent", color: "var(--color-gray-600)", border: "1px solid var(--color-gray-200)", padding: "10px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", transition: "all 0.2s", marginBottom: "10px" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-mocha)"; (e.currentTarget as HTMLElement).style.color = "var(--color-mocha)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gray-200)"; (e.currentTarget as HTMLElement).style.color = "var(--color-gray-600)"; }}
              >
                <Share2 size={13} />
                {shareCopied ? "LINK COPIED!" : "SHARE THIS PAIR"}
              </button>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)", textAlign: "center", lineHeight: 1.6 }}>
                Free cancellation up to 48 hrs before check-in
              </p>

              {/* Pairlo Guarantee seal */}
              <div style={{
                marginTop: "18px",
                background: "linear-gradient(135deg, #14532d, #166534)",
                borderRadius: "4px",
                padding: "14px 16px",
                border: "1px solid rgba(134,239,172,0.2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "18px" }}>🛡️</span>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 700, color: "#86efac", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Pairlo Guarantee
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {[
                    "Pickup within 2 miles of your stay",
                    "Timing synced to your check-in",
                    "One invoice, one support line",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                      <span style={{ color: "#4ade80", fontSize: "11px", lineHeight: "18px", flexShrink: 0 }}>✓</span>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE STICKY BOOK BAR ── */}
        <div className="mobile-book-bar" style={{ display: "none", position: "sticky", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid var(--color-gray-200)", padding: "12px 16px", alignItems: "center", justifyContent: "space-between", zIndex: 20 }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>{pair.totalNights}n + {pair.totalDays}d</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 500 }}>${grandTotal.toLocaleString()}</p>
          </div>
          <button
            onClick={() => { onClose(); navigate(`/checkout?pair=${pair.id}&nights=${pair.totalNights}&days=${pair.totalDays}`); }}
            style={{ background: "var(--color-mocha)", color: "white", border: "none", padding: "12px 24px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em" }}
          >
            Book Pair
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .modal-grid { grid-template-columns: 1fr !important; }
          .mobile-book-bar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
