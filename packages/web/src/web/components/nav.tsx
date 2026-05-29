import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Heart, X as XIcon } from "lucide-react";
import { getWishlist } from "../lib/wishlist";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem("pairlo-dark") === "1");
  const [wishlistCount, setWishlistCount] = useState(() => getWishlist().length);
  const [bannerVisible, setBannerVisible] = useState(() => {
    try { return sessionStorage.getItem("pairlo-banner-dismissed") !== "1"; } catch { return true; }
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("pairlo-dark", dark ? "1" : "0");
  }, [dark]);

  useEffect(() => {
    const onWishlistChange = () => setWishlistCount(getWishlist().length);
    window.addEventListener("pairlo-wishlist-change", onWishlistChange);
    return () => window.removeEventListener("pairlo-wishlist-change", onWishlistChange);
  }, []);

  const links = [
    { href: "/search", label: "Search Pairs" },
    { href: "/stays", label: "Stays" },
    { href: "/blog", label: "Journal" },
    { href: "/rewards", label: "Rewards" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => location === href;

  const dismissBanner = () => {
    setBannerVisible(false);
    try { sessionStorage.setItem("pairlo-banner-dismissed", "1"); } catch {}
  };

  return (
    <>
      {/* ── ANNOUNCEMENT BANNER ── */}
      {bannerVisible && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 101,
          height: "40px", background: "linear-gradient(90deg, #5A3F24 0%, #7B5B3A 50%, #5A3F24 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 48px",
        }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "white", letterSpacing: "0.02em", textAlign: "center" }}>
            🚀 Early Access open —{" "}
            <Link to="/contact">
              <span style={{ color: "rgba(255,255,255,0.85)", textDecoration: "underline", cursor: "pointer" }}>join the waitlist</span>
            </Link>
          </p>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss"
            style={{ position: "absolute", right: "16px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }}
          >
            <XIcon size={14} color="rgba(255,255,255,0.7)" />
          </button>
        </div>
      )}

      <nav
        style={{
          position: "fixed", top: bannerVisible ? "40px" : "0", left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid var(--color-gray-200)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link to="/">
            <span style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 500, color: scrolled ? "var(--color-black)" : "white", letterSpacing: "0.06em", cursor: "pointer", transition: "color 0.3s" }}>
              Pairlo
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden-mobile">
            {links.map((l) => (
              <Link key={l.href} to={l.href}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: isActive(l.href) ? 500 : 400, color: isActive(l.href) ? (scrolled ? "var(--color-black)" : "white") : (scrolled ? "var(--color-gray-500)" : "rgba(255,255,255,0.75)"), cursor: "pointer", transition: "color 0.2s", letterSpacing: "0.02em", paddingBottom: "4px", borderBottom: isActive(l.href) ? "1px solid var(--color-mocha)" : "1px solid transparent", display: "inline-block" }}>
                  {l.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop CTA + dark mode */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="hidden-mobile">
            {/* Wishlist */}
            <Link to="/wishlist">
              <div style={{ position: "relative", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Saved pairs">
                <Heart size={17} color={wishlistCount > 0 ? "#e8684a" : (scrolled ? "var(--color-gray-500)" : "rgba(255,255,255,0.65)")} fill={wishlistCount > 0 ? "#e8684a" : "none"} style={{ transition: "all 0.2s" }} />
                {wishlistCount > 0 && (
                  <span style={{
                    position: "absolute", top: "-3px", right: "-3px",
                    background: "#e8684a", color: "white",
                    borderRadius: "50%", width: "16px", height: "16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 700,
                    lineHeight: 1,
                  }}>
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </div>
            </Link>
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark((d) => !d)}
              title={dark ? "Light mode" : "Dark mode"}
              style={{ width: "34px", height: "34px", borderRadius: "2px", border: `1px solid ${scrolled ? "var(--color-gray-200)" : "rgba(255,255,255,0.25)"}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-mocha)"; (e.currentTarget as HTMLElement).style.background = "var(--color-mocha-pale)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = scrolled ? "var(--color-gray-200)" : "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {dark ? <Sun size={15} color={scrolled ? "var(--color-gray-500)" : "rgba(255,255,255,0.7)"} /> : <Moon size={15} color={scrolled ? "var(--color-gray-500)" : "rgba(255,255,255,0.7)"} />}
            </button>

            <Link to="/faq">
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: scrolled ? "var(--color-gray-500)" : "rgba(255,255,255,0.65)", cursor: "pointer", letterSpacing: "0.02em", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = scrolled ? "var(--color-black)" : "white")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = scrolled ? "var(--color-gray-500)" : "rgba(255,255,255,0.65)")}
              >
                FAQ
              </span>
            </Link>
            <Link to="/contact">
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: scrolled ? "var(--color-gray-500)" : "rgba(255,255,255,0.65)", cursor: "pointer", letterSpacing: "0.02em", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = scrolled ? "var(--color-black)" : "white")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = scrolled ? "var(--color-gray-500)" : "rgba(255,255,255,0.65)")}
              >
                Contact
              </span>
            </Link>
            <Link to="/search">
              <span style={{ display: "inline-block", background: "var(--color-mocha)", color: "var(--color-white)", borderRadius: "2px", fontFamily: "var(--font-body)", letterSpacing: "0.04em", fontSize: "13px", fontWeight: 500, padding: "9px 22px", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha-light)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha)")}
              >
                Find a Pair
              </span>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ display: "none", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "5px", width: "40px", height: "40px", background: "transparent", border: "none", cursor: "pointer", padding: "0" }}
            className="show-mobile"
          >
            <span style={{ display: "block", width: "22px", height: "1.5px", background: scrolled ? "var(--color-black)" : "white", transition: "all 0.25s ease", transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: scrolled ? "var(--color-black)" : "white", transition: "all 0.25s ease", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: scrolled ? "var(--color-black)" : "white", transition: "all 0.25s ease", transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
          </button>
        </div>

        {/* Mobile drawer */}
        <div style={{ background: "var(--color-black)", borderTop: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", maxHeight: menuOpen ? "400px" : "0", transition: "max-height 0.35s ease" }}>
          <div style={{ padding: "8px 24px 24px" }}>
            {links.map((l) => (
              <Link key={l.href} to={l.href}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
                  <span style={{ color: isActive(l.href) ? "white" : "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: isActive(l.href) ? 500 : 400 }}>{l.label}</span>
                  {isActive(l.href) && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-mocha)" }} />}
                </div>
              </Link>
            ))}
            {/* Dark mode in mobile */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)", fontSize: "15px" }}>{dark ? "Light Mode" : "Dark Mode"}</span>
              <button onClick={() => setDark((d) => !d)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "2px", padding: "6px 12px", cursor: "pointer", color: "white", fontFamily: "var(--font-body)", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                {dark ? <Sun size={13} color="white" /> : <Moon size={13} color="white" />} Toggle
              </button>
            </div>
            <Link to="/search">
              <div style={{ marginTop: "16px", background: "var(--color-mocha)", color: "white", textAlign: "center", padding: "14px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, letterSpacing: "0.04em", cursor: "pointer" }}>
                Find a Pair
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
        [data-theme="dark"] {
          --color-white: #141a14;
          --color-cream: #1c231c;
          --color-gray-200: #2a342a;
          --color-gray-300: #3a463a;
          --color-gray-400: #6b7a6b;
          --color-gray-500: #8a9a8a;
          --color-gray-600: #aabcaa;
          --color-black: #1B2E1F;
          --color-mocha-pale: rgba(123,91,58,0.18);
          --color-mocha-dark: #c49a6c;
        }
      `}</style>
    </>
  );
}
