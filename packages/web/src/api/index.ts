import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { generatePairs, getFallbackPairs } from './engine/matching-engine';
import { buildEnginePairs } from './engine/mock-adapter';

const app = new Hono()
  .basePath('api')
  .use(cors({ origin: (origin) => origin ?? '*', credentials: true, exposeHeaders: ['set-auth-token'] }))

  // ── Health ───────────────────────────────────────────────
  .get('/ping',   (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get('/health', (c) => c.json({ status: 'Pairlo API running ✓' }, 200))

  // ── Search  GET /api/search?destination=Miami&checkIn=2026-10-15&checkOut=2026-10-20&guests=2
  .get('/search', async (c) => {
    const { destination, checkIn, checkOut, guests = '2' } = c.req.query();

    if (!destination || !checkIn || !checkOut) {
      return c.json({ error: 'destination, checkIn, and checkOut are required' }, 400);
    }

    try {
      const { stays, cars } = buildEnginePairs(destination);
      const search = { check_in: checkIn, check_out: checkOut };

      let pairs = generatePairs(stays, cars, search);
      if (pairs.length === 0) {
        pairs = getFallbackPairs(stays, cars, search);
      }

      return c.json({
        destination,
        checkIn,
        checkOut,
        guests:     Number(guests),
        totalPairs: pairs.length,
        pairs: pairs.map((p) => ({
          stayId:     p.stay.id,
          carId:      p.car.id,
          pairScore:  p.pairScore,
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
  })

  // ── Checkout intent  POST /api/checkout/intent
  .post('/checkout/intent', async (c) => {
    const { pairId, userId } = await c.req.json();
    if (!pairId || !userId) {
      return c.json({ error: 'pairId and userId are required' }, 400);
    }
    // Stub: real Stripe integration in checkout-flow.ts at launch
    return c.json({
      clientSecret: `pi_stub_${Date.now()}_secret`,
      bookingId:    `bk_${Date.now()}`,
      message:      'Stripe integration live at October 2026 launch',
    });
  })

  // ── Checkout confirm  POST /api/checkout/confirm
  .post('/checkout/confirm', async (c) => {
    const { bookingId, paymentIntentId } = await c.req.json();
    if (!bookingId || !paymentIntentId) {
      return c.json({ error: 'bookingId and paymentIntentId are required' }, 400);
    }
    return c.json({
      bookingId,
      status:  'confirmed',
      message: 'Your stay and car are both confirmed!',
    });
  });

export type AppType = typeof app;
export default app;
