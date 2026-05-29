import { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { CheckCircle2, ChevronRight, Lock, Shield, CreditCard, User, Mail, Phone, Calendar, Car, Home, ArrowLeft, Copy, Check } from "lucide-react";
import { allPairs } from "../lib/mock-data";

const STEPS = ["Your Details", "Payment", "Confirmation"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "40px" }}>
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: i < current ? "var(--color-mocha)" : i === current ? "var(--color-mocha)" : "var(--color-gray-200)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s",
            }}>
              {i < current
                ? <CheckCircle2 size={16} color="white" />
                : <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: i === current ? "white" : "var(--color-gray-400)" }}>{i + 1}</span>
              }
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: i === current ? 600 : 400, color: i === current ? "var(--color-mocha)" : "var(--color-gray-400)", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: "1px", background: i < current ? "var(--color-mocha)" : "var(--color-gray-200)", margin: "0 8px", marginBottom: "22px", transition: "background 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderSummary({ pair, nights, days }: { pair: typeof allPairs[0]; nights: number; days: number }) {
  const stayTotal = pair.stay.price * nights;
  const carTotal = pair.car.price * days;
  const subtotal = stayTotal + carTotal;
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  return (
    <div style={{ background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "4px", overflow: "hidden", position: "sticky", top: "96px" }}>
      {/* Stay */}
      <div style={{ position: "relative", height: "140px", overflow: "hidden" }}>
        <img src={pair.stay.image} alt={pair.stay.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: "12px", left: "14px", right: "14px" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "white", marginBottom: "2px" }}>{pair.stay.name}</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{pair.stay.location}</p>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Stay line */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
          <Home size={14} color="var(--color-mocha)" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-black)", fontWeight: 500 }}>{pair.stay.name}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)" }}>{nights} nights × ${pair.stay.price}/night</p>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)" }}>${stayTotal.toLocaleString()}</p>
        </div>

        {/* Car line */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "16px", borderBottom: "1px solid var(--color-gray-200)" }}>
          <Car size={14} color="var(--color-mocha)" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-black)", fontWeight: 500 }}>{pair.car.name}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)" }}>{days} days × ${pair.car.price}/day</p>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)" }}>${carTotal.toLocaleString()}</p>
        </div>

        {/* Totals */}
        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>Subtotal</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-black)" }}>${subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>Taxes & fees (12%)</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-black)" }}>${tax.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--color-gray-200)", marginTop: "4px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--color-black)", fontWeight: 500 }}>Total</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--color-mocha)", fontWeight: 500 }}>${total.toLocaleString()}</span>
          </div>
        </div>

        {/* Pairlo guarantee */}
        <div style={{ marginTop: "16px", background: "#f0faf4", border: "1px solid #c6e8d4", borderRadius: "4px", padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Shield size={13} color="#16a34a" />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "#15803d" }}>Pairlo Guarantee</span>
          </div>
          {["Pickup within 2 miles of your stay", "Timing synced to check-in", "One invoice, one support line"].map((t) => (
            <p key={t} style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#166534", lineHeight: 1.6 }}>✓ {t}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Parse pair from URL
  const params = new URLSearchParams(window.location.search);
  const pairId = params.get("pair") ?? "pair-1";
  const nightsParam = parseInt(params.get("nights") ?? "5");
  const daysParam = parseInt(params.get("days") ?? "5");
  const checkin = params.get("checkin") ?? "";
  const checkout = params.get("checkout") ?? "";

  const pair = allPairs.find((p) => p.id === pairId) ?? allPairs[0];
  const nights = nightsParam || pair.totalNights;
  const days = daysParam || pair.totalDays;

  const stayTotal = pair.stay.price * nights;
  const carTotal = pair.car.price * days;
  const subtotal = stayTotal + carTotal;
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  // Form state
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", dob: "" });
  const [payment, setPayment] = useState({ card: "", expiry: "", cvv: "", name: "", zip: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const confirmationCode = useMemo(() => "PLO-" + Math.random().toString(36).substring(2, 8).toUpperCase(), []);

  const field = (label: string, key: string, placeholder: string, icon: React.ReactNode, type = "text", stateObj = form, setFn = setForm) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-gray-500)" }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{ position: "absolute", left: "12px", display: "flex", alignItems: "center" }}>{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={(stateObj as any)[key]}
          onChange={(e) => setFn((prev: any) => ({ ...prev, [key]: e.target.value }))}
          style={{
            width: "100%", padding: "11px 14px 11px 36px",
            border: `1px solid ${formErrors[key] ? "#ef4444" : "var(--color-gray-200)"}`,
            borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px",
            color: "var(--color-black)", outline: "none", background: "white",
            transition: "border-color 0.2s", boxSizing: "border-box",
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-mocha)"; }}
          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = formErrors[key] ? "#ef4444" : "var(--color-gray-200)"; }}
        />
      </div>
      {formErrors[key] && <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#ef4444" }}>{formErrors[key]}</p>}
    </div>
  );

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.includes("@")) errs.email = "Valid email required";
    if (!form.phone.trim()) errs.phone = "Required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (payment.card.replace(/\s/g, "").length < 16) errs.card = "Enter a valid 16-digit card number";
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) errs.expiry = "Format: MM/YY";
    if (payment.cvv.length < 3) errs.cvv = "3 or 4 digits";
    if (!payment.name.trim()) errs.name = "Required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1) {
      if (!validateStep2()) return;
      setProcessing(true);
      setTimeout(() => { setProcessing(false); setStep(2); }, 2200);
      return;
    }
    setStep((s) => s + 1);
  };

  const formatCard = (val: string) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length >= 3 ? clean.slice(0, 2) + "/" + clean.slice(2) : clean;
  };

  // ── CONFIRMATION ──
  if (step === 2) {
    return (
      <div style={{ background: "var(--color-cream)", minHeight: "100vh", paddingTop: "72px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 24px 96px", textAlign: "center" }}>
          {/* Success icon */}
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <CheckCircle2 size={40} color="#16a34a" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: "var(--color-black)", marginBottom: "12px" }}>
            You're all paired up.
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--color-gray-500)", marginBottom: "32px", lineHeight: 1.7 }}>
            Confirmation sent to <strong>{form.email || "your email"}</strong>. Your stay and car are synced and ready.
          </p>

          {/* Confirmation code */}
          <div style={{ background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "20px 24px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-gray-400)", marginBottom: "4px" }}>Booking Reference</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--color-black)", letterSpacing: "0.08em" }}>{confirmationCode}</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(confirmationCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: "1px solid var(--color-gray-200)", borderRadius: "2px", background: "white", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)", transition: "all 0.2s" }}
            >
              {copied ? <><Check size={12} color="#16a34a" /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>

          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px", textAlign: "left" }}>
            {[
              { icon: <Home size={14} color="var(--color-mocha)" />, label: "Stay", title: pair.stay.name, sub: `${nights} nights · ${pair.stay.location}` },
              { icon: <Car size={14} color="var(--color-mocha)" />, label: "Car", title: pair.car.name, sub: `${days} days · Pickup at stay` },
              { icon: <Calendar size={14} color="var(--color-mocha)" />, label: "Check-in", title: checkin || "Day of travel", sub: "3:00 PM" },
              { icon: <Shield size={14} color="#16a34a" />, label: "Coverage", title: "Pairlo Guarantee", sub: "Active on your booking" },
            ].map((item, i) => (
              <div key={i} style={{ background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>{item.icon}<span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-gray-400)" }}>{item.label}</span></div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)", marginBottom: "2px" }}>{item.title}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ background: "var(--color-black)", borderRadius: "4px", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Total charged</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--color-mocha-pale)" }}>${total.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/search">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "12px 24px", background: "var(--color-mocha)", color: "white", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em" }}>
                Browse more pairs
              </span>
            </Link>
            <Link to="/">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "12px 24px", border: "1px solid var(--color-gray-200)", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)", cursor: "pointer" }}>
                Go to homepage
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-cream)", minHeight: "100vh", paddingTop: "72px" }}>
      {/* Header */}
      <div style={{ background: "var(--color-black)", padding: "32px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "16px" }}>
          <Link to="/search">
            <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "2px", padding: "8px 14px", cursor: "pointer", color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)", fontSize: "13px" }}>
              <ArrowLeft size={13} /> Back
            </button>
          </Link>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 400, color: "white" }}>Checkout</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>Booking: {pair.stay.name} + {pair.car.name}</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
            <Lock size={12} color="rgba(255,255,255,0.4)" />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Secure checkout</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 96px" }}>
        <StepIndicator current={step} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }} className="checkout-grid">
          {/* Form */}
          <div style={{ background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "4px", padding: "32px" }}>
            {step === 0 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--color-black)", marginBottom: "6px" }}>Your Details</h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-400)", marginBottom: "28px" }}>Used for your booking confirmation and check-in.</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  {field("First Name", "firstName", "Javon", <User size={13} color="var(--color-gray-400)" />)}
                  {field("Last Name", "lastName", "Lawhorn", <User size={13} color="var(--color-gray-400)" />)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {field("Email Address", "email", "you@email.com", <Mail size={13} color="var(--color-gray-400)" />, "email")}
                  {field("Phone Number", "phone", "+1 (555) 000-0000", <Phone size={13} color="var(--color-gray-400)" />, "tel")}
                  {field("Date of Birth", "dob", "MM/DD/YYYY", <Calendar size={13} color="var(--color-gray-400)" />)}
                </div>

                <div style={{ marginTop: "24px", padding: "16px", background: "var(--color-cream)", borderRadius: "4px", border: "1px solid var(--color-gray-200)" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)", lineHeight: 1.7 }}>
                    By continuing, you agree to Pairlo's <span style={{ color: "var(--color-mocha)", cursor: "pointer" }}>Terms of Service</span> and <span style={{ color: "var(--color-mocha)", cursor: "pointer" }}>Privacy Policy</span>. Your personal data is processed securely.
                  </p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, color: "var(--color-black)", marginBottom: "6px" }}>Payment</h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-400)", marginBottom: "28px" }}>All transactions are encrypted and secure.</p>

                {/* Card icons */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                  {["VISA", "MC", "AMEX", "DISC"].map((brand) => (
                    <div key={brand} style={{ border: "1px solid var(--color-gray-200)", borderRadius: "3px", padding: "4px 8px", fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 700, color: "var(--color-gray-400)", letterSpacing: "0.05em" }}>{brand}</div>
                  ))}
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Lock size={11} color="var(--color-gray-400)" />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>256-bit SSL</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Card number */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-gray-500)" }}>Card Number</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <CreditCard size={13} color="var(--color-gray-400)" style={{ position: "absolute", left: "12px" }} />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={payment.card}
                        onChange={(e) => setPayment((p) => ({ ...p, card: formatCard(e.target.value) }))}
                        maxLength={19}
                        style={{ width: "100%", padding: "11px 14px 11px 36px", border: `1px solid ${formErrors.card ? "#ef4444" : "var(--color-gray-200)"}`, borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-black)", outline: "none", background: "white", letterSpacing: "0.08em", boxSizing: "border-box" }}
                        onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-mocha)"; }}
                        onBlur={(e) => { (e.target as HTMLElement).style.borderColor = formErrors.card ? "#ef4444" : "var(--color-gray-200)"; }}
                      />
                    </div>
                    {formErrors.card && <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#ef4444" }}>{formErrors.card}</p>}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-gray-500)" }}>Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={payment.expiry}
                        onChange={(e) => setPayment((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                        maxLength={5}
                        style={{ padding: "11px 14px", border: `1px solid ${formErrors.expiry ? "#ef4444" : "var(--color-gray-200)"}`, borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-black)", outline: "none", background: "white", boxSizing: "border-box" }}
                        onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-mocha)"; }}
                        onBlur={(e) => { (e.target as HTMLElement).style.borderColor = formErrors.expiry ? "#ef4444" : "var(--color-gray-200)"; }}
                      />
                      {formErrors.expiry && <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#ef4444" }}>{formErrors.expiry}</p>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-gray-500)" }}>CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={payment.cvv}
                        onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                        maxLength={4}
                        style={{ padding: "11px 14px", border: `1px solid ${formErrors.cvv ? "#ef4444" : "var(--color-gray-200)"}`, borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-black)", outline: "none", background: "white", boxSizing: "border-box" }}
                        onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-mocha)"; }}
                        onBlur={(e) => { (e.target as HTMLElement).style.borderColor = formErrors.cvv ? "#ef4444" : "var(--color-gray-200)"; }}
                      />
                      {formErrors.cvv && <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#ef4444" }}>{formErrors.cvv}</p>}
                    </div>
                  </div>

                  {field("Name on Card", "name", "Javon Lawhorn", <User size={13} color="var(--color-gray-400)" />, "text", payment, setPayment)}
                </div>

                {/* Processing overlay */}
                {processing && (
                  <div style={{ marginTop: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "16px", background: "var(--color-cream)", borderRadius: "4px", border: "1px solid var(--color-gray-200)" }}>
                    <div style={{ width: "18px", height: "18px", border: "2px solid var(--color-mocha)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)" }}>Processing your booking…</span>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleNext}
              disabled={processing}
              style={{
                width: "100%", marginTop: "28px",
                background: processing ? "var(--color-gray-200)" : "var(--color-mocha)",
                color: processing ? "var(--color-gray-400)" : "white",
                border: "none", borderRadius: "2px",
                padding: "15px", fontFamily: "var(--font-body)",
                fontSize: "15px", fontWeight: 600, cursor: processing ? "not-allowed" : "pointer",
                letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { if (!processing) (e.currentTarget as HTMLElement).style.background = "var(--color-mocha-light)"; }}
              onMouseLeave={(e) => { if (!processing) (e.currentTarget as HTMLElement).style.background = "var(--color-mocha)"; }}
            >
              {step === 0 ? "Continue to Payment" : processing ? "Processing…" : `Confirm & Pay $${total.toLocaleString()}`}
              {!processing && <ChevronRight size={16} />}
            </button>
          </div>

          {/* Sidebar */}
          <OrderSummary pair={pair} nights={nights} days={days} />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
