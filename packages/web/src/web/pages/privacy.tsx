export default function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      body: [
        "When you create an account or make a booking, we collect your name, email address, phone number, and billing information (processed securely via Stripe — we never store your full card number).",
        "When you browse the site, we automatically collect standard log data including your IP address, browser type, pages visited, and time spent. This is used solely to improve site performance and is not sold.",
        "If you use our quiz or search features, we store your preferences locally to personalize your experience. You can clear this at any time from your account settings.",
      ],
    },
    {
      title: "How We Use Your Information",
      body: [
        "To process and confirm your bookings, send confirmation emails, and coordinate with our stay and car rental partners on your behalf.",
        "To send you trip reminders, updates about your booking, and — only if you opt in — occasional promotions and new destination announcements.",
        "To improve Pairlo: we analyze aggregated, anonymized usage patterns to understand what's working and what isn't. This data is never tied to your identity.",
      ],
    },
    {
      title: "Sharing Your Information",
      body: [
        "We share only what's necessary with our partners: your name, dates, and contact details are passed to the stay property and car rental provider to fulfill your booking.",
        "We do not sell your personal data. Ever. We do not share your information with advertisers or data brokers.",
        "We use trusted third-party services including Stripe (payments), and standard analytics tools. Each is bound by its own privacy policy and data processing agreements.",
      ],
    },
    {
      title: "Cookies",
      body: [
        "We use essential cookies to keep you logged in and remember your preferences. These cannot be disabled as they are required for the site to function.",
        "We use analytics cookies (e.g. usage patterns, page views) to improve the product. You can opt out of these via the cookie banner when you first visit, or at any time from your browser settings.",
        "We do not use advertising or tracking cookies.",
      ],
    },
    {
      title: "Data Retention",
      body: [
        "We retain your account data for as long as your account is active. If you delete your account, we remove your personal data within 30 days, except where we're legally required to retain records (e.g. financial transactions, which are kept for 7 years).",
        "Booking history is retained for 3 years to support disputes, chargebacks, and customer service inquiries.",
      ],
    },
    {
      title: "Your Rights",
      body: [
        "You have the right to access, correct, or delete your personal data at any time. Log in to your account or email us at privacy@pairlo.com.",
        "If you're in the EU or California, you have additional rights under GDPR and CCPA respectively, including the right to data portability and to opt out of certain data processing. Contact us and we'll respond within 30 days.",
      ],
    },
    {
      title: "Security",
      body: [
        "All data is encrypted in transit (TLS) and at rest. Payment processing is handled entirely by Stripe and never touches our servers.",
        "We conduct regular security reviews. If a breach occurs that affects your data, we will notify you within 72 hours as required by law.",
      ],
    },
    {
      title: "Changes to This Policy",
      body: [
        "We may update this policy as the product evolves. We'll notify you by email if any material changes are made. The date at the top of this page always reflects the most recent version.",
      ],
    },
    {
      title: "Contact",
      body: [
        "Questions? Email us at privacy@pairlo.com or write to: Pairlo Inc., 123 Travel Lane, Suite 100, Miami, FL 33101.",
      ],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)" }}>
      {/* Header */}
      <div style={{ background: "var(--color-black)", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.2em", color: "var(--color-mocha-light)", textTransform: "uppercase", marginBottom: "16px" }}>Legal</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: "white", marginBottom: "16px" }}>Privacy Policy</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            Last updated: June 1, 2025 · Effective: June 1, 2025
          </p>
        </div>
      </div>

      {/* Intro */}
      <div style={{ borderBottom: "1px solid var(--color-gray-200)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-gray-600)", lineHeight: 1.85 }}>
            Pairlo is built on trust. You trust us to match your stay and car — we take that same care with your data. This policy explains exactly what we collect, why, and how. No legalese where we can avoid it.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "56px 24px 96px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {sections.map((s, i) => (
            <div key={s.title} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "32px", paddingBottom: "48px", borderBottom: i < sections.length - 1 ? "1px solid var(--color-gray-100)" : "none" }} className="legal-section">
              <div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-mocha)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>0{i + 1}</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 400, color: "var(--color-black)", marginTop: "8px", lineHeight: 1.4 }}>{s.title}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {s.body.map((p, j) => (
                  <p key={j} style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-600)", lineHeight: 1.85 }}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .legal-section { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}
