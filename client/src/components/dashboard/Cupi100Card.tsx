import { motion } from "framer-motion";
import { Crown, Info, Sparkles, Trophy } from "lucide-react";
import { useMarket } from "../../store/marketStore";
import { usePortfolio } from "../../store/portfolioStore";
import { useToast } from "../ui/Toast";
import { PriceChart } from "./PriceChart";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { fmtInt, fmtPct, fmtPrice } from "../../lib/format";

const GOLD = "#FBBF24";

export function Cupi100Card() {
  const quote = useMarket((s) => s.quotes["CUPI100"]);
  const history = useMarket((s) => s.history["CUPI100"]);
  const execute = usePortfolio((s) => s.execute);
  const brownies = usePortfolio((s) => s.browniePoints);
  const position = usePortfolio((s) => s.positions["CUPI100"]);
  const { push } = useToast();

  const claim = () => {
    if (!quote) return;
    const err = execute("CUPI100", "BUY", 10, quote.price);
    if (err) return push({ kind: "error", title: "Couldn't add CUPI100", detail: err });
    push({ kind: "success", title: "+100 brownie points", detail: "10 CUPI100 added to your portfolio" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="shine-wrap relative overflow-hidden rounded-3xl p-[1.5px]"
      style={{ backgroundImage: "linear-gradient(120deg, #FDE68A, #FBBF24 45%, #B45309)" }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#1a1407]/95 p-6 sm:p-8">
        {/* gold ambient glow */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #FBBF24, transparent 70%)" }}
        />

        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          {/* Left: identity + stats */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill bg-gold/15 text-gold">
                <Crown size={13} /> CUPI Exclusive
              </span>
              <span className="pill bg-gain/15 text-gain">
                <Sparkles size={12} /> 100% profitable since launch
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl text-[#3a2606]"
                style={{ backgroundImage: "linear-gradient(135deg,#FDE68A,#F59E0B)" }}
              >
                <Trophy size={24} />
              </span>
              <div>
                <h2 className="font-display text-3xl font-700 tracking-tight text-grad-gold">CUPI100</h2>
                <p className="text-sm text-gold/70">Guaranteed Growth Index</p>
              </div>
            </div>

            <div className="mt-6 flex items-end gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gold/60">Index level</div>
                {quote ? (
                  <AnimatedNumber value={quote.price} format={fmtPrice} className="block text-4xl font-700 text-gold" />
                ) : (
                  <div className="h-10 w-40 skeleton rounded-lg" />
                )}
              </div>
              {quote && (
                <div className="tnum mb-1 rounded-lg bg-gain/15 px-2 py-1 text-sm font-600 text-gain">
                  ▲ {fmtPct(quote.changePct)}
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <MiniStat label="Brownie points" value={fmtInt(brownies)} gold />
              <MiniStat label="Your holding" value={position ? `${position.qty} units` : "—"} />
              <MiniStat label="Volatility" value="0.00%" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="btn-gold px-5 py-2.5" onClick={claim}>
                <Trophy size={15} /> Claim 10 units (+100 pts)
              </button>
              <span className="inline-flex items-center gap-1.5 text-xs text-gold/55">
                <Info size={12} /> Fictional demo instrument — not a real security.
              </span>
            </div>
          </div>

          {/* Right: live gold chart */}
          <div className="relative min-h-[220px] rounded-2xl border border-gold/15 bg-black/20 p-2">
            <div className="absolute left-4 top-3 z-10 text-[11px] uppercase tracking-wider text-gold/50">
              Live · only goes up
            </div>
            <PriceChart data={history ?? []} up color={GOLD} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function MiniStat({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="rounded-xl border border-gold/10 bg-black/20 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-gold/50">{label}</div>
      <div className={`tnum mt-0.5 text-sm font-600 ${gold ? "text-gold" : "text-ink"}`}>{value}</div>
    </div>
  );
}
