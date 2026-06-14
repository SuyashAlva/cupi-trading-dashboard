import { SectionHead } from "./TrendingCarousel";

const NEWS = [
  { tag: "Markets", sentiment: "pos", source: "CUPI Wire", time: "2m", title: "Tech megacaps extend rally as AI capex guidance lifts sentiment" },
  { tag: "Earnings", sentiment: "neu", source: "Street Daily", time: "18m", title: "Chipmakers in focus ahead of a data-center demand readout" },
  { tag: "CUPI100", sentiment: "pos", source: "CUPI Labs", time: "31m", title: "CUPI100 marks another session at all-time highs — streak intact" },
  { tag: "Macro", sentiment: "neg", source: "Macro Note", time: "1h", title: "Yields tick higher as traders trim rate-cut bets for the quarter" },
];

const DOT: Record<string, string> = { pos: "bg-gain", neu: "bg-brand-2", neg: "bg-loss" };

export function MarketNews() {
  return (
    <section className="panel p-5">
      <SectionHead title="Market news" hint="demo headlines" />
      <div className="grid gap-2.5 sm:grid-cols-2">
        {NEWS.map((n) => (
          <article key={n.title} className="glow-hover cursor-default rounded-2xl border border-border bg-surface/60 p-4">
            <div className="flex items-center gap-2 text-xs">
              <span className={`h-1.5 w-1.5 rounded-full ${DOT[n.sentiment]}`} />
              <span className="font-600 text-ink-dim">{n.tag}</span>
              <span className="text-ink-faint">· {n.source} · {n.time}</span>
            </div>
            <p className="mt-2 text-sm leading-snug text-ink">{n.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
