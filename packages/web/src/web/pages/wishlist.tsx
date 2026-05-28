import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Heart, Trash2, ArrowRight, Search } from "lucide-react";
import { getWishlist, removeFromWishlist } from "../lib/wishlist";
import { allPairs } from "../lib/mock-data";
import { PairCard } from "../components/pair-card";

export default function Wishlist() {
  const [, navigate] = useLocation();
  const [ids, setIds] = useState<string[]>(() => getWishlist());

  useEffect(() => {
    const refresh = () => setIds(getWishlist());
    window.addEventListener("pairlo-wishlist-change", refresh);
    return () => window.removeEventListener("pairlo-wishlist-change", refresh);
  }, []);

  const pairs = allPairs.filter((p) => ids.includes(p.id));

  const clearAll = () => {
    ids.forEach((id) => removeFromWishlist(id));
    setIds([]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)", paddingTop: "72px" }}>
      {/* Hero */}
      <div style={{ background: "var(--color-black)", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
            <Heart size={28} color="#e8684a" fill="#e8684a" />
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 500, color: "white", letterSpacing: "0.02em" }}>
              Saved Pairs
            </h1>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "rgba(255,255,255,0.5)" }}>
            {pairs.length === 0
              ? "Your wishlist is empty — start exploring to save pairs."
              : `${pairs.length} pair${pairs.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        {pairs.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Heart size={32} color="var(--color-gray-400)" />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 500, color: "var(--color-black)", marginBottom: "12px" }}>
              No saved pairs yet
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)", marginBottom: "32px", maxWidth: "360px", margin: "0 auto 32px" }}>
              When you heart a pair, it'll show up here so you can compare and book later.
            </p>
            <Link to="/search">
              <button
                style={{ background: "var(--color-mocha)", color: "white", border: "none", padding: "14px 32px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Search size={15} /> BROWSE PAIRS
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>
                Click heart again on any card to remove
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={clearAll}
                  style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid var(--color-gray-300)", color: "var(--color-gray-500)", padding: "8px 16px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "12px", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e8684a"; (e.currentTarget as HTMLElement).style.color = "#e8684a"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gray-300)"; (e.currentTarget as HTMLElement).style.color = "var(--color-gray-500)"; }}
                >
                  <Trash2 size={12} /> CLEAR ALL
                </button>
                <Link to="/search">
                  <button
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--color-mocha)", color: "white", border: "none", padding: "8px 20px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em" }}
                  >
                    ADD MORE <ArrowRight size={12} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {pairs.map((pair) => (
                <PairCard key={pair.id} pair={pair} />
              ))}
            </div>

            {/* Savings callout */}
            <div style={{ marginTop: "48px", background: "linear-gradient(135deg, #14532d, #166534)", borderRadius: "6px", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 500, color: "white", marginBottom: "6px" }}>
                  You could save up to ${pairs.reduce((acc, p) => {
                    const sep = (p as any).separatePrice;
                    if (!sep) return acc;
                    return acc + Math.round((sep - p.stay.price) * p.totalNights);
                  }, 0).toLocaleString()} on this wishlist
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                  vs. booking each stay and car separately
                </p>
              </div>
              <Link to="/search">
                <button style={{ background: "white", color: "#14532d", border: "none", padding: "12px 28px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}>
                  BOOK NOW
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
