import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    category: "How It Works",
    items: [
      {
        q: "What exactly is a 'pair'?",
        a: "A pair is a matched booking of a vacation stay + rental car at the same destination. We sync the pickup/dropoff timing to your check-in and check-out so there's zero overlap, zero wasted days, and one invoice.",
      },
      {
        q: "How does Pairlo match my car to my stay?",
        a: "Our algorithm factors in your stay's location, neighborhood terrain, trip duration, and group size. A beachfront villa gets a spacious SUV. A downtown loft gets a compact EV. Mountain cabin? Four-wheel drive, obviously.",
      },
      {
        q: "Can I choose my own car or stay separately?",
        a: "Yes. You can browse by stay or car type and swap either component. We'll always show you compatible options — but you're in control.",
      },
      {
        q: "Is this available everywhere?",
        a: "We're launching in October 2026 with Miami, Malibu, Aspen, Nashville, New York, Los Angeles, and Chicago. More cities are added every month. Join the waitlist to get notified when we expand.",
      },
    ],
  },
  {
    category: "Booking & Payment",
    items: [
      {
        q: "Do I pay for the stay and car separately?",
        a: "No — that's the whole point. One checkout, one invoice, one total. We handle splitting the payment to the property and car provider behind the scenes.",
      },
      {
        q: "What payment methods do you accept?",
        a: "All major credit cards (Visa, Mastercard, Amex, Discover), Apple Pay, and Google Pay. We use Stripe for secure processing.",
      },
      {
        q: "Are there any hidden fees?",
        a: "None. The price you see on the pair card is what you pay. Taxes and cleaning fees are included in the displayed total before checkout.",
      },
      {
        q: "Can I modify my booking after confirming?",
        a: "Yes, up to 72 hours before check-in. Date changes are subject to availability. Modifications are free — we don't charge a change fee.",
      },
    ],
  },
  {
    category: "Cancellations",
    items: [
      {
        q: "What's the cancellation policy?",
        a: "Cancel 7+ days before check-in: full refund. Cancel 3–7 days before: 50% refund. Under 72 hours: no refund. The Pairlo Guarantee still covers car swap and support in all cases.",
      },
      {
        q: "What if the car isn't available when I arrive?",
        a: "Under the Pairlo Guarantee, we'll source an equivalent or upgraded car within 2 hours at no extra cost, or refund the car portion of your booking in full.",
      },
      {
        q: "What if my flight is delayed and I miss check-in?",
        a: "Contact support and we'll coordinate a late arrival with the property. We sync with your travel details so delays don't cost you a night.",
      },
    ],
  },
  {
    category: "Cars",
    items: [
      {
        q: "What's included with the car rental?",
        a: "All pairs include unlimited mileage, basic insurance, and roadside assistance. Premium coverage upgrades are available at checkout.",
      },
      {
        q: "Do I need my own car insurance?",
        a: "Basic CDW (Collision Damage Waiver) is included in every pair. If you have coverage through your credit card, you can waive the included coverage.",
      },
      {
        q: "What's the minimum age to rent?",
        a: "25 years old in most states. Drivers aged 21–24 can rent with a young driver surcharge of $25/day. Under 21 is not permitted.",
      },
      {
        q: "Can I add a second driver?",
        a: "Yes — additional drivers are $15/day each. Add them at checkout or up to 24 hours before pickup via your booking dashboard.",
      },
    ],
  },
  {
    category: "Pairlo Guarantee",
    items: [
      {
        q: "What is the Pairlo Guarantee?",
        a: "Three promises: (1) Car pickup within 2 miles of your stay. (2) Pickup/dropoff timing synced to your check-in/check-out. (3) One support line for both the stay and car — no getting bounced between providers.",
      },
      {
        q: "How do I contact support?",
        a: "Live chat in the app 24/7, email at support@pairlo.co, or call our concierge line. All channels have full access to your booking details.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-gray-200)",
        cursor: "pointer",
      }}
      onClick={() => setOpen((o) => !o)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "20px 0",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: 500,
            color: "var(--color-black)",
            lineHeight: 1.5,
          }}
        >
          {q}
        </p>
        {open ? (
          <ChevronUp size={16} color="var(--color-mocha)" style={{ flexShrink: 0 }} />
        ) : (
          <ChevronDown size={16} color="var(--color-gray-400)" style={{ flexShrink: 0 }} />
        )}
      </div>
      {open && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-gray-500)",
            lineHeight: 1.8,
            paddingBottom: "20px",
            maxWidth: "680px",
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(FAQS[0].category);

  return (
    <div style={{ background: "var(--color-white)", minHeight: "100vh", paddingTop: "72px" }}>
      {/* Header */}
      <div style={{ background: "var(--color-black)", padding: "80px 24px 64px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha-light)", textTransform: "uppercase", marginBottom: "16px" }}>
            Help Center
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 400, color: "white", marginBottom: "20px" }}>
            Frequently Asked<br />
            <em style={{ fontStyle: "italic", color: "var(--color-mocha-pale)" }}>Questions</em>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Everything you need to know about booking a pair. Can't find what you're looking for?{" "}
            <a href="/contact" style={{ color: "var(--color-mocha-light)", textDecoration: "underline" }}>Contact us</a>.
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ borderBottom: "1px solid var(--color-gray-200)", overflowX: "auto", background: "white" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "0" }}>
          {FAQS.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              style={{
                padding: "16px 20px",
                border: "none",
                borderBottom: activeCategory === cat.category ? "2px solid var(--color-mocha)" : "2px solid transparent",
                background: "transparent",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: activeCategory === cat.category ? 600 : 400,
                color: activeCategory === cat.category ? "var(--color-mocha)" : "var(--color-gray-500)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(0, 680px)", gap: "64px", alignItems: "start" }}>
          {/* Sidebar */}
          <div style={{ position: "sticky", top: "96px" }} className="hidden-mobile">
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-gray-400)", marginBottom: "16px" }}>
              Categories
            </p>
            {FAQS.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  borderRadius: "2px",
                  border: "none",
                  background: activeCategory === cat.category ? "var(--color-mocha-muted)" : "transparent",
                  color: activeCategory === cat.category ? "var(--color-mocha)" : "var(--color-gray-500)",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: activeCategory === cat.category ? 600 : 400,
                  cursor: "pointer",
                  marginBottom: "4px",
                  transition: "all 0.15s",
                }}
              >
                {cat.category}
                <span style={{ float: "right", fontSize: "11px", color: "var(--color-gray-400)" }}>
                  {FAQS.find((f) => f.category === cat.category)?.items.length}
                </span>
              </button>
            ))}

            {/* Help CTA */}
            <div style={{ marginTop: "32px", padding: "20px", background: "var(--color-cream)", borderRadius: "4px", border: "1px solid var(--color-gray-200)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)", marginBottom: "6px" }}>Still have questions?</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)", marginBottom: "14px", lineHeight: 1.6 }}>Our support team replies within 2 hours.</p>
              <a href="/contact">
                <button style={{ width: "100%", padding: "10px", background: "var(--color-mocha)", color: "white", border: "none", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em" }}>
                  Contact Us
                </button>
              </a>
            </div>
          </div>

          {/* FAQ items */}
          <div>
            {FAQS.filter((cat) => cat.category === activeCategory).map((cat) => (
              <div key={cat.category}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, color: "var(--color-black)", marginBottom: "8px" }}>
                  {cat.category}
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-400)", marginBottom: "32px" }}>
                  {cat.items.length} questions
                </p>
                {cat.items.map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
