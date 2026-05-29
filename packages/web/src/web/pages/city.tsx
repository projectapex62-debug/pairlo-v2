import { useParams, Link } from "wouter";
import { allPairs } from "../lib/mock-data";
import { PairScoreBadge } from "../components/pair-score-badge";
import { computePairScore, getScoreLabel } from "../lib/pair-score";
import { MapPin, Star, ArrowRight, Car, Home } from "lucide-react";

const cityData: Record<string, {
  name: string; hero: string; tagline: string; description: string;
  tips: string[]; faq: { q: string; a: string }[];
}> = {
  miami: {
    name: "Miami", hero: "/stay-miami.jpg",
    tagline: "Sun, speed, and South Beach style.",
    description: "Miami is made for driving. The Biscayne Causeway at golden hour with the top down, Art Basel weekends, and a villa in Star Island — Pairlo matches you the exact car for the exact stay so your Miami trip starts the moment you land.",
    tips: ["Best weather: November–April", "Star Island & Coconut Grove for luxury villas", "Biscayne Causeway is the drive — do it at sunset", "Design District for dining, South Beach for nightlife"],
    faq: [
      { q: "What's the best car for Miami?", a: "A convertible — full stop. The Corvette C8 or a Porsche Boxster. Top down on the causeway is a Miami rite of passage." },
      { q: "When should I visit Miami?", a: "November to April for perfect weather. Avoid August–October (hurricane season + extreme humidity)." },
      { q: "Which neighborhoods are best for stays?", a: "Star Island for ultra-luxury, South Beach for the scene, Coconut Grove for a quieter, lush vibe." },
    ],
  },
  "new-york": {
    name: "New York", hero: "/stay-manhattan.jpg",
    tagline: "The city that never sleeps. Your car should keep up.",
    description: "A Manhattan penthouse with a BMW 7 Series in the garage isn't just a flex — it's the most efficient way to move through New York. Pairlo pairs your Tribeca loft or Upper East Side townhouse with the exact executive vehicle to match.",
    tips: ["Tribeca & TriBeCa lofts are the Pairlo sweet spot", "JFK pickup saves 40 min vs. yellow cab", "Unlimited mileage cars are key — day trips to the Hamptons", "Book midweek for better pair pricing"],
    faq: [
      { q: "Do I even need a car in NYC?", a: "For the city itself, no. But for Hamptons weekends, Hudson Valley day trips, or JFK runs — a luxury sedan is unbeatable." },
      { q: "Best car for New York?", a: "BMW 7 Series or Tesla Model S. Executive comfort in traffic, and they fit in Manhattan parking garages." },
      { q: "Best neighborhoods to stay?", a: "Tribeca for a cool downtown feel, Upper East Side for classic luxury, Brooklyn Heights for a quieter option with skyline views." },
    ],
  },
  malibu: {
    name: "Malibu", hero: "/stay-villa6.jpg",
    tagline: "Pacific sunsets, canyon roads, and infinity pools.",
    description: "Malibu is about the drive as much as the stay. Mulholland Drive at golden hour in a Range Rover Sport, then back to a cliffside infinity villa overlooking the Pacific. Pairlo was literally built for this.",
    tips: ["Pacific Coast Highway is the iconic drive — do it both ways", "Mulholland Drive for canyon roads", "Book sunset dinners at Nobu Malibu weeks in advance", "Paradise Cove for the most secluded beach access"],
    faq: [
      { q: "Best car for Malibu?", a: "Range Rover Sport or Porsche Cayenne. Canyon roads + occasional unpaved paths — you want comfort and capability." },
      { q: "How far is Malibu from LAX?", a: "About 45 minutes without traffic. Plan for 90 minutes during peak hours — which is why having your own car matters." },
      { q: "Best time to visit Malibu?", a: "September–November. Crowds thin, weather stays warm, and the light is extraordinary." },
    ],
  },
  aspen: {
    name: "Aspen", hero: "/stay-villa3.jpg",
    tagline: "Mountain luxury. Snow-covered roads. Perfect pairs.",
    description: "Aspen demands an SUV. A Jeep Wrangler or Range Rover in the snow, a ski-in chalet or mountain cabin to return to, and fresh powder every morning. Pairlo matches your Aspen stay with a car that's actually built for it.",
    tips: ["Fly into Eagle County (EGE) — closer than Denver", "Book ski-in/ski-out stays months ahead for peak season", "Four-wheel drive is non-negotiable in winter", "Aspen Highlands has the best expert terrain"],
    faq: [
      { q: "What car do I need in Aspen?", a: "4WD or AWD is essential in winter. Jeep Wrangler for adventure, Range Rover for luxury — both handle Aspen roads perfectly." },
      { q: "When is peak season in Aspen?", a: "December–March for skiing, July–August for summer hiking and food & wine festival." },
      { q: "Is Aspen worth it in summer?", a: "Absolutely. Fewer crowds, wildflower hiking, world-class restaurants, and the Aspen Music Festival." },
    ],
  },
  nashville: {
    name: "Nashville", hero: "/stay-nashville.jpg",
    tagline: "Music City. Wide roads. No need to call a ride.",
    description: "Nashville's best experiences are spread across the city — honky tonks on Broadway, Franklin for antiques, Loveless Cafe 20 miles out. Pairlo gives you the freedom to drive it all in a car that matches your stay's vibe.",
    tips: ["Broadway for live music — walk this strip, don't drive it", "Franklin & Germantown for upscale dining", "Loveless Cafe is worth the drive — classic Southern breakfast", "East Nashville for the coolest local scene"],
    faq: [
      { q: "Best car for Nashville?", a: "A comfortable mid-luxury sedan or SUV. You're covering distance — the Tesla Model 3 or BMW 5 Series hits the right note." },
      { q: "Do I need a car in Nashville?", a: "Yes. Unlike New York, Nashville's best spots are spread out. Broadway is walkable but everything else requires wheels." },
      { q: "Best time to visit Nashville?", a: "April–June and September–October. Spring and fall have the best weather and manageable crowds." },
    ],
  },
  amalfi: {
    name: "Amalfi Coast", hero: "/stay-villa1.jpg",
    tagline: "Cliffside villages. Hairpin turns. La dolce vita.",
    description: "The Amalfi Coast is one of the world's most dramatic drives — but only if you have the right car. A nimble convertible on the SS163, a clifftop villa in Positano, and the Mediterranean shimmering below. Pairlo was made for this.",
    tips: ["Drive early morning — roads get congested by 10am", "Positano is the most scenic base", "Ravello for peace and quiet above the crowds", "Ferry between towns to avoid the worst traffic"],
    faq: [
      { q: "What car is best for Amalfi?", a: "Small and nimble. A Fiat 500 Abarth or Mini Cooper Convertible — the roads are narrow hairpins. Avoid large SUVs." },
      { q: "How long should I stay on the Amalfi Coast?", a: "Minimum 4 nights. Positano, Ravello, and Praiano each deserve a full day." },
      { q: "When is the best time to visit?", a: "May–June or September–October. July–August is beautiful but intensely crowded and hot." },
    ],
  },
};

