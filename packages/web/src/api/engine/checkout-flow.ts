// ============================================================
// PAIRLO CHECKOUT FLOW (TypeScript reference)
// Ported from 04-checkout-flow.js
//
// STATUS: Stubbed — Stripe + real API booking go live October 2026
// Wire up: STRIPE_SECRET_KEY, DATABASE_URL, bookStay, bookCar
// ============================================================

// Commission rates
export const COMMISSION = {
  stay: 0.06, // 6% via Expedia EPS Rapid
  car:  0.06, // 6% via Booking.com (bumps to 0.18 with direct suppliers)
};

export interface Guest {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  age?:      number;
}

export interface PaymentDetails {
  cardType:   string;
  cardNumber: string;
  expiry:     string;
  cvv:        string;
  address:    string;
  city:       string;
  state:      string;
  zip:        string;
}

export interface PairPricing {
  stayPrice: number;
  carPrice:  number;
}

// ── Step 1: Create Payment Intent ─────────────────────────
// Called when user clicks "Book This Pair"
// Returns Stripe clientSecret + booking totals

export function calculateCheckoutTotals(pricing: PairPricing) {
  const { stayPrice, carPrice } = pricing;
  const stayCommission = Math.round(stayPrice * COMMISSION.stay * 100) / 100;
  const carCommission  = Math.round(carPrice  * COMMISSION.car  * 100) / 100;
  const totalAmount    = stayPrice + carPrice;
  const pairloEarns    = stayCommission + carCommission;

  return {
    totalAmount,
    stayCommission,
    carCommission,
    pairloEarns,
    stripeAmount: Math.round(totalAmount * 100), // cents
  };
}

// ── Step 2: Confirm Booking ────────────────────────────────
// Called after Stripe payment succeeds
// Books stay (Expedia) + car (Booking.com) simultaneously via Promise.all

export async function confirmBookingStub(bookingId: string): Promise<{
  bookingId: string;
  status: 'confirmed';
  message: string;
  stayConfirmation: string;
  carConfirmation:  string;
}> {
  // TODO at launch: replace with real bookStay + bookCar calls
  // const [stayConf, carConf] = await Promise.all([bookStay(...), bookCar(...)]);
  return {
    bookingId,
    status:           'confirmed',
    message:          'Your stay and car are both confirmed!',
    stayConfirmation: `EXP-${Date.now()}`,
    carConfirmation:  `BKG-${Date.now()}`,
  };
}

// ── Step 3: Confirmation Email ─────────────────────────────
// Integrate with Resend at launch
// Template: Pairlo branding, stay + car confirmation numbers,
//           trip link: pairlo.com/trip/{bookingId}, support@pairlo.com

export async function sendConfirmationEmailStub(bookingId: string, guestEmail: string) {
  console.log(`[email stub] Confirmation → ${guestEmail} for booking ${bookingId}`);
  // TODO: Implement with Resend — resend.com
}
