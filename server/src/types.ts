// Shared domain + Socket.io event types for the Pulse server.

export interface Quote {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  prevClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  change: number;
  changePct: number;
  volume: number;
  /** Unix ms of the last tick. */
  ts: number;
}

/** A single candle aggregated from the live tick stream (roadmap: candlestick view). */
export interface Candle {
  t: number; // bucket start (unix ms)
  o: number;
  h: number;
  l: number;
  c: number;
}

// ---- Typed Socket.io contracts ----
// Events the SERVER emits to clients.
export interface ServerToClientEvents {
  snapshot: (quotes: Quote[]) => void;
  tick: (quote: Quote) => void;
  subscribed: (symbols: string[]) => void;
  "server:error": (message: string) => void;
}

// Events the CLIENT emits to the server.
export interface ClientToServerEvents {
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
}

// Per-socket data attached during the auth handshake.
export interface SocketData {
  email: string;
}
