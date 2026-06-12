// ============================================================
// PAIRLO SEARCH API  (Hono — production-ready stub)
// GET /api/search?destination=Miami&checkIn=2026-10-15&checkOut=2026-10-20&guests=2
//
// Currently returns mock-scored pairs.
// Replace searchStays / searchCars stubs with real API calls at launch.
// ============================================================

import { Hono } from 'hono';
import { generatePairs, getFallbackPairs } from './matching-engine';
import { buildEnginePairs } from './mock-adapter';

const search = new Hono();

search.get('/', async (c) => {
  const { destination, checkIn, checkOut, guests = '2' } = c.req.query();

  if (!destination || !checkIn || !checkOut) {
    return c.json({ error: 'destination, checkIn, and checkOut are required' }, 400);
  }

  try {
    // ── Stub: use mock data shaped for the engine ──
    const { stays, cars } = buildEnginePairs(destination);

    const searchParams = { check_in: checkIn, check_out: checkOut };

    let pairs = generatePairs(stays, cars, searchParams);
    if (pairs.length === 0) {
      pairs = getFallbackPairs(stays, cars, searchParams);
    }

    return c.json({
      destination,
      checkIn,
      checkOut,
      guests: Number(guests),
      totalPairs: pairs.length,
      pairs: pairs.map((p) => ({
        stayId:    p.stay.id,
        carId:     p.car.id,
        pairScore: p.pairScore,
        distanceKm: Math.round(p.distanceKm * 10) / 10,
        totalPrice: p.totalPrice,
        scores: {
          pair:      p.pairScore,
          proximity: p.proximityScore,
          date:      p.dateScore,
          price:     p.priceScore,
          style:     p.styleScore,
        },
      })),
    });
  } catch (err) {
    console.error('Search error:', err);
    return c.json({ error: 'Search failed. Please try again.' }, 500);
  }
});

export default search;
