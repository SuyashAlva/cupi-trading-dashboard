import { useEffect, useRef } from "react";
import { useMarketSocket } from "../../hooks/useMarketSocket";
import { useStocks } from "../../hooks/useStocks";
import { useMarket } from "../../store/marketStore";
import { useToast } from "../ui/Toast";
import { TopNav } from "./TopNav";
import { Hero } from "./Hero";
import { Cupi100Card } from "./Cupi100Card";
import { TrendingCarousel } from "./TrendingCarousel";
import { WatchlistSection } from "./WatchlistSection";
import { PortfolioSection } from "./PortfolioSection";
import { ActivityFeed } from "./ActivityFeed";
import { TopMovers } from "./TopMovers";
import { AlertsSection } from "./AlertsSection";
import { MarketNews } from "./MarketNews";
import { StockDrawer } from "./StockDrawer";
import { CommandPalette } from "../CommandPalette";

export function Dashboard() {
  useMarketSocket();
  const { data } = useStocks();
  const setSupported = useMarket((s) => s.setSupported);
  const { push } = useToast();
  const seeded = useRef(false);

  useEffect(() => {
    if (!data) return;
    setSupported(data.symbols);
    const market = useMarket.getState();
    if (!seeded.current && market.subscriptions.length === 0) {
      data.symbols.forEach((s) => market.subscribe(s));
      market.select("CUPI100");
    }
    seeded.current = true;
  }, [data, setSupported]);

  useEffect(() => {
    const onAlert = (e: Event) =>
      push({ kind: "alert", title: "Price alert", detail: (e as CustomEvent<string>).detail });
    window.addEventListener("pulse:alert", onAlert);
    return () => window.removeEventListener("pulse:alert", onAlert);
  }, [push]);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
        <Hero />

        <div id="cupi100" className="scroll-mt-20">
          <Cupi100Card />
        </div>

        <TrendingCarousel />

        {/* Asymmetrical grid — intentionally uneven column spans */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5"><WatchlistSection loading={!data} /></div>
          <div className="lg:col-span-7"><PortfolioSection /></div>

          <div className="lg:col-span-5"><ActivityFeed /></div>
          <div className="lg:col-span-3"><TopMovers /></div>
          <div className="lg:col-span-4"><AlertsSection /></div>

          <div className="lg:col-span-12"><MarketNews /></div>
        </div>

        <footer className="flex flex-col items-center gap-1 py-6 text-center text-xs text-ink-faint">
          <span>CUPI — a real-time trading terminal demo. Prices are simulated; CUPI100 is fictional.</span>
        </footer>
      </main>

      <CommandPalette />
      <StockDrawer />
    </div>
  );
}
