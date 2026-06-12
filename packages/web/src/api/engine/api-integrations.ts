// ============================================================
// PAIRLO API INTEGRATIONS (TypeScript stub)
// Expedia EPS Rapid (stays) + Booking.com Demand API (cars)
// Currently stubbed — replace with live calls at launch
// ============================================================

// ── Config (populated via env at launch) ─────────────────

export const EXPEDIA_CONFIG = {
  baseURL: 'https://test.ean.com/v3', // switch to prod at launch
  key:     import.meta.env?.VITE_EXPEDIA_API_KEY    ?? '',
  secret:  import.meta.env?.VITE_EXPEDIA_API_SECRET ?? '',
};

export const BOOKING_CONFIG = {
  baseURL:  'https://distribution-xml.booking.com/3.0',
  username: import.meta.env?.VITE_BOOKING_USERNAME ?? '',
  password: import.meta.env?.VITE_BOOKING_PASSWORD ?? '',
};

// ── Normalized shapes (what the matching engine expects) ──

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

// ── Geocoding ─────────────────────────────────────────────

export async function geocodeDestination(destination: string): Promise<{ lat: number; lng: number }> {
  const key = import.meta.env?.VITE_GOOGLE_MAPS_KEY ?? '';
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${key}`
  );
  const data = await res.json();
  const loc = data.results?.[0]?.geometry?.location;
  if (!loc) throw new Error(`Could not geocode destination: ${destination}`);
  return { lat: loc.lat, lng: loc.lng };
}

// ── Stay Search ───────────────────────────────────────────
// TODO: replace stub with live Expedia EPS Rapid call

export async function searchStays(_params: {
  destination: string;
  checkIn:     string;
  checkOut:    string;
  guests:      number;
  lat:         number;
  lng:         number;
}): Promise<NormalizedStay[]> {
  // Stub — real call goes here at launch
  // POST https://test.ean.com/v3/properties/availability
  throw new Error('searchStays: not yet connected to Expedia EPS Rapid');
}

// ── Car Search ────────────────────────────────────────────
// TODO: replace stub with live Booking.com Demand API call

export async function searchCars(_params: {
  lat:         number;
  lng:         number;
  pickupDate:  string;
  returnDate:  string;
  destination: string;
}): Promise<NormalizedCar[]> {
  // Stub — real call goes here at launch
  // GET https://distribution-xml.booking.com/3.0/json/cars
  throw new Error('searchCars: not yet connected to Booking.com');
}

// ── Stay Booking ──────────────────────────────────────────

export async function bookStay(_params: {
  propertyId: string;
  checkIn:    string;
  checkOut:   string;
  guest:      { firstName: string; lastName: string; email: string; phone: string };
  payment:    { address: string; city: string; state: string; zip: string };
}): Promise<{ confirmationNumber: string; status: string; provider: string }> {
  throw new Error('bookStay: not yet connected to Expedia EPS Rapid');
}

// ── Car Booking ───────────────────────────────────────────

export async function bookCar(_params: {
  carId:       string;
  pickupDate:  string;
  returnDate:  string;
  guest:       { firstName: string; lastName: string; email: string; phone: string; age?: number };
  payment:     { cardType: string; cardNumber: string; expiry: string; cvv: string };
}): Promise<{ confirmationNumber: string; status: string; provider: string; commission?: number }> {
  throw new Error('bookCar: not yet connected to Booking.com');
}

// ── Normalization helpers (used when real APIs are live) ──

export function normalizeStays(data: any, checkIn: string, checkOut: string): NormalizedStay[] {
  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );
  return (data.properties || []).map((p: any) => ({
    id:              p.property_id,
    expedia_id:      p.property_id,
    name:            p.name,
    property_type:   p.type,
    lat:             p.location?.coordinates?.latitude,
    lng:             p.location?.coordinates?.longitude,
    rating:          p.reviews?.rating,
    price_per_night: p.rooms?.[0]?.rates?.[0]?.nightly_price || 0,
    total_price:     (p.rooms?.[0]?.rates?.[0]?.nightly_price || 0) * nights,
    nights,
    images:          p.images?.slice(0, 5).map((i: any) => i.links?.['350px']?.href) ?? [],
    amenities:       p.amenities?.slice(0, 10).map((a: any) => a.name) ?? [],
    cancellation:    p.rooms?.[0]?.rates?.[0]?.cancel_policies?.[0]?.type ?? 'unknown',
  }));
}

export function normalizeCars(data: any): NormalizedCar[] {
  return (data.vehicles || []).map((v: any) => ({
    id:              v.vehicle_id,
    booking_id:      v.vehicle_id,
    name:            `${v.make} ${v.model}`,
    category:        v.category,
    pickup_lat:      v.pick_up_location?.latitude,
    pickup_lng:      v.pick_up_location?.longitude,
    pickup_address:  v.pick_up_location?.address,
    total_price:     v.price?.total,
    seats:           v.seats,
    transmission:    v.transmission,
    images:          [v.image_url],
  }));
}
