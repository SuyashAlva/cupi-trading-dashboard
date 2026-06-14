import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Bell, Receipt } from "lucide-react";
import { useMarket } from "../../store/marketStore";
import { usePortfolio } from "../../store/portfolioStore";
import { SectionHead } from "./TrendingCarousel";
import { fmtPrice, fmtTime } from "../../lib/format";

type Kind = "up" | "down" | "trade" | "alert";
interface Item { id: number; kind: Kind; text: string; ts: number; }

export function ActivityFeed() {
  const [items, setItems] = useState<Item[]>([]);
  const idRef = useRef(0);
  const lastLog = useRef<Record<string, number>>({});
  const seenTrades = useRef<Set<string>>(new Set());

  const push = (kind: Kind, text: string) =>
    setItems((cur) => [{ id: ++idRef.current, kind, text, ts: Date.now() }, ...cur].slice(0, 14));

  // Live ticks → throttled per-symbol so the feed reads as a tape, not a flood.
  useEffect(() => {
    const unsub = useMarket.subscribe(
      (s) => s.quotes,
      (quotes, prev) => {
        const now = Date.now();
        for (const sym of Object.keys(quotes)) {
          const q = quotes[sym];
          const p = prev[sym];
          if (!q || !p || q.price === p.price) continue;
          if (now - (lastLog.current[sym] ?? 0) < 3000) continue;
          if (Math.random() > 0.5) continue;
          lastLog.current[sym] = now;
          const up = q.price >= p.price;
          push(up ? "up" : "down", `${sym} ${up ? "ticked up to" : "dipped to"} ${fmtPrice(q.price)}`);
        }
      },
    );
    return unsub;
  }, []);

  // New trades.
  useEffect(() => {
    const unsub = usePortfolio.subscribe(
      (s) => s.trades,
      (trades) => {
        const t = trades[0];
        if (t && !seenTrades.current.has(t.id)) {
          seenTrades.current.add(t.id);
          push("trade", `${t.side} ${t.qty} ${t.symbol} @ ${fmtPrice(t.price)}`);
        }
      },
    );
    return unsub;
  }, []);

  // Triggered alerts.
  useEffect(() => {
    const onAlert = (e: Event) => push("alert", (e as CustomEvent<string>).detail);
    window.addEventListener("pulse:alert", onAlert);
    return () => window.removeEventListener("pulse:alert", onAlert);
  }, []);

  const ICON: Record<Kind, React.ReactNode> = {
    up: <ArrowUpRight size={14} className="text-gain" />,
    down: <ArrowDownRight size={14} className="text-loss" />,
    trade: <Receipt size={14} className="text-brand-2" />,
    alert: <Bell size={14} className="text-gold" />,
  };

  return (
    <section className="panel p-5">
      <SectionHead title="Live activity" hint="real time" />
      <div className="relative">
        <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-dim">Watching the tape… activity will appear here.</p>
          ) : (
            items.map((it) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="relative flex items-center gap-3 py-1.5 pl-5"
              >
                <span className="absolute left-0 grid h-4 w-4 place-items-center rounded-full bg-surface ring-2 ring-bg">
                  {ICON[it.kind]}
                </span>
                <span className="flex-1 text-sm text-ink-dim">{it.text}</span>
                <span className="tnum text-[11px] text-ink-faint">{fmtTime(it.ts)}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
