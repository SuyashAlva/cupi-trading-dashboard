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
  ts: number;
}

// ---- Typed Socket.io contracts (mirror the server) ----
export interface ServerToClientEvents {
  snapshot: (quotes: Quote[]) => void;
  tick: (quote: Quote) => void;
  subscribed: (symbols: string[]) => void;
  "server:error": (message: string) => void;
}
export interface ClientToServerEvents {
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
}

export type ConnectionStatus = "connecting" | "online" | "reconnecting" | "offline";

export type TradeSide = "BUY" | "SELL";

export interface Position {
  symbol: string;
  qty: number;
  avgPrice: number;
}

export interface Trade {
  id: string;
  symbol: string;
  side: TradeSide;
  qty: number;
  price: number;
  ts: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  direction: "above" | "below";
  target: number;
  triggered: boolean;
}
