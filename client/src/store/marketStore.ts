import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { ConnectionStatus, Quote } from "../types";

const HISTORY_LEN = 120; // ~2 minutes of 1s ticks for charts/sparklines

export interface PricePoint {
  t: number;
  price: number;
}

interface MarketState {
  supported: string[];
  quotes: Record<string, Quote>;
  history: Record<string, PricePoint[]>;
  /** Direction of the most recent tick, used to flash a row green/red. */
  lastDir: Record<string, "up" | "down" | "flat">;
  subscriptions: string[];
  selected: string | null;
  status: ConnectionStatus;

  setSupported: (symbols: string[]) => void;
  setStatus: (status: ConnectionStatus) => void;
  applySnapshot: (quotes: Quote[]) => void;
  applyTick: (quote: Quote) => void;
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
  select: (symbol: string | null) => void;
}

function pushHistory(prev: PricePoint[] | undefined, q: Quote): PricePoint[] {
  const next = (prev ?? []).concat({ t: q.ts, price: q.price });
  return next.length > HISTORY_LEN ? next.slice(next.length - HISTORY_LEN) : next;
}

export const useMarket = create<MarketState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
      supported: [],
      quotes: {},
      history: {},
      lastDir: {},
      subscriptions: [],
      selected: null,
      status: "connecting",

      setSupported: (symbols) => set({ supported: symbols }),
      setStatus: (status) => set({ status }),

      applySnapshot: (quotes) =>
        set((s) => {
          const nextQuotes = { ...s.quotes };
          const nextHistory = { ...s.history };
          for (const q of quotes) {
            nextQuotes[q.symbol] = q;
            if (!nextHistory[q.symbol]?.length) {
              nextHistory[q.symbol] = [{ t: q.ts, price: q.price }];
            }
          }
          return { quotes: nextQuotes, history: nextHistory };
        }),

      applyTick: (q) =>
        set((s) => {
          const prev = s.quotes[q.symbol];
          const dir: "up" | "down" | "flat" = !prev
            ? "flat"
            : q.price > prev.price
              ? "up"
              : q.price < prev.price
                ? "down"
                : "flat";
          return {
            quotes: { ...s.quotes, [q.symbol]: q },
            history: { ...s.history, [q.symbol]: pushHistory(s.history[q.symbol], q) },
            lastDir: { ...s.lastDir, [q.symbol]: dir },
          };
        }),

      subscribe: (symbol) =>
        set((s) => {
          if (s.subscriptions.includes(symbol)) return s;
          return {
            subscriptions: [...s.subscriptions, symbol],
            selected: s.selected ?? symbol,
          };
        }),

      unsubscribe: (symbol) =>
        set((s) => {
          const subscriptions = s.subscriptions.filter((x) => x !== symbol);
          return {
            subscriptions,
            selected: s.selected === symbol ? (subscriptions[0] ?? null) : s.selected,
          };
        }),

      select: (symbol) => set({ selected: symbol ?? get().subscriptions[0] ?? null }),
    }),
      {
        name: "pulse.market",
        // Only the user's watchlist is durable; live data is always re-fetched.
        partialize: (s) => ({ subscriptions: s.subscriptions, selected: s.selected }),
      },
    ),
  ),
);
