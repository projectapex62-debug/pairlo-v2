// ============================================================
// PAIRLO API INTEGRATIONS (TypeScript reference)
// Expedia EPS Rapid (stays) + Booking.com Demand API (cars)
// Ported from 03-api-integrations.js
//
// STATUS: Stubbed — real calls go live at October 2026 launch
// Replace buildEnginePairs() in mock-adapter with these functions
// ============================================================

// ── Types ─────────────────────────────────────────────────

export interface SearchStaysParams {
  destination: string;
  checkIn:     string;
  checkOut:    string;
  guests:      number;
  lat:         number;
  lng:         number;
}

export interface SearchCarsParams {
  lat:         number;
  lng:         number;
  pickupDate:  string;
  returnDate:  string;
  destination: string;
}

// ── Geocoding ─────────────────────────────────────────────

export async function geocodeDestination(destination: string): Promise<{ lat: number; lng: number }> {
  const key = import.meta.env?.VITE_GOOGLE_MAPS_KEY ?? process.env.GOOGLE_MAPS_KEY;
  const res  = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${key}`
  );
  const data = await res.json();
  const loc  = data.results?.[0]?.geometry?.location;
  if (!loc) throw new Error(`Could not geocode: ${destination}`);
  return { lat: loc.lat, lng: loc.lng };
}

// ── Stays — Expedia EPS Rapid ─────────────────────────────

export async function searchStays(params: SearchStaysParams) {
  const { checkIn, checkOut, guests, lat, lng } = params;
  const key    = process.env.EXPEDIA_API_KEY    ?? '';
  const secret = process.env.EXPEDIA_API_SECRET ?? '';

  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  const url = new URL('https://test.ean.com/v3/properties/availability');
  url.searchParams.set('checkin',      checkIn);
  url.searchParams.set('checkout',     checkOut);
  url.searchParams.set('occupancy',    `adults-${guests}`);
  url.searchParams.set('currency',     'USD');
  url.searchParams.set('language',     'en-US');
  url.searchParams.set('country_code', 'US');
  url.searchParams.set('latitude',     String(lat));
  url.searchParams.set('longitude',    String(lng));
  url.searchParams.set('radius',       '50');
  url.searchParams.set('limit',        '25');

  const res  = await fetch(url.toString(), {
    headers: { Authorization: `EPS apikey="${key}",secret="${secret}"` },
  });
  const data = await res.json();

  return (data.properties ?? []).map((p: any) => ({
    id:          p.property_id,
    expedia_id:  p.property_id,
    name:        p.name,
    lat:         p.location?.coordinates?.latitude,
    lng:         p.location?.coordinates?.longitude,
    rating:      p.reviews?.rating,
    total_price: (p.rooms?.[0]?.rates?.[0]?.nightly_price ?? 0) * nights,
    nights,
    images:      p.images?.slice(0, 5).map((i: any) => i.links?.['350px']?.href),
    amenities:   p.amenities?.slice(0, 10).map((a: any) => a.name),
    cancellation: p.rooms?.[0]?.rates?.[0]?.cancel_policies?.[0]?.type,
  }));
}

// ── Cars — Booking.com Demand API ────────────────────────

export async function searchCars(params: SearchCarsParams) {
  const { lat, lng, pickupDate, returnDate } = params;
  const username = process.env.BOOKING_USERNAME ?? '';
  const password = process.env.BOOKING_PASSWORD ?? '';
  const auth     = btoa(`${username}:${password}`);

  const url = new URL('https://distribution-xml.booking.com/3.0/json/cars');
  url.searchParams.set('pick_up_latitude',   String(lat));
  url.searchParams.set('pick_up_longitude',  String(lng));
  url.searchParams.set('drop_off_latitude',  String(lat));
  url.searchParams.set('drop_off_longitude', String(lng));
  url.searchParams.set('pick_up_date',       pickupDate);
  url.searchParams.set('drop_off_date',      returnDate);
  url.searchParams.set('driver_age',         '30');
  url.searchParams.set('currency',           'USD');
  url.searchParams.set('language',           'en-us');
  url.searchParams.set('limit',              '25');

  const res  = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await res.json();

  return (data.vehicles ?? []).map((v: any) => ({
    id:             v.vehicle_id,
    booking_id:     v.vehicle_id,
    name:           `${v.make} ${v.model}`,
    category:       v.category,
    pickup_lat:     v.pick_up_location?.latitude,
    pickup_lng:     v.pick_up_location?.longitude,
    pickup_address: v.pick_up_location?.address,
    total_price:    v.price?.total,
    seats:          v.seats,
    transmission:   v.transmission,
    images:         [v.image_url],
  }));
}

// ── Booking functions (used by checkout-flow) ─────────────

export async function bookStay(params: {
  propertyId: string; checkIn: string; checkOut: string;
  guest: any; payment: any;
}): Promise<{ confirmationNumber: string }> {
  // TODO: Implement Expedia EPS itinerary POST at launch
  console.log('[bookStay stub]', params.propertyId);
  return { confirmationNumber: `EXP-${Date.now()}` };
}

export async function bookCar(params: {
  carId: string; pickupDate: string; returnDate: string;
  guest: any; payment: any;
}): Promise<{ confirmationNumber: string }> {
  // TODO: Implement Booking.com car booking POST at launch
  console.log('[bookCar stub]', params.carId);
  return { confirmationNumber: `BKG-${Date.now()}` };
}
