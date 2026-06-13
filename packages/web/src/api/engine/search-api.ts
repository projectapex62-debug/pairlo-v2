// ============================================================
// PAIRLO SEARCH API  (Hono — production-ready)
// GET /api/search?destination=Miami&checkIn=2026-10-15&checkOut=2026-10-20&guests=2
// Returns full scored pairs, ready for the frontend to render.
// ============================================================

import { Hono } from 'hono';
import { allPairs } from '../../web/lib/mock-data';
import { getScoredAndSortedPairs } from './mock-adapter';

const search = new Hono();

search.get('/', async (c) => {
  const { destination, checkIn, checkOut, guests = '2' } = c.req.query();

  if (!destination || !checkIn || !checkOut) {
    return c.json({ error: 'destination, checkIn, and checkOut are required' }, 400);
  }

  try {
    const searchParams = { check_in: checkIn, check_out: checkOut };
    const scored = getScoredAndSortedPairs(allPairs, searchParams);

    return c.json({
      destination,
      checkIn,
      checkOut,
      guests: Number(guests),
      totalPairs: scored.length,
      pairs: scored.map(p => ({
        id:             p.id,
        badge:          p.badge,
        separatePrice:  p.separatePrice,
        carMatchReason: p.carMatchReason,
        lastBooked:     p.lastBooked,
        totalNights:    p.totalNights,
        totalDays:      p.totalDays,
        engineScore:    p.engineScore,
        engineBreakdown: p.engineBreakdown ?? null,
        stay:           p.stay,
        car:            p.car,
      })),
    });
  } catch (err) {
    console.error('Search error:', err);
    return c.json({ error: 'Search failed. Please try again.' }, 500);
  }
});

export default search;
