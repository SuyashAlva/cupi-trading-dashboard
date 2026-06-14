import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, TrendingDown, TrendingUp, X } from "lucide-react";
import { useMarket } from "../../store/marketStore";
import { usePortfolio } from "../../store/portfolioStore";
import { useUi } from "../../store/uiStore";
import { useToast } from "../ui/Toast";
import { FlashPrice } from "../ui/FlashPrice";
import { PriceChart } from "./PriceChart";
import { fmtChange, fmtCompact, fmtPct, fmtPrice } from "../../lib/format";
import type { TradeSide } from "../../types";

const WINDOWS = [{ label: "30s", n: 30 }, { label: "1m", n: 60 }, { label: "2m", n: 120 }];

export function StockDrawer() {
  const open = useUi((s) => s.drawerOpen);
  const close = useUi((s) => s.closeDrawer);
  const selected = useMarket((s) => s.selected);
  const quote = useMarket((s) => (selected ? s.quotes[selected] : undefined));
  const history = useMarket((s) => (selected ? s.history[selected] : undefined));
  const [win, setWin] = useState(2);

  const windowed = useMemo(() => {
    const all = history ?? [];
    const n = WINDOWS[win].n;
    return all.length > n ? all.slice(all.length - n) : all;
  }, [history, win]);

  const gold = selected === "CUPI100";
  const up = (quote?.changePct ?? 0) >= 0;

  return (
    <AnimatePresence>
      {open && quote && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-surface"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-start justify-between border-b border-border p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`font-display text-2xl font-700 ${gold ? "text-gold" : ""}`}>{quote.symbol}</h2>
                  <span className="pill border border-border bg-surface-2 text-ink-dim">{quote.sector}</span>
                </div>
                <p className="mt-0.5 text-sm text-ink-dim">{quote.name}</p>
              </div>
              <button className="btn-ghost px-2.5 py-2" onClick={close} aria-label="Close"><X size={16} /></button>
            </div>

            <div className="flex items-end justify-between px-5 pt-4">
              <FlashPrice value={quote.price} className="text-3xl font-700" />
              <div className={`tnum flex items-center gap-1 text-sm font-600 ${up ? "text-gain" : "text-loss"}`}>
                {up ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                {fmtChange(quote.change)} ({fmtPct(quote.changePct)})
              </div>
            </div>

            <div className="flex items-center justify-between px-5 pt-3">
              <span className="text-xs text-ink-faint">Live session</span>
              <div className="flex gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
                {WINDOWS.map((w, i) => (
                  <button key={w.label} onClick={() => setWin(i)} className={`seg ${i === win ? "seg-active" : ""}`}>{w.label}</button>
                ))}
              </div>
            </div>

            <div className="h-52 px-3 py-2"><PriceChart data={windowed} up={up} color={gold ? "#FBBF24" : undefined} /></div>

            <div className="grid grid-cols-2 gap-px border-y border-border bg-border sm:grid-cols-4">
              <Stat label="Open" value={fmtPrice(quote.open)} />
              <Stat label="Prev" value={fmtPrice(quote.prevClose)} />
              <Stat label="High" value={fmtPrice(quote.dayHigh)} />
              <Stat label="Low" value={fmtPrice(quote.dayLow)} />
            </div>
            <div className="px-5 py-2 text-xs text-ink-faint">Volume <span className="tnum text-ink-dim">{fmtCompact(quote.volume)}</span></div>

            <div className="mt-auto border-t border-border p-5">
              <TradeTicket symbol={quote.symbol} price={quote.price} gold={gold} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-ink-faint">{label}</div>
      <div className="tnum mt-0.5 text-sm font-600 text-ink">{value}</div>
    </div>
  );
}

function TradeTicket({ symbol, price, gold }: { symbol: string; price: number; gold: boolean }) {
  const execute = usePortfolio((s) => s.execute);
  const addAlert = usePortfolio((s) => s.addAlert);
  const { push } = useToast();
  const [qty, setQty] = useState(10);
  const [target, setTarget] = useState<number>(Math.round(price));

  const trade = (side: TradeSide) => {
    const err = execute(symbol, side, qty, price);
    if (err) push({ kind: "error", title: "Order rejected", detail: err });
    else push({
      kind: "success",
      title: `${side} ${qty} ${symbol}`,
      detail: gold ? `+${qty * 10} brownie points` : `Filled at ${fmtPrice(price)}`,
    });
  };

  const createAlert = () => {
    const direction = target >= price ? "above" : "below";
    addAlert({ symbol, direction, target });
    if (typeof Notification !== "undefined" && Notification.permission === "default") Notification.requestPermission();
    push({ kind: "info", title: "Alert set", detail: `${symbol} ${direction} ${fmtPrice(target)}` });
  };

  return (
    <>
      <div className="flex items-end gap-3">
        <label className="text-xs text-ink-dim">
          Quantity
          <input type="number" min={1} className="input tnum mt-1 w-24" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
        </label>
        <button className={gold ? "btn-gold flex-1" : "btn flex-1 bg-gain/15 text-gain hover:bg-gain/25"} onClick={() => trade("BUY")}>Buy</button>
        <button className="btn flex-1 bg-loss/15 text-loss hover:bg-loss/25" onClick={() => trade("SELL")}>Sell</button>
      </div>
      <div className="mt-2 text-right text-xs text-ink-dim">Est. cost <span className="tnum text-ink">{fmtPrice(qty * price)}</span></div>
      <div className="mt-4 flex items-end gap-3 border-t border-border pt-4">
        <label className="text-xs text-ink-dim">
          Alert price
          <input type="number" className="input tnum mt-1 w-28" value={target} onChange={(e) => setTarget(Number(e.target.value))} />
        </label>
        <button className="btn-ghost" onClick={createAlert}><Bell size={15} /> Set alert</button>
      </div>
    </>
  );
}
