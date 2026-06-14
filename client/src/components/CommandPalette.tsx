import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Plus, Search, TrendingUp } from "lucide-react";
import { useMarket } from "../store/marketStore";
import { useUi } from "../store/uiStore";
import { fmtPct, fmtPrice } from "../lib/format";

export function CommandPalette() {
  const supported = useMarket((s) => s.supported);
  const subscriptions = useMarket((s) => s.subscriptions);
  const quotes = useMarket((s) => s.quotes);
  const subscribe = useMarket((s) => s.subscribe);
  const select = useMarket((s) => s.select);
  const openDrawer = useUi((s) => s.openDrawer);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toUpperCase();
    return supported
      .map((symbol) => ({ symbol, quote: quotes[symbol] }))
      .filter(({ symbol, quote }) => !needle || symbol.includes(needle) || quote?.name.toUpperCase().includes(needle));
  }, [supported, quotes, q]);

  useEffect(() => setActive(0), [q, open]);

  const choose = (symbol: string) => {
    subscribe(symbol);
    select(symbol);
    openDrawer();
    setOpen(false);
    setQ("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-card"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search size={16} className="text-ink-faint" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
                  if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
                  if (e.key === "Enter" && results[active]) choose(results[active].symbol);
                }}
                placeholder="Search instruments…"
                className="w-full bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-ink-faint"
              />
              <span className="kbd">ESC</span>
            </div>

            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-ink-dim">No instruments match “{q}”.</li>
              )}
              {results.map(({ symbol, quote }, i) => {
                const owned = subscriptions.includes(symbol);
                const up = (quote?.changePct ?? 0) >= 0;
                return (
                  <li key={symbol}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(symbol)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        i === active ? "bg-surface-2" : ""
                      }`}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-3 text-brand-2">
                        <TrendingUp size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-mono text-sm text-ink">{symbol}</span>
                        <span className="ml-2 text-xs text-ink-faint">{quote?.name}</span>
                      </span>
                      {quote && (
                        <span className="text-right">
                          <span className="tnum block text-sm text-ink">{fmtPrice(quote.price)}</span>
                          <span className={`tnum block text-xs ${up ? "text-gain" : "text-loss"}`}>
                            {fmtPct(quote.changePct)}
                          </span>
                        </span>
                      )}
                      <span className="ml-2 text-ink-faint">
                        {owned ? <CornerDownLeft size={14} /> : <Plus size={14} />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