export default function CityPage() {
  const { city } = useParams<{ city: string }>();
  const data = cityData[city || ""];

  const cityPairs = allPairs.filter(p =>
    p.stay.location.toLowerCase().includes(data?.name?.split(" ")[0]?.toLowerCase() || "")
  );

  const displayPairs = cityPairs.length > 0 ? cityPairs : allPairs.slice(0, 3);

  if (!data) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontFamily: "var(--font-body)", color: "var(--color-gray-400)" }}>City not found</p>
        <Link to="/search"><span style={{ color: "var(--color-mocha)", fontFamily: "var(--font-body)", fontSize: "13px", cursor: "pointer" }}>Browse all pairs →</span></Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-white)" }}>
      {/* SEO-friendly title rendered for crawlers */}
      <title>{`${data.name} Hotel + Car Rental Pairs | Pairlo`}</title>

      {/* Hero */}
      <section style={{ position: "relative", height: "460px", overflow: "hidden" }}>
        <img src={data.hero} alt={`${data.name} luxury travel`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
            <MapPin size={14} color="var(--color-mocha-pale)" />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.18em", color: "var(--color-mocha-pale)", textTransform: "uppercase" }}>Pairlo Destination</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px,6vw,72px)", fontWeight: 400, color: "white", lineHeight: 1.05, marginBottom: "16px" }}>
            {data.name}
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px,2vw,22px)", fontStyle: "italic", color: "rgba(255,255,255,0.8)", maxWidth: "520px" }}>
            {data.tagline}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section style={{ background: "var(--color-cream)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.8, color: "var(--color-gray-600)" }}>{data.description}</p>
        </div>
      </section>

      {/* Pairs */}
      <section style={{ background: "white", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "12px" }}>Curated Pairs</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,46px)", fontWeight: 400 }}>
              Top pairs in {data.name}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: "28px" }}>
            {displayPairs.map((pair) => {
              const score = computePairScore({ stayPrice: pair.stay.price, carPrice: pair.car.price, separatePrice: pair.separatePrice, totalNights: pair.totalNights, stayTags: pair.stay.tags, carType: pair.car.type, stayRating: pair.stay.rating, badge: pair.badge });
              const pairTotal = (pair.stay.price + pair.car.price) * pair.totalNights;
              return (
                <div key={pair.id} style={{ background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "6px", overflow: "hidden", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}
                >
                  <div style={{ position: "relative", height: "200px" }}>
                    <img src={pair.stay.image} alt={pair.stay.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
                      {pair.badge && <span style={{ background: "var(--color-mocha)", color: "white", fontFamily: "var(--font-body)", fontSize: "10px", padding: "3px 8px", borderRadius: "2px", letterSpacing: "0.08em" }}>{pair.badge}</span>}
                    </div>
                    <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                      <PairScoreBadge stayPrice={pair.stay.price} carPrice={pair.car.price} separatePrice={pair.separatePrice} totalNights={pair.totalNights} stayTags={pair.stay.tags} carType={pair.car.type} stayRating={pair.stay.rating} badge={pair.badge} size="sm" />
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <Home size={13} color="var(--color-mocha)" />
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 500 }}>{pair.stay.name}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <Car size={13} color="var(--color-gray-400)" />
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)" }}>{pair.car.name}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 500 }}>${pairTotal.toLocaleString()}</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>{pair.totalNights} nights · pair price</p>
                      </div>
                      <Link to={`/trip/${pair.id}-${pair.totalNights}n`}>
                        <button style={{ background: "var(--color-mocha)", color: "white", border: "none", padding: "10px 18px", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
                          VIEW PAIR <ArrowRight size={13} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Tips */}
      <section style={{ background: "var(--color-black)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha-light)", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>Local Intel</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,3vw,40px)", fontWeight: 400, color: "white", textAlign: "center", marginBottom: "40px" }}>
            What you need to know about {data.name}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "16px" }}>
            {data.tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "16px 20px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--color-mocha)", flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--color-cream)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha)", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>FAQ</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,3vw,40px)", fontWeight: 400, textAlign: "center", marginBottom: "40px" }}>
            {data.name} travel questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {data.faq.map((item, i) => (
              <div key={i} style={{ background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "6px", padding: "24px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 500, marginBottom: "10px" }}>{item.q}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-600)", lineHeight: 1.7 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--color-mocha)", padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 400, color: "white", marginBottom: "12px" }}>
          Ready to pair your {data.name} trip?
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "rgba(255,255,255,0.7)", marginBottom: "32px" }}>One search. Stay + car. Zero coordination.</p>
        <Link to={`/search?q=${data.name}`}>
          <button style={{ background: "white", color: "var(--color-mocha)", border: "none", padding: "16px 40px", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            SEARCH {data.name.toUpperCase()} PAIRS <ArrowRight size={16} />
          </button>
        </Link>
      </section>
    </div>
  );
}
