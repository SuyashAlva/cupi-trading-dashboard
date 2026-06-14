import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { RotateCcw } from "lucide-react";
import { usePortfolio } from "../../store/portfolioStore";
import { usePortfolioValuation } from "../../hooks/usePortfolioValuation";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { SectionHead } from "./TrendingCarousel";
import { fmtPct, fmtPrice } from "../../lib/format";

const COLORS = ["#7C3AED", "#A855F7", "#22C55E", "#FBBF24", "#38BDF8", "#F43F5E"];

export function PortfolioSection() {
  const val = usePortfolioValuation();
  const reset = usePortfolio((s) => s.reset);
  const up = val.pnl >= 0;

  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between">
        <SectionHead title="Portfolio" />
        <button className="btn-ghost px-2.5 py-1.5 text-xs" onClick={reset} title="Reset paper account">
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={val.rows.length ? val.rows : [{ symbol: "Cash", value: 1 }]}
                dataKey="value"
                innerRadius={38}
                outerRadius={56}
                paddingAngle={2}
                stroke="none"
              >
                {(val.rows.length ? val.rows : [{ symbol: "Cash" }]).map((_, i) => (
                  <Cell key={i} fill={val.rows.length ? COLORS[i % COLORS.length] : "#1E2850"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className={`tnum text-sm font-700 ${up ? "text-gain" : "text-loss"}`}>{fmtPct(val.pnlPct)}</span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-ink-faint">Total value</div>
          <AnimatedNumber value={val.total} format={fmtPrice} className="block text-2xl font-700 text-ink" />
          <div className={`tnum mt-0.5 text-sm font-600 ${up ? "text-gain" : "text-loss"}`}>
            {up ? "+" : ""}{fmtPrice(val.pnl)} all-time
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
        <KV label="Invested" value={fmtPrice(val.invested)} />
        <KV label="Cash" value={fmtPrice(val.cash)} />
      </div>

      <div className="mt-4 space-y-1">
        {val.rows.length === 0 ? (
          <p className="py-4 text-center text-sm text-ink-dim">No positions yet. Pick a stock and hit Buy.</p>
        ) : (
          val.rows.map((r, i) => (
            <div key={r.symbol} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className={`font-mono text-sm ${r.symbol === "CUPI100" ? "text-gold" : "text-ink"}`}>{r.symbol}</span>
              <span className="text-xs text-ink-faint">{r.qty} @ {fmtPrice(r.avgPrice)}</span>
              <span className="tnum ml-auto text-sm text-ink">{fmtPrice(r.value)}</span>
              <span className={`tnum w-20 text-right text-xs ${r.pnl >= 0 ? "text-gain" : "text-loss"}`}>
                {r.pnl >= 0 ? "+" : ""}{fmtPrice(r.pnl)}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-ink-faint">{label}</div>
      <div className="tnum mt-0.5 text-sm font-600 text-ink">{value}</div>
    </div>
  );
}
