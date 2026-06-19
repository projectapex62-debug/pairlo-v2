// ============================================================
// PAIRLO API INTEGRATIONS — Reference / Type Definitions
// Expedia EPS Rapid (stays) + Booking.com Demand API (cars)
// Ported from 03-api-integrations.js
//
// STATUS: Stub — real HTTP calls activate at launch.
// All shapes match what matching-engine.ts expects.
// ============================================================

export interface ExpediaConfig {
  baseURL: string;  // https://test.ean.com/v3  →  prod at launch
  key:     string;  // EXPEDIA_API_KEY
  secret:  string;  // EXPEDIA_API_SECRET
}

export interface BookingConfig {
  baseURL:  string; // https://distribution-xml.booking.com/3.0
  username: string; // BOOKING_USERNAME
  password: string; // BOOKING_PASSWORD
}

// ── Normalized shapes (what the engine & frontend consume) ──

export interface NormalizedStay {
  id:              string;
  expedia_id:      string;
  name:            string;
  property_type:   string;
  lat:             number;
  lng:             number;
  rating:          number;
  price_per_night: number;
  total_price:     number;
  nights:          number;
  images:          string[];
  amenities:       string[];
  cancellation:    string;
}

export interface NormalizedCar {
  id:              string;
  booking_id:      string;
  name:            string;
  category:        string;
  pickup_lat:      number;
  pickup_lng:      number;
  pickup_address:  string;
  total_price:     number;
  seats:           number;
  transmission:    string;
  images:          string[];
}

export interface GeoResult {
  lat: number;
  lng: number;
}

// ── Booking payloads ─────────────────────────────────────────

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
  cardType?:  string;
  cardNumber?: string;
  expiry?:    string;
  cvv?:       string;
}

export interface BookingConfirmation {
  confirmationNumber: string;
  status:             "confirmed" | "failed";
  provider:           "expedia" | "booking_com";
  commission?:        number;
}

// ── API function signatures (implemented server-side) ────────

/**
 * searchStays — calls Expedia EPS Rapid /properties/availability
 * Returns NormalizedStay[] sorted by Expedia's preferred score
 */
export type SearchStaysFn = (params: {
  destination: string;
  checkIn:     string;
  checkOut:    string;
  guests:      number;
  lat:         number;
  lng:         number;
}) => Promise<NormalizedStay[]>;

/**
 * searchCars — calls Booking.com Demand API /json/cars
 * Returns NormalizedCar[] within radius of lat/lng
 */
export type SearchCarsFn = (params: {
  lat:         number;
  lng:         number;
  pickupDate:  string;
  returnDate:  string;
  destination: string;
}) => Promise<NormalizedCar[]>;

/**
 * bookStay — POST to Expedia EPS /itineraries
 * Returns confirmation number
 */
export type BookStayFn = (params: {
  propertyId: string;
  checkIn:    string;
  checkOut:   string;
  guest:      GuestInfo;
  payment:    PaymentInfo;
}) => Promise<BookingConfirmation>;

/**
 * bookCar — POST to Booking.com /json/cars/book
 * Returns confirmation number + commission amount
 */
export type BookCarFn = (params: {
  carId:       string;
  pickupDate:  string;
  returnDate:  string;
  guest:       GuestInfo;
  payment:     PaymentInfo;
}) => Promise<BookingConfirmation>;

/**
 * geocodeDestination — Google Maps Geocoding API
 * Returns lat/lng for a destination string
 */
export type GeocodeFn = (destination: string) => Promise<GeoResult>;

// ── Commission rates ─────────────────────────────────────────
export const COMMISSION = {
  stay: 0.06, // 6% via Expedia EPS Rapid
  car:  0.06, // 6% via Booking.com (Stage 1)
  // Stage 2: car → 0.18 when direct suppliers go live
} as const;
