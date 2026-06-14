import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useMarket } from "../../store/marketStore";
import { useUi } from "../../store/uiStore";
import { Sparkline } from "../ui/Sparkline";
import { FlashPrice } from "../ui/FlashPrice";
import { WatchRowSkeleton } from "../ui/Skeleton";
import { SectionHead } from "./TrendingCarousel";
import { fmtPct } from "../../lib/format";

export function WatchlistSection({ loading = false }: { loading?: boolean }) {
  const supported = useMarket((s) => s.supported);
  const subscriptions = useMarket((s) => s.subscriptions);
  const quotes = useMarket((s) => s.quotes);
  const history = useMarket((s) => s.history);
  const subscribe = useMarket((s) => s.subscribe);
  const unsubscribe = useMarket((s) => s.unsubscribe);
  const select = useMarket((s) => s.select);
  const openDrawer = useUi((s) => s.openDrawer);
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState("");

  const add = () => {
    const sym = draft.trim().toUpperCase();
    if (!sym) return;
    if (!supported.includes(sym)) return setErr(`"${sym}" isn't supported. Try: ${supported.slice(0, 4).join(", ")}…`);
    subscribe(sym);
    setDraft("");
    setErr("");
  };

  const open = (sym: string) => { select(sym); openDrawer(); };

  return (
    <section className="panel p-5">
      <SectionHead title="Watchlist" hint={`${subscriptions.length} tracked`} />

      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Add ticker (e.g. NVDA)"
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setErr(""); }}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="btn-brand shrink-0 px-3" onClick={add} aria-label="Add"><Plus size={16} /></button>
      </div>
      {err && <p className="mt-2 text-xs text-loss">{err}</p>}

      <div className="mt-3 divide-y divide-border/60">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <WatchRowSkeleton key={i} />)
        ) : subscriptions.length === 0 ? (
          <p className="px-1 py-8 text-center text-sm text-ink-dim">Your watchlist is empty. Add a ticker above to start streaming.</p>
        ) : (
          <AnimatePresence initial={false}>
            {subscriptions.map((sym) => {
              const q = quotes[sym];
              const up = (q?.changePct ?? 0) >= 0;
              const gold = sym === "CUPI100";
              const hist = (history[sym] ?? []).map((p) => p.price);
              return (
                <motion.div
                  key={sym}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.04]"
                  onClick={() => open(sym)}
                >
                  <div className="w-16">
                    <div className={`font-mono text-sm font-600 ${gold ? "text-gold" : "text-ink"}`}>{sym}</div>
                  </div>
                  <Sparkline data={hist} width={70} height={26} color={gold ? "#FBBF24" : up ? "#22C55E" : "#F43F5E"} />
                  <div className="ml-auto text-right">
                    <FlashPrice value={q?.price ?? 0} className="text-sm font-600" />
                    <div className={`tnum text-[11px] ${up ? "text-gain" : "text-loss"}`}>{q ? fmtPct(q.changePct) : ""}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); unsubscribe(sym); }}
                    className="ml-1 text-ink-faint opacity-0 transition hover:text-loss group-hover:opacity-100"
                    aria-label={`Remove ${sym}`}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
