import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const TOASTS = [
  { name: "Sarah K.", action: "just booked", pair: "Malibu Beach House + Porsche Cayenne", dest: "Malibu, CA" },
  { name: "James R.", action: "just saved", pair: "Aspen Mountain Lodge + Range Rover", dest: "Aspen, CO" },
  { name: "Priya M.", action: "just booked", pair: "Nashville Skyline Suite + Tesla Model Y", dest: "Nashville, TN" },
  { name: "Leo & Ana", action: "are viewing", pair: "Miami Star Island + Lamborghini Urus", dest: "Miami, FL" },
  { name: "Chris T.", action: "just booked", pair: "NYC Penthouse + BMW M5", dest: "New York, NY" },
  { name: "Morgan W.", action: "just saved", pair: "Cliffside Infinity Villa + Porsche 911", dest: "Malibu, CA" },
  { name: "Yuki S.", action: "just booked", pair: "Aspen Treehouse + Jeep Wrangler", dest: "Aspen, CO" },
  { name: "Diego & Mia", action: "are checking out", pair: "Nashville Honky-Tonk Loft + Mustang GT", dest: "Nashville, TN" },
];

interface Toast { name: string; action: string; pair: string; dest: string; }

export function LiveActivityToast() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<Toast>(TOASTS[0]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // Initial delay: 8s before first toast
    const initial = setTimeout(() => {
      setCurrent(TOASTS[0]);
      setVisible(true);

      const hideFirst = setTimeout(() => setVisible(false), 5000);

      const cycle = setInterval(() => {
        setIdx((prev) => {
          const next = (prev + 1) % TOASTS.length;
          setCurrent(TOASTS[next]);
          setVisible(true);

          setTimeout(() => setVisible(false), 5000);
          return next;
        });
      }, Math.floor(Math.random() * 4000) + 9000); // 9–13s

      return () => {
        clearTimeout(hideFirst);
        clearInterval(cycle);
      };
    }, 8000);

    return () => clearTimeout(initial);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 9000,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
        opacity: visible ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div
        style={{
          background: "var(--color-black, #1B2E1F)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "6px",
          padding: "12px 16px",
          maxWidth: "300px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        {/* Pulse dot */}
        <div style={{ position: "relative", flexShrink: 0, marginTop: "3px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80" }} />
          <div
            style={{
              position: "absolute",
              inset: "-3px",
              borderRadius: "50%",
              background: "rgba(74,222,128,0.3)",
              animation: "pulse-ring 1.6s ease-out infinite",
            }}
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-body, sans-serif)", fontSize: "12px", fontWeight: 600, color: "white", lineHeight: 1.4, marginBottom: "2px" }}>
            {current.name} <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.55)" }}>{current.action}</span>
          </p>
          <p style={{ fontFamily: "var(--font-body, sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.7)", lineHeight: 1.4, marginBottom: "4px" }}>
            {current.pair}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={9} color="var(--color-mocha, #7B5B3A)" />
            <span style={{ fontFamily: "var(--font-body, sans-serif)", fontSize: "10px", color: "var(--color-mocha, #7B5B3A)" }}>
              {current.dest}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
