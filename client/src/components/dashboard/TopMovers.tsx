import { useMemo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useMarket } from "../../store/marketStore";
import { useUi } from "../../store/uiStore";
import { SectionHead } from "./TrendingCarousel";
import { fmtPct, fmtPrice } from "../../lib/format";

export function TopMovers() {
  const quotes = useMarket((s) => s.quotes);
  const select = useMarket((s) => s.select);
  const openDrawer = useUi((s) => s.openDrawer);

  const { gainers, losers, max } = useMemo(() => {
    const list = Object.values(quotes).filter((q) => q.symbol !== "CUPI100");
    const sorted = [...list].sort((a, b) => b.changePct - a.changePct);
    const max = Math.max(1, ...list.map((q) => Math.abs(q.changePct)));
    return { gainers: sorted.slice(0, 3), losers: sorted.slice(-3).reverse(), max };
  }, [quotes]);

  const Row = ({ q }: { q: (typeof gainers)[number] }) => {
    const up = q.changePct >= 0;
    return (
      <button
        onClick={() => { select(q.symbol); openDrawer(); }}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-white/[0.03]"
      >
        <span className="w-14 font-mono text-sm text-ink">{q.symbol}</span>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className={`absolute inset-y-0 ${up ? "left-1/2 bg-gain" : "right-1/2 bg-loss"}`}
            style={{ width: `${(Math.abs(q.changePct) / max) * 50}%` }}
          />
          <div className="absolute inset-y-0 left-1/2 w-px bg-border-strong" />
        </div>
        <span className="tnum w-16 text-right text-xs text-ink-dim">{fmtPrice(q.price)}</span>
        <span className={`tnum w-16 text-right text-xs font-600 ${up ? "text-gain" : "text-loss"}`}>{fmtPct(q.changePct)}</span>
      </button>
    );
  };

  return (
    <section className="panel p-5">
      <SectionHead title="Top movers" />
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-600 text-gain"><TrendingUp size={13} /> Gainers</div>
      {gainers.map((q) => <Row key={q.symbol} q={q} />)}
      <div className="mb-1.5 mt-3 flex items-center gap-1.5 text-xs font-600 text-loss"><TrendingDown size={13} /> Losers</div>
      {losers.map((q) => <Row key={q.symbol} q={q} />)}
    </section>
  );
}
