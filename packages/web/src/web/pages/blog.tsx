import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock, Tag } from "lucide-react";

const POSTS = [
  {
    id: "nashville-weekend",
    category: "Itineraries",
    title: "The Perfect Nashville Weekend Itinerary",
    subtitle: "Hot chicken, honky-tonks, and a Tesla on Broadway",
    image: "/stay-nashville.jpg",
    readTime: "6 min read",
    date: "May 2026",
    featured: true,
    excerpt:
      "You land Friday at 4pm. By 7pm you're eating Hattie B's on the patio. By 9pm you're at Tootsies. Here's how to pull it off without a single Uber.",
    body: [
      "Nashville is a walking city — until it isn't. The Gulch to East Nashville gap is exactly the kind of distance that kills a night if you're at the mercy of surge pricing. With a Tesla Model 3 waiting at your loft, that trip is 8 minutes and $0.",
      "**Friday**: Land, pick up the car at the garage, check in to the Gulch Glass Loft. Dinner at Hattie B's (hot chicken, level 'Damn Hot'). Walk to Tootsies on Broadway. Drinks at The Patterson House.",
      "**Saturday**: Morning coffee at Barista Parlor on 8th. Drive the Natchez Trace Parkway south for 45 minutes — one of the most underrated drives in the country. Back by noon. Lunch at Arnold's Country Kitchen. Afternoon at Cheekwood Estate. Dinner at Henley.",
      "**Sunday**: Brunch at Josephine. Flea market at the Nashville Farmers' Market. 2-hour drive to the Jack Daniel's distillery in Lynchburg. Back to the airport by 7pm.",
      "Total driving: ~3 hours over 3 days. Total Uber cost: $0. Total regrets: also $0.",
    ],
    tags: ["Nashville", "Weekend Trip", "Itinerary"],
  },
  {
    id: "right-car",
    category: "Tips",
    title: "How to Choose the Right Car for Your Stay",
    subtitle: "Not all rentals are created equal. Here's the decision tree.",
    image: "/car-rover.jpg",
    readTime: "4 min read",
    date: "April 2026",
    featured: false,
    excerpt:
      "Renting a compact sedan for a ski trip. Booking a sports car for a road trip with 4 people and luggage. These are the mistakes we see every week.",
    body: [
      "The single biggest mistake people make when renting a car is defaulting to whatever's cheapest at the counter. The second biggest mistake is picking based on brand alone.",
      "**Match terrain to drivetrain.** Mountains → AWD or 4WD. Beach roads → anything. City → EV or compact (parking is cheaper, charging is everywhere). Desert → V6 minimum, trunk space matters.",
      "**Match group size to cargo.** Two people with carry-ons? Anything works. Four people with checked luggage and ski gear? You need a full-size SUV or a minivan. Don't be the person cramming a snowboard into a Corolla.",
      "**Match vibe to vehicle.** Pulling up to a luxury resort in an economy hatchback is a vibe mismatch. It shouldn't matter — but it does. Pairlo surfaces cars that fit the property tier.",
      "**Match duration to cost structure.** Daily rates favor short trips. Weekly rates flatten out after day 4. If you're staying 5+ nights, always look at the 7-day rate even if you don't need all 7 days.",
      "Our algorithm does most of this automatically. But knowing the logic means you can override it when your situation is different.",
    ],
    tags: ["Car Rental", "Tips", "Travel Hack"],
  },
  {
    id: "malibu-pch",
    category: "Destinations",
    title: "PCH or the 405? The Answer Is Always PCH.",
    subtitle: "The drive is the destination. A local's guide to Malibu by car.",
    image: "/stay-villa1.jpg",
    readTime: "5 min read",
    date: "March 2026",
    featured: false,
    excerpt:
      "The Pacific Coast Highway is 123 miles of America's best coastal road. Here's how to drive it right — and which 11-mile stretch is non-negotiable.",
    body: [
      "If you're staying in Malibu and you're not driving the PCH at sunset, you're doing it wrong. The 11-mile stretch from Malibu Creek State Park to Point Dume is the one. Window down, something with a wide rev range, golden hour.",
      "**What to drive**: The Mercedes GLE we pair with the Oceanfront Villa has air suspension that makes the sweeping corners feel effortless. Anything with stiff sport suspension is actually less enjoyable here — you want compliance, not aggression.",
      "**Where to stop**: Geoffrey's at sunset. El Matador State Beach (get there before 10am or after 4pm — the parking lot fills instantly). Neptune's Net for the lobster roll if you make it to Ventura County.",
      "**Avoid**: The 101 into Santa Monica on a Friday afternoon. Just stay on the PCH all the way — yes, it adds 20 minutes, no, you won't regret it.",
      "**The secret stretch**: Turn off PCH onto Mulholland Highway toward Calabasas. The Backbone Trail access points here are completely uncrowded compared to Malibu Creek. You'll feel like you have the mountains to yourself.",
    ],
    tags: ["Malibu", "Road Trip", "PCH"],
  },
  {
    id: "aspen-ski",
    category: "Itineraries",
    title: "Aspen Without the Crowds: An Off-Hours Guide",
    subtitle: "First tracks, empty runs, and the best aprés nobody talks about",
    image: "/stay-villa3.jpg",
    readTime: "7 min read",
    date: "February 2026",
    featured: false,
    excerpt:
      "Aspen has a traffic problem. It also has a crowd problem on the main runs by 10am. Here's how to beat both using nothing but a 4WD and a 7am alarm.",
    body: [
      "Aspen Mountain opens at 9am. The parking lots start filling by 7:30. If you're in a hotel shuttle, you're on the 8:45 run — meaning you arrive at 9:05 and you're already behind.",
      "With a Jeep Grand Cherokee and ski-in/ski-out access at the Alpine Ridge, you park at the base lodge at 8:50 and you're on the first gondola. The top of Ajax at 9:05 is a completely different mountain than at 10:30.",
      "**The runs nobody talks about**: Corkscrew Gulch off the Bonnie's area. It's groomed every night, steep enough to be interesting, and the locals go there specifically because the tourists don't.",
      "**Snowmass vs. Aspen**: Take the free shuttle to Snowmass on Day 2. It's technically the bigger mountain and there's almost no wait at the Village Express. Bring the Jeep if you want to explore Brush Creek Road — there's a Nordic center at the end that's completely empty on weekdays.",
      "**Aprés secret**: The Tippler at the base of Aspen Mountain. Not the Sky Hotel bar (too crowded). The Tippler has fire pits, good beer selection, and the crowd thins out after 5pm.",
    ],
    tags: ["Aspen", "Skiing", "Winter Travel"],
  },
  {
    id: "ev-travel",
    category: "Tips",
    title: "Renting an EV for Your Trip: What Nobody Tells You",
    subtitle: "Range anxiety is real. Here's how to eliminate it before it starts.",
    image: "/car-mercedes.jpg",
    readTime: "5 min read",
    date: "January 2026",
    featured: false,
    excerpt:
      "Tesla Superchargers are everywhere. But 'everywhere' doesn't always mean where you're going. A practical guide to EV road trips in 2026.",
    body: [
      "The good news: EV infrastructure in 2026 is genuinely good in most metro areas. The bad news: 'most metro areas' doesn't cover Aspen, Moab, or the middle section of the Natchez Trace.",
      "**Rule 1**: Always start the day at 80%+. Your stay has a Level 2 charger or the building has Tesla destination charging. Plug in every night without thinking about it.",
      "**Rule 2**: Plan your longest day first. If you're driving 200+ miles in one stretch, check the Supercharger map before you leave. Add a 15-minute stop mid-route — not because you'll need it, but because you'll feel better with the buffer.",
      "**Rule 3**: Don't aim for 0. Most EV drivers new to road trips let the battery drop too low chasing efficiency. Stay above 20% in cities; stay above 30% in rural areas.",
      "**Rule 4**: One-pedal driving is a skill. In Nashville or Miami traffic, regen braking saves real range. Turn it on, spend 30 minutes adapting, and you'll never want to go back.",
      "The Tesla Model 3 Long Range paired with the Gulch Glass Loft has destination charging in the garage. You will never need a public charger in Nashville unless you're doing a day trip over 100 miles.",
    ],
    tags: ["EV", "Tesla", "Road Trip Tips"],
  },
  {
    id: "packing-car",
    category: "Tips",
    title: "How to Pack a Rental Car Smarter",
    subtitle: "Fits more, stays organized, and nobody argues. A method.",
    image: "/stay-villa2.jpg",
    readTime: "3 min read",
    date: "December 2025",
    featured: false,
    excerpt:
      "You rented an SUV. You packed like it was a sedan. Now half the trip is spent reorganizing at gas stations. Here's the system.",
    body: [
      "The problem isn't usually space — it's distribution. People throw everything into the trunk, then need something from the bottom at the first rest stop.",
      "**The rule**: Frequency determines position. Things you access daily (chargers, sunscreen, snacks, jackets) stay in the cabin within arm's reach. Things you access once (checked luggage, ski gear, beach chairs) go in the back and stay there.",
      "**Cargo organizers**: A simple collapsible trunk organizer from Amazon ($18) eliminates 80% of trunk chaos. Groceries, beach gear, and shoes go in separate sections.",
      "**The under-seat hack**: Most SUVs have usable under-seat space. A soft bag with first aid, car charger, and maps slides there and never moves.",
      "**Wet gear**: Always have a plastic bag (or two) designated for wet swimsuits, muddy shoes, and damp towels. Mixing these with dry luggage is how you end up with mildewed clothes.",
      "It takes 10 minutes to pack the car right. It saves 45 minutes of frustration across a 4-day trip.",
    ],
    tags: ["Packing", "Tips", "Road Trip"],
  },
];

