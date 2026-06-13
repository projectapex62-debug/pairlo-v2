// ============================================================
// PAIRLO CHECKOUT API  (Hono)
// POST /api/checkout/confirm  — generate confirmations, save booking
// GET  /api/bookings/:id      — fetch booking by ID
// ============================================================

import { Hono } from 'hono';
import { allPairs } from '../../web/lib/mock-data';
import { COMMISSION } from './checkout-flow';

function nanoid(len = 6) {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

function genRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${nanoid(4)}`;
}

const checkout = new Hono();

// POST /api/checkout/confirm
checkout.post('/confirm', async (c) => {
  try {
    const body = await c.req.json();
    const { pairId, checkIn, checkOut, nights, guest, stayTotal, carTotal } = body as {
      pairId: string;
      checkIn: string;
      checkOut: string;
      nights: number;
      guest: { firstName: string; lastName: string; email: string; phone: string };
      stayTotal: number;
      carTotal: number;
    };

    if (!pairId || !guest?.email || stayTotal == null || carTotal == null) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const pair = allPairs.find(p => p.id === pairId);
    if (!pair) return c.json({ error: 'Pair not found' }, 404);

    const tax             = Math.round((stayTotal + carTotal) * 0.12 * 100) / 100;
    const grandTotal      = stayTotal + carTotal + tax;
    const stayCommission  = Math.round(stayTotal * COMMISSION.stay  * 100) / 100;
    const carCommission   = Math.round(carTotal  * COMMISSION.car   * 100) / 100;
    const totalCommission = stayCommission + carCommission;

    const bookingId       = genRef('PLO');
    const stayConfirmation = genRef('EXP');
    const carConfirmation  = genRef('BKG');

    // Persist to DB if configured — gracefully skip if not
    try {
      const { db }       = await import('../database');
      const { bookings } = await import('../database/schema');
      await db.insert(bookings).values({
        id:               bookingId,
        pairId,
        stayName:         pair.stay.name,
        carName:          pair.car.name,
        destination:      pair.stay.location,
        checkIn:          checkIn ?? '',
        checkOut:         checkOut ?? '',
        nights:           nights ?? pair.totalNights,
        guestFirstName:   guest.firstName,
        guestLastName:    guest.lastName,
        guestEmail:       guest.email,
        guestPhone:       guest.phone ?? '',
        stayTotal,
        carTotal,
        tax,
        grandTotal,
        stayConfirmation,
        carConfirmation,
        pairloReference:  bookingId,
        status:           'confirmed',
        stayCommission,
        carCommission,
        totalCommission,
      });
    } catch {
      // DB not yet configured — confirmation codes are still returned
    }

    return c.json({
      bookingId,
      pairloReference: bookingId,
      status:  'confirmed',
      message: 'Your stay and car are both confirmed!',
      stay: {
        confirmation: stayConfirmation,
        name:    pair.stay.name,
        location: pair.stay.location,
        checkIn,
        checkOut,
      },
      car: {
        confirmation: carConfirmation,
        name:      pair.car.name,
        pickupDate: checkIn,
        returnDate: checkOut,
      },
      totals: {
        stayTotal,
        carTotal,
        tax,
        grandTotal,
        pairloEarns: totalCommission,
      },
    });
  } catch (err) {
    console.error('Checkout confirm error:', err);
    return c.json({ error: 'Booking failed. Please try again.' }, 500);
  }
});

// GET /api/bookings/:id
checkout.get('/bookings/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const { db }       = await import('../database');
    const { bookings } = await import('../database/schema');
    const { eq }       = await import('drizzle-orm');
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    if (!result.length) return c.json({ error: 'Booking not found' }, 404);
    return c.json(result[0]);
  } catch {
    return c.json({ error: 'Booking not found' }, 404);
  }
});

export default checkout;
