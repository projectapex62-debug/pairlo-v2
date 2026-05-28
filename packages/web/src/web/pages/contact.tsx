import { useState } from "react";
import { Mail, MapPin, Twitter, Linkedin, Instagram, Send } from "lucide-react";

const TOPICS = ["General inquiry", "Partnership", "Press", "Investor relations", "Bug report", "Other"];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "2px",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--color-black)",
    background: "white",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--color-gray-500)",
    display: "block",
    marginBottom: "8px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)", paddingTop: "72px" }}>

      {/* ── HEADER ── */}
      <section style={{ background: "var(--color-black)", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha-light)", textTransform: "uppercase", marginBottom: "20px" }}>
          Contact Us
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,5vw,64px)", fontWeight: 400, color: "white", marginBottom: "16px" }}>
          Let's <em style={{ fontStyle: "italic", color: "var(--color-mocha-pale)" }}>talk.</em>
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(255,255,255,0.5)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.75 }}>
          Partnerships, press, investor inquiries — or just a hello. We read every message.
        </p>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "80px", alignItems: "start" }}>

        {/* LEFT — Info */}
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, marginBottom: "28px" }}>
            Get in touch
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "48px" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "2px", background: "var(--color-mocha-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Mail size={16} color="var(--color-mocha)" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", color: "var(--color-gray-400)", textTransform: "uppercase", marginBottom: "4px" }}>Email</p>
                <a href="mailto:hello@pairlo.com" style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-black)", textDecoration: "none" }}>hello@pairlo.com</a>
              </div>
            </div>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "2px", background: "var(--color-mocha-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={16} color="var(--color-mocha)" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", color: "var(--color-gray-400)", textTransform: "uppercase", marginBottom: "4px" }}>Based in</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-black)" }}>San Francisco, CA</p>
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", color: "var(--color-gray-400)", textTransform: "uppercase", marginBottom: "16px" }}>
              Follow along
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: "40px", height: "40px", borderRadius: "2px",
                    background: "var(--color-black)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-black)")}
                >
                  <Icon size={16} color="white" />
                </a>
              ))}
            </div>
          </div>

          {/* Response time note */}
          <div style={{ marginTop: "48px", padding: "20px 24px", background: "var(--color-cream)", borderLeft: "3px solid var(--color-mocha)", borderRadius: "0 2px 2px 0" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-600)", lineHeight: 1.7 }}>
              We typically respond within <strong style={{ color: "var(--color-mocha)" }}>24 hours</strong> on weekdays. Investor and partnership inquiries get priority routing.
            </p>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div style={{ background: "var(--color-cream)", padding: "48px 44px", borderRadius: "4px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--color-mocha)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Send size={22} color="white" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, marginBottom: "12px" }}>Message sent.</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)", lineHeight: 1.7 }}>
                We'll get back to you within 24 hours. Thanks for reaching out.
              </p>
              <button
                onClick={() => setSent(false)}
                style={{ marginTop: "28px", padding: "12px 28px", background: "var(--color-mocha)", color: "white", border: "none", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}
              >
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 400, marginBottom: "4px" }}>
                Send a message
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-mocha)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-gray-200)")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    required
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-mocha)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-gray-200)")}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" as const, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-mocha)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-gray-200)")}
                >
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="What's on your mind?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-mocha)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-gray-200)")}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "15px",
                  background: "var(--color-black)",
                  color: "white",
                  border: "none",
                  borderRadius: "2px",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--color-mocha)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "var(--color-black)")}
              >
                SEND MESSAGE <Send size={15} />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