const CATEGORIES = ["All", "Itineraries", "Destinations", "Tips"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePost, setActivePost] = useState<typeof POSTS[0] | null>(null);

  const filtered =
    activeCategory === "All"
      ? POSTS
      : POSTS.filter((p) => p.category === activeCategory);

  const featured = POSTS.find((p) => p.featured);

  if (activePost) {
    return (
      <div style={{ background: "var(--color-white)", minHeight: "100vh", paddingTop: "72px" }}>
        {/* Back */}
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px 0" }}>
          <button
            onClick={() => setActivePost(null)}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-mocha)", padding: 0 }}
          >
            ← Back to blog
          </button>
        </div>

        {/* Hero image */}
        <div style={{ maxWidth: "900px", margin: "24px auto 0", padding: "0 24px" }}>
          <img src={activePost.image} alt={activePost.title} style={{ width: "100%", height: "360px", objectFit: "cover", borderRadius: "4px" }} />
        </div>

        {/* Article */}
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px 96px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ background: "var(--color-mocha-muted)", color: "var(--color-mocha)", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontFamily: "var(--font-body)", fontWeight: 600, letterSpacing: "0.06em" }}>
              {activePost.category}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)" }}>
              <Clock size={12} /> {activePost.readTime}
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)" }}>{activePost.date}</span>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, color: "var(--color-black)", marginBottom: "16px", lineHeight: 1.2 }}>
            {activePost.title}
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontStyle: "italic", color: "var(--color-gray-500)", marginBottom: "40px", lineHeight: 1.6 }}>
            {activePost.subtitle}
          </p>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--color-gray-600)", lineHeight: 1.8, marginBottom: "24px", fontStyle: "italic" }}>
            {activePost.excerpt}
          </p>

          <div style={{ borderTop: "1px solid var(--color-gray-200)", marginBottom: "32px" }} />

          {activePost.body.map((para, i) => {
            const isBold = para.startsWith("**");
            return (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  color: "var(--color-gray-600)",
                  lineHeight: 1.85,
                  marginBottom: "20px",
                }}
                dangerouslySetInnerHTML={{
                  __html: para.replace(/\*\*(.*?)\*\*/g, "<strong style='color:var(--color-black);font-weight:600'>$1</strong>"),
                }}
              />
            );
          })}

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "40px" }}>
            {activePost.tags.map((tag) => (
              <span
                key={tag}
                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", border: "1px solid var(--color-gray-200)", borderRadius: "100px", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)" }}
              >
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: "56px", background: "var(--color-black)", borderRadius: "4px", padding: "32px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "white", marginBottom: "12px" }}>Ready to book your pair?</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>Stay + car, synced and sorted.</p>
            <Link to="/search">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--color-mocha)", color: "white", padding: "12px 28px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em" }}>
                Search Pairs <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-white)", minHeight: "100vh", paddingTop: "72px" }}>
      {/* Header */}
      <div style={{ background: "var(--color-black)", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-mocha-light)", textTransform: "uppercase", marginBottom: "16px" }}>
            Pairlo Journal
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 400, color: "white" }}>
            Travel smarter.<br />
            <em style={{ fontStyle: "italic", color: "var(--color-mocha-pale)" }}>Drive better.</em>
          </h1>
        </div>
      </div>

      {/* Featured post */}
      {featured && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 0" }}>
          <div
            onClick={() => setActivePost(featured)}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--color-gray-200)", cursor: "pointer", transition: "box-shadow 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            className="featured-post"
          >
            <img src={featured.image} alt={featured.title} style={{ width: "100%", height: "380px", objectFit: "cover" }} />
            <div style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", background: "white" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--color-mocha)", color: "white", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontFamily: "var(--font-body)", fontWeight: 600, letterSpacing: "0.08em", width: "fit-content", marginBottom: "16px" }}>
                FEATURED
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-mocha)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                {featured.category}
              </span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 400, color: "var(--color-black)", marginBottom: "12px", lineHeight: 1.25 }}>
                {featured.title}
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-gray-500)", lineHeight: 1.7, marginBottom: "24px" }}>
                {featured.excerpt}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)" }}>
                  <Clock size={12} /> {featured.readTime}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)" }}>{featured.date}</span>
              </div>
              <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "6px", color: "var(--color-mocha)", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500 }}>
                Read article <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div style={{ maxWidth: "1200px", margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px",
                border: `1px solid ${activeCategory === cat ? "var(--color-mocha)" : "var(--color-gray-200)"}`,
                borderRadius: "100px",
                background: activeCategory === cat ? "var(--color-mocha)" : "transparent",
                color: activeCategory === cat ? "white" : "var(--color-gray-500)",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: activeCategory === cat ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1200px", margin: "32px auto 0", padding: "0 24px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
          {filtered.filter((p) => !p.featured || activeCategory !== "All").map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              style={{ background: "white", border: "1px solid var(--color-gray-200)", borderRadius: "4px", overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              <img src={post.image} alt={post.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ background: "var(--color-mocha-muted)", color: "var(--color-mocha)", padding: "3px 9px", borderRadius: "100px", fontSize: "10px", fontFamily: "var(--font-body)", fontWeight: 600, letterSpacing: "0.06em" }}>
                    {post.category}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>
                    <Clock size={11} /> {post.readTime}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 400, color: "var(--color-black)", marginBottom: "8px", lineHeight: 1.3 }}>
                  {post.title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gray-500)", lineHeight: 1.65, marginBottom: "16px" }}>
                  {post.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-mocha)", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500 }}>
                  Read more <ArrowRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .featured-post { grid-template-columns: 1fr !important; }
          .featured-post img { height: 220px !important; }
        }
      `}</style>
    </div>
  );
}
