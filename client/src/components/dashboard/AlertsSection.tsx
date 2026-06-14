import { Bell, BellRing, X } from "lucide-react";
import { usePortfolio } from "../../store/portfolioStore";
import { SectionHead } from "./TrendingCarousel";
import { fmtPrice } from "../../lib/format";

export function AlertsSection() {
  const alerts = usePortfolio((s) => s.alerts);
  const removeAlert = usePortfolio((s) => s.removeAlert);

  return (
    <section className="panel p-5">
      <SectionHead title="Price alerts" hint={`${alerts.filter((a) => !a.triggered).length} active`} />
      {alerts.length === 0 ? (
        <p className="py-5 text-center text-sm text-ink-dim">No alerts yet. Open a stock and set one to get pinged.</p>
      ) : (
        <div className="space-y-1.5">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                a.triggered ? "border-gold/30 bg-gold/[0.06]" : "border-border bg-surface/60"
              }`}
            >
              {a.triggered ? <BellRing size={15} className="text-gold" /> : <Bell size={15} className="text-ink-dim" />}
              <div className="text-sm">
                <span className="font-mono text-ink">{a.symbol}</span>{" "}
                <span className="text-ink-dim">{a.direction}</span>{" "}
                <span className="tnum text-ink">{fmtPrice(a.target)}</span>
              </div>
              <span className={`ml-auto text-xs ${a.triggered ? "text-gold" : "text-ink-faint"}`}>
                {a.triggered ? "Triggered" : "Watching"}
              </span>
              <button onClick={() => removeAlert(a.id)} className="text-ink-faint hover:text-loss" aria-label="Remove alert">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
