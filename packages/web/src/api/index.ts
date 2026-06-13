import { Hono } from 'hono';
import { cors } from "hono/cors";
import searchRoute   from './engine/search-api';
import checkoutRoute from './engine/checkout-api';

const app = new Hono()
  .basePath('api')
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true, exposeHeaders: ["set-auth-token"] }))
  .get('/ping',   (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get('/health', (c) => c.json({ status: 'ok' }, 200))
  .route('/search',   searchRoute)
  .route('/checkout', checkoutRoute);

export type AppType = typeof app;
export default app;
