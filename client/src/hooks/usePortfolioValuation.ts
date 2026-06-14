import { useMemo } from "react";
import { useMarket } from "../store/marketStore";
import { STARTING_CASH, usePortfolio } from "../store/portfolioStore";

export interface Valuation {
  total: number;
  invested: number;
  cash: number;
  pnl: number;
  pnlPct: number;
  dayReturn: number;
  rows: Array<{ symbol: string; qty: number; avgPrice: number; price: number; value: number; pnl: number }>;
}

/** Marks the paper portfolio to market on every render using live quotes. */
export function usePortfolioValuation(): Valuation {
  const positions = usePortfolio((s) => s.positions);
  const cash = usePortfolio((s) => s.cash);
  const quotes = useMarket((s) => s.quotes);

  return useMemo(() => {
    let invested = 0;
    let costBasis = 0;
    const rows = Object.values(positions).map((p) => {
      const price = quotes[p.symbol]?.price ?? p.avgPrice;
      const value = price * p.qty;
      invested += value;
      costBasis += p.avgPrice * p.qty;
      return { symbol: p.symbol, qty: p.qty, avgPrice: p.avgPrice, price, value, pnl: value - p.avgPrice * p.qty };
    });
    rows.sort((a, b) => b.value - a.value);
    const total = cash + invested;
    const pnl = total - STARTING_CASH;
    return {
      total,
      invested,
      cash,
      pnl,
      pnlPct: STARTING_CASH ? (pnl / STARTING_CASH) * 100 : 0,
      dayReturn: invested - costBasis,
      rows,
    };
  }, [positions, cash, quotes]);
}
