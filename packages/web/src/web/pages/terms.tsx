export default function Terms() {
  const sections = [
    {
      title: "Acceptance of Terms",
      body: [
        "By accessing or using Pairlo (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.",
        "We may update these terms from time to time. Continued use of the Service after changes are posted constitutes acceptance of the revised terms. We'll notify you by email for any material changes.",
      ],
    },
    {
      title: "The Service",
      body: [
        "Pairlo is a travel booking platform that pairs vacation stays with rental cars at the same destination. We act as an intermediary between you and our partner stay properties and car rental providers.",
        "While we curate and match pairs, the stay and car rental are fulfilled by third-party partners. Pairlo is not the rental agent or property manager for any listing. Your contract for the stay and car are ultimately with those providers.",
        "We reserve the right to modify, suspend, or discontinue any part of the Service at any time. We'll give reasonable advance notice where possible.",
      ],
    },
    {
      title: "Accounts",
      body: [
        "You must be at least 18 years old to create an account and make bookings. By registering, you confirm you meet this requirement.",
        "You are responsible for keeping your account credentials secure. You are liable for all activity that occurs under your account. Notify us immediately at support@pairlo.com if you suspect unauthorized access.",
        "We may suspend or terminate accounts that violate these terms, engage in fraud, or abuse the platform.",
      ],
    },
    {
      title: "Bookings & Payment",
      body: [
        "A booking is confirmed when you receive a confirmation email with a booking reference. Until then, no reservation is held.",
        "All prices are displayed in USD. Taxes and applicable fees are included in the total shown at checkout — there are no hidden fees added after you book.",
        "Payment is processed securely via Stripe. By completing a booking, you authorize Pairlo to charge the total amount to your selected payment method.",
        "In the event of a pricing error on our platform, we reserve the right to cancel the booking and issue a full refund. We'll notify you as soon as possible if this occurs.",
      ],
    },
    {
      title: "Cancellations & Refunds",
      body: [
        "Cancel 7+ days before check-in: full refund. Cancel 3–7 days before check-in: 50% refund. Cancel within 72 hours of check-in: no refund.",
        "Refunds are returned to your original payment method within 5–10 business days depending on your bank.",
        "If Pairlo cancels your booking due to a partner issue, you will receive a full refund plus a $50 credit toward your next booking.",
        "No-show (failure to check in without canceling) is treated as a within-72-hour cancellation — no refund applies.",
      ],
    },
    {
      title: "The Pairlo Guarantee",
      body: [
        "If your car is unavailable on arrival, we will source an equivalent or upgraded replacement within 2 hours at no extra cost, or refund the car portion of your booking in full.",
        "The Guarantee applies to confirmed bookings only and is subject to good-faith use. It does not cover situations caused by the traveler (e.g. wrong pickup location, wrong dates entered).",
        "The Guarantee does not apply to cancellations made by the traveler, force majeure events, or circumstances outside Pairlo's control.",
      ],
    },
    {
      title: "User Conduct",
      body: [
        "You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the platform.",
        "You may not scrape, copy, or redistribute any content from Pairlo without written permission. All pair curation, photography, and editorial content is owned by Pairlo or its licensors.",
        "Reviews and user-submitted content must be truthful and based on genuine experience. We reserve the right to remove content that is fraudulent, offensive, or in violation of these terms.",
      ],
    },
    {
      title: "Intellectual Property",
      body: [
        "All content on the Pairlo platform — including the brand, pair curation logic, editorial copy, and design — is the property of Pairlo Inc. and protected by applicable intellectual property laws.",
        "Nothing in these terms grants you any rights to use Pairlo's name, logo, or trademarks without our prior written consent.",
      ],
    },
    {
      title: "Limitation of Liability",
      body: [
        "Pairlo is not liable for the quality, safety, or legality of the stays and cars provided by third-party partners. Your recourse for property or vehicle issues is with the respective partner, though our support team will always assist.",
        "To the maximum extent permitted by law, Pairlo's total liability to you for any claim arising out of or relating to these terms or the Service shall not exceed the total amount you paid for the relevant booking.",
        "We are not liable for indirect, incidental, special, or consequential damages, including lost profits, loss of data, or travel disruption caused by events outside our control.",
      ],
    },
    {
      title: "Governing Law",
      body: [
        "These terms are governed by the laws of the State of Florida, United States, without regard to conflict of law principles.",
        "Any disputes arising from these terms or your use of the Service shall be resolved through binding arbitration in Miami, Florida, except where prohibited by law.",
      ],
    },
    {
      title: "Contact",
      body: [
        "Questions about these terms? Email legal@pairlo.com or write to: Pairlo Inc., 123 Travel Lane, Suite 100, Miami, FL 33101.",
      ],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)" }}>
      {/* Header */}
      <div style={{ background: "var(--color-black)", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.2em", color: "var(--color-mocha-light)", textTransform: "uppercase", marginBottom: "16px" }}>Legal</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: "white", marginBottom: "16px" }}>Terms of Service</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            Last updated: June 1, 2025 · Effective: June 1, 2025
          </p>
        </div>
      </div>

      {/* Intro */}
      <div style={{ borderBottom: "1px solid var(--color-gray-200)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-gray-600)", lineHeight: 1.85 }}>
            These terms govern your use of Pairlo. We've written them to be as clear as possible. If something doesn't make sense, reach out — we'd rather explain than hide behind fine print.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "56px 24px 96px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {sections.map((s, i) => (
            <div key={s.title} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "32px", paddingBottom: "48px", borderBottom: i < sections.length - 1 ? "1px solid var(--color-gray-100)" : "none" }} className="legal-section">
              <div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--color-mocha)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span>
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
