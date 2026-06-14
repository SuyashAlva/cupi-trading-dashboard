import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../types";

export type MarketSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// In dev, Vite proxies /socket.io to the Node server. In prod, point at the
// deployed backend via VITE_WS_URL.
const URL = import.meta.env.VITE_WS_URL ?? "";

/**
 * Create an authenticated Socket.io client. The JWT travels in the handshake
 * `auth` payload and is verified server-side before any event is accepted.
 * Reconnection (with backoff) is handled by Socket.io itself.
 */
export function createSocket(token: string): MarketSocket {
  return io(URL, {
    auth: { token },
    transports: ["websocket"],
    reconnectionDelay: 500,
    reconnectionDelayMax: 8000,
  });
}
