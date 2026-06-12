// ============================================================
// PAIRLO CHECKOUT FLOW (TypeScript reference)
// Option B — one checkout inside Pairlo, no click-off
// Books stay (Expedia EPS Rapid) + car (Booking.com) simultaneously
//
// This file is the production-ready spec.
// Wire to Hono + Stripe + DB at launch.
// ============================================================

// ── Commission Rates ──────────────────────────────────────

export const COMMISSION = {
  stay: 0.06, // 6% via Expedia EPS Rapid affiliate
  car:  0.06, // 6% via Booking.com in-API (Stage 1)
  // Stage 2: car bumps to 0.18 when direct suppliers go live
};

// ── Commission calculator (usable on frontend) ───────────

export function calcCommissions(stayTotal: number, carTotal: number) {
  const stayCommission  = Math.round(stayTotal * COMMISSION.stay * 100) / 100;
  const carCommission   = Math.round(carTotal  * COMMISSION.car  * 100) / 100;
  return {
    stayCommission,
    carCommission,
    totalCommission: stayCommission + carCommission,
    pairloEarns:     stayCommission + carCommission,
  };
}

// ── Types ─────────────────────────────────────────────────

export interface GuestInfo {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  age?:      number;
}

export interface PaymentInfo {
  address:    string;
  city:       string;
  state:      string;
  zip:        string;
  cardType:   string;
  cardNumber: string;
  expiry:     string;
  cvv:        string;
}

export interface BookingResult {
  bookingId:   string;
  status:      'confirmed' | 'pending' | 'failed';
  message:     string;
  stay: {
    confirmation: string;
    checkIn:      string;
    checkOut:     string;
  };
  car: {
    confirmation: string;
    pickupDate:   string;
    returnDate:   string;
  };
  pairloEarns: number;
}

// ── API Route shapes (Hono, production) ──────────────────
//
// POST /api/checkout/intent
//   body: { pairId, userId, guest }
//   returns: { clientSecret, bookingId, totalAmount, stayCommission, carCommission, pairloEarns, pair }
//
// POST /api/checkout/confirm
//   body: { bookingId, paymentIntentId, guest, payment }
//   returns: BookingResult
//
// GET /api/bookings/:id
//   returns: booking row with pair + stay + car details
//
// Flow:
//   1. createPaymentIntent → Stripe PI + save pending booking to DB
//   2. User completes Stripe Elements on frontend
//   3. confirmBooking → verify Stripe success → Promise.all([bookStay, bookCar])
//   4. Save confirmation numbers → return BookingResult
//   5. sendConfirmationEmail (SendGrid/Resend)
//      Template: stay confirmation + car confirmation + trip link (pairlo.com/trip/:bookingId)
//
// DB tables required:
//   searches (id, destination, check_in, check_out, guests, lat, lng)
//   stays    (id, expedia_id, name, lat, lng, total_price, nights, ...)
//   cars     (id, booking_id, name, pickup_lat, pickup_lng, total_price, ...)
//   pairs    (id, search_id, stay_id, car_id, pair_score, proximity_score, date_score, price_score, style_score, total_price)
//   bookings (id, user_id, pair_id, stay_commission, car_commission, total_commission, status, stripe_payment_id, stay_confirmation, car_confirmation)

export {};
