# Pairlo - Launch Ready Feature Drop

## Sprint: Pair Score + SEO Pages + Shareable Links

### 1. Pair Score Algorithm
- [ ] Add `pairScore` to mock-data (computed from price, proximity, style match)
- [ ] PairScore component — circular badge, 1–10, color coded (green=9+, amber=7+, red<7)
- [ ] Show on PairCard + PairModal
- [ ] Show breakdown tooltip (Price Match, Location Sync, Style Harmony, Value)

### 2. Shareable Trip Links
- [ ] `/trip/:id` route — standalone page, no nav/footer
- [ ] Shows full pair details, dates, cost breakdown
- [ ] "Book This Trip" CTA → checkout
- [ ] Copy link button + social share (Twitter, WhatsApp)
- [ ] OG meta tags for rich link previews

### 3. SEO City Landing Pages
- [ ] `/pairs/:city` dynamic route — Miami, New York, Amalfi, Malibu, Nashville, Aspen
- [ ] Each page: hero, filtered pairs for that city, local tips, FAQ
- [ ] Sitemap-friendly URLs
- [ ] Proper title/description meta per city

### 4. Wire up shareable link from checkout confirmation
- [ ] After booking, show "Share your trip" button → `/trip/:bookingRef`

## Files to create/edit
- `lib/pair-score.ts` — scoring algorithm
- `components/pair-score-badge.tsx` — UI component
- `pages/trip.tsx` — shareable trip page
- `pages/city.tsx` — dynamic city SEO page
- `lib/mock-data.ts` — add pairScore + citySlug to pairs
- `components/pair-card.tsx` — add score badge
- `components/pair-modal.tsx` — add score breakdown
- `pages/checkout.tsx` — add share link on confirmation
- `app.tsx` — add /trip/:id and /pairs/:city routes
