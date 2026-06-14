import { EventEmitter } from "node:events";
import type { Quote } from "./types.js";

/**
 * Instrument universe. Real prices would come from a market-data vendor; here we
 * synthesise ticks with a geometric random walk so movement looks like a real
 * equity. CUPI100 is the one exception — a fictional "house" index used as a
 * branded demo easter-egg that only ever ticks upward (see tickAll).
 */
const UNIVERSE: Array<
  Pick<Quote, "symbol" | "name" | "sector"> & { seed: number; vol: number; special?: boolean }
> = [
  { symbol: "CUPI100", name: "CUPI Guaranteed Growth Index", sector: "CUPI Exclusive", seed: 1000, vol: 0, special: true },
  { symbol: "GOOG", name: "Alphabet Inc.", sector: "Communication Services", seed: 178.42, vol: 0.0011 },
  { symbol: "TSLA", name: "Tesla, Inc.", sector: "Consumer Discretionary", seed: 251.18, vol: 0.0022 },
  { symbol: "AMZN", name: "Amazon.com, Inc.", sector: "Consumer Discretionary", seed: 197.6, vol: 0.0013 },
  { symbol: "META", name: "Meta Platforms, Inc.", sector: "Communication Services", seed: 591.04, vol: 0.0015 },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Information Technology", seed: 132.91, vol: 0.0025 },
];

export const SUPPORTED_SYMBOLS = UNIVERSE.map((u) => u.symbol);
export const SPECIAL_SYMBOLS = UNIVERSE.filter((u) => u.special).map((u) => u.symbol);

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Box–Muller transform -> a standard-normal sample for believable drift. */
function gaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export class PriceEngine extends EventEmitter {
  private quotes = new Map<string, Quote>();
  private vols = new Map<string, number>();
  private special = new Set<string>();
  private timer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    const now = Date.now();
    for (const u of UNIVERSE) {
      const prevClose = round2(u.seed);
      // CUPI100 opens exactly at its launch value so it shows pure profit from
      // the very first tick; the others get a small overnight gap.
      const open = u.special ? prevClose : round2(prevClose * (1 + gaussian() * 0.004));
      const price = open;
      this.quotes.set(u.symbol, {
        symbol: u.symbol,
        name: u.name,
        sector: u.sector,
        price,
        prevClose,
        open,
        dayHigh: Math.max(open, prevClose),
        dayLow: Math.min(open, prevClose),
        change: round2(price - prevClose),
        changePct: round2(((price - prevClose) / prevClose) * 100),
        volume: Math.floor(2_000_000 + Math.random() * 8_000_000),
        ts: now,
      });
      this.vols.set(u.symbol, u.vol);
      if (u.special) this.special.add(u.symbol);
    }
  }

  start(intervalMs = 1000): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.tickAll(), intervalMs);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  getQuote(symbol: string): Quote | undefined {
    return this.quotes.get(symbol);
  }

  snapshot(): Quote[] {
    return [...this.quotes.values()];
  }

  private tickAll(): void {
    const now = Date.now();
    for (const [symbol, q] of this.quotes) {
      if (this.special.has(symbol)) {
        // CUPI100: guaranteed-growth demo instrument. Strictly monotonic — a
        // small positive step every tick, so it never prints red. (Fictional.)
        const step = q.price * (0.0006 + Math.random() * 0.0010);
        q.price = round2(q.price + step);
        q.dayHigh = q.price;
        q.dayLow = q.open; // low never moves below the open — it only climbs
      } else {
        const vol = this.vols.get(symbol) ?? 0.0015;
        const drift = (q.prevClose - q.price) * 0.0008;
        const shock = gaussian() * vol * q.price;
        const next = Math.max(0.5, q.price + drift + shock);
        q.price = round2(next);
        q.dayHigh = Math.max(q.dayHigh, q.price);
        q.dayLow = Math.min(q.dayLow, q.price);
      }
      q.change = round2(q.price - q.prevClose);
      q.changePct = round2(((q.price - q.prevClose) / q.prevClose) * 100);
      q.volume += Math.floor(Math.random() * 25_000);
      q.ts = now;
      this.emit("tick", { ...q });
    }
  }
}

export const priceEngine = new PriceEngine();
