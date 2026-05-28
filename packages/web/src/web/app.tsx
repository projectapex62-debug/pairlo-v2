import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";
import { Nav } from "./components/nav";
import { Footer } from "./components/footer";
import { CompareDrawer } from "./components/compare-drawer";
import { LiveActivityToast } from "./components/live-activity-toast";
import Index from "./pages/index";
import Search from "./pages/search";
import Stays from "./pages/stays";
import Rewards from "./pages/rewards";
import About from "./pages/about";
import Contact from "./pages/contact";
import FAQ from "./pages/faq";
import Blog from "./pages/blog";
import Checkout from "./pages/checkout";
import Wishlist from "./pages/wishlist";
import Quiz from "./pages/quiz";
import TripCalculator from "./pages/trip-calculator";

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [visible, setVisible] = useState(true);
  const prevLocation = useRef(location);

  useEffect(() => {
    if (location !== prevLocation.current) {
      setVisible(false);
      const t = setTimeout(() => {
        prevLocation.current = location;
        setVisible(true);
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 120);
      return () => clearTimeout(t);
    }
  }, [location]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.22s ease, transform 0.22s ease",
      }}
    >
      {children}
    </div>
  );
}

function App() {
  return (
    <Provider>
      <Nav />
      <PageTransition>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/search" component={Search} />
          <Route path="/stays" component={Stays} />
          <Route path="/rewards" component={Rewards} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/faq" component={FAQ} />
          <Route path="/blog" component={Blog} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/trip-calculator" component={TripCalculator} />
        </Switch>
      </PageTransition>
      <Footer />
      <CompareDrawer />
      <LiveActivityToast />
      {import.meta.env.DEV && <AgentFeedback />}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
