import { motion } from "framer-motion";
import { useMarket } from "../../store/marketStore";
import { useUi } from "../../store/uiStore";
import { Sparkline } from "../ui/Sparkline";
import { fmtPct, fmtPrice } from "../../lib/format";

export function TrendingCarousel() {
  const supported = useMarket((s) => s.supported);
  const quotes = useMarket((s) => s.quotes);
  const history = useMarket((s) => s.history);
  const subscribe = useMarket((s) => s.subscribe);
  const select = useMarket((s) => s.select);
  const openDrawer = useUi((s) => s.openDrawer);

  const open = (symbol: string) => {
    subscribe(symbol);
    select(symbol);
    openDrawer();
  };

  return (
    <section>
      <SectionHead title="Trending now" hint="Tap a card to trade" />
      <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
        {supported.map((symbol, i) => {
          const q = quotes[symbol];
          const up = (q?.changePct ?? 0) >= 0;
          const gold = symbol === "CUPI100";
          const hist = (history[symbol] ?? []).map((p) => p.price);
          return (
            <motion.button
              key={symbol}
              onClick={() => open(symbol)}
              whileHover={{ y: -4 }}
              transition={{ delay: i * 0.03 }}
              className={`glow-hover relative w-[210px] shrink-0 overflow-hidden rounded-2xl border p-4 text-left ${
                gold ? "border-gold/30 bg-gold/[0.06]" : "border-border bg-surface/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-sm font-600 ${gold ? "text-gold" : "text-ink"}`}>{symbol}</span>
                <span className={`tnum rounded-md px-1.5 py-0.5 text-[11px] font-600 ${up ? "bg-gain/15 text-gain" : "bg-loss/15 text-loss"}`}>
                  {q ? fmtPct(q.changePct) : "—"}
                </span>
              </div>
              <div className="mt-1 truncate text-xs text-ink-faint">{q?.name ?? "…"}</div>
              <div className="tnum mt-3 text-lg font-700 text-ink">{q ? fmtPrice(q.price) : "—"}</div>
              <div className="mt-2">
                <Sparkline data={hist} width={178} height={36} color={gold ? "#FBBF24" : up ? "#22C55E" : "#F43F5E"} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

export function SectionHead({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h3 className="font-display text-xl font-700 tracking-tight">{title}</h3>
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </div>
  );
}
