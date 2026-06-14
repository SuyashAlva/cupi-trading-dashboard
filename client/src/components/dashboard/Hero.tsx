import { motion } from "framer-motion";
import { ArrowDown, Command, Trophy } from "lucide-react";
import { useMarket } from "../../store/marketStore";
import { usePortfolio } from "../../store/portfolioStore";
import { usePortfolioValuation } from "../../hooks/usePortfolioValuation";
import { ParticleField } from "../ui/ParticleField";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { fmtInt, fmtPct, fmtPrice } from "../../lib/format";

export function Hero() {
  const val = usePortfolioValuation();
  const brownies = usePortfolio((s) => s.browniePoints);
  const quotes = useMarket((s) => s.quotes);

  const float = [
    quotes["CUPI100"] && { sym: "CUPI100", q: quotes["CUPI100"], cls: "left-[4%] top-[22%]", gold: true },
    quotes["NVDA"] && { sym: "NVDA", q: quotes["NVDA"], cls: "right-[6%] top-[16%]" },
    quotes["TSLA"] && { sym: "TSLA", q: quotes["TSLA"], cls: "right-[14%] bottom-[14%]" },
    quotes["META"] && { sym: "META", q: quotes["META"], cls: "left-[8%] bottom-[16%]" },
  ].filter(Boolean) as Array<{ sym: string; q: any; cls: string; gold?: boolean }>;

  const openPalette = () =>
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  const scrollDown = () =>
    document.getElementById("cupi100")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border">
      <div className="aurora" />
      <div className="absolute inset-0 opacity-70"><ParticleField /></div>
      <div className="grid-fade absolute inset-0" />

      {/* floating live stats */}
      {float.map((f) => (
        <motion.div
          key={f.sym}
          className={`pointer-events-none absolute hidden ${f.cls} md:block`}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={`glass rounded-2xl px-3.5 py-2.5 ${f.gold ? "border-gold/30" : ""}`}>
            <div className={`font-mono text-xs ${f.gold ? "text-gold" : "text-ink-dim"}`}>{f.sym}</div>
            <div className="tnum text-sm font-700 text-ink">{fmtPrice(f.q.price)}</div>
            <div className={`tnum text-[11px] ${f.q.changePct >= 0 ? "text-gain" : "text-loss"}`}>
              {fmtPct(f.q.changePct)}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass pill mx-auto text-ink-dim"
        >
          <Trophy size={12} className="text-gold" /> Now featuring the CUPI100 index
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-display-sm font-700 sm:text-display"
        >
          Invest smarter with <span className="text-grad">CUPI</span>
        </motion.h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-dim">
          Live markets, a real-time paper portfolio, and one index that never lets you down.
        </p>

        {/* quick stats */}
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
          <Stat label="Portfolio value">
            <AnimatedNumber value={val.total} format={fmtPrice} className="text-xl font-700 text-ink" />
          </Stat>
          <Stat label="Total return">
            <span className={`tnum text-xl font-700 ${val.pnl >= 0 ? "text-gain" : "text-loss"}`}>
              {fmtPct(val.pnlPct)}
            </span>
          </Stat>
          <Stat label="Brownie points">
            <span className="tnum text-xl font-700 text-gold">{fmtInt(brownies)}</span>
          </Stat>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button className="btn-brand px-5 py-3" onClick={scrollDown}>
            Explore CUPI100 <ArrowDown size={16} />
          </button>
          <button className="btn-ghost px-4 py-3" onClick={openPalette}>
            <Command size={14} /> Quick add <span className="kbd ml-1">⌘K</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface/80 px-4 py-4 backdrop-blur">
      <div className="text-[11px] uppercase tracking-wider text-ink-faint">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
