import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { PriceAlert, Position, Trade, TradeSide } from "../types";

const STARTING_CASH = 100_000;

interface PortfolioState {
  cash: number;
  positions: Record<string, Position>;
  trades: Trade[];
  alerts: PriceAlert[];
  browniePoints: number;

  execute: (symbol: string, side: TradeSide, qty: number, price: number) => string | null;
  addAlert: (a: Omit<PriceAlert, "id" | "triggered">) => void;
  removeAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
  addBrownies: (n: number) => void;
  reset: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const usePortfolio = create<PortfolioState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
      cash: STARTING_CASH,
      positions: {},
      trades: [],
      alerts: [],
      browniePoints: 0,

      execute: (symbol, side, qty, price) => {
        if (qty <= 0) return "Quantity must be positive.";
        const state = get();
        const cost = qty * price;
        const pos = state.positions[symbol];
        // CUPI100 trades earn brownie points — the more you back the house
        // index, the more you're rewarded. (A bit of brand fun.)
        const brownies = symbol === "CUPI100" ? qty * 10 : 0;

        if (side === "BUY") {
          if (cost > state.cash) return "Insufficient buying power.";
          const newQty = (pos?.qty ?? 0) + qty;
          const newAvg = pos ? (pos.avgPrice * pos.qty + cost) / newQty : price;
          set({
            cash: state.cash - cost,
            positions: { ...state.positions, [symbol]: { symbol, qty: newQty, avgPrice: newAvg } },
            trades: [{ id: uid(), symbol, side, qty, price, ts: Date.now() }, ...state.trades].slice(0, 100),
            browniePoints: state.browniePoints + brownies,
          });
          return null;
        }

        // SELL
        if (!pos || pos.qty < qty) return "Not enough shares to sell.";
        const remaining = pos.qty - qty;
        const positions = { ...state.positions };
        if (remaining === 0) delete positions[symbol];
        else positions[symbol] = { ...pos, qty: remaining };
        set({
          cash: state.cash + cost,
          positions,
          trades: [{ id: uid(), symbol, side, qty, price, ts: Date.now() }, ...state.trades].slice(0, 100),
        });
        return null;
      },

      addAlert: (a) =>
        set((s) => ({ alerts: [{ ...a, id: uid(), triggered: false }, ...s.alerts] })),
      removeAlert: (id) => set((s) => ({ alerts: s.alerts.filter((x) => x.id !== id) })),
      triggerAlert: (id) =>
        set((s) => ({ alerts: s.alerts.map((x) => (x.id === id ? { ...x, triggered: true } : x)) })),

      addBrownies: (n) => set((s) => ({ browniePoints: s.browniePoints + n })),

      reset: () => set({ cash: STARTING_CASH, positions: {}, trades: [], alerts: [], browniePoints: 0 }),
    }),
      { name: "pulse.portfolio" },
    ),
  ),
);

export { STARTING_CASH };
