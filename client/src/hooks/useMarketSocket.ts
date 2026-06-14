import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "../store/authStore";
import { useMarket } from "../store/marketStore";
import { usePortfolio } from "../store/portfolioStore";
import { createSocket, type MarketSocket } from "../services/socket";

function notify(body: string) {
  // Surface in-app via a toast (see Dashboard) and as a native notification.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pulse:alert", { detail: body }));
  }
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") new Notification("Pulse price alert", { body });
}

function evaluateAlerts(symbol: string, price: number) {
  const { alerts, triggerAlert } = usePortfolio.getState();
  for (const a of alerts) {
    if (a.triggered || a.symbol !== symbol) continue;
    const hit = a.direction === "above" ? price >= a.target : price <= a.target;
    if (hit) {
      triggerAlert(a.id);
      notify(`${symbol} crossed ${a.direction} ${a.target.toFixed(2)} — now ${price.toFixed(2)}`);
    }
  }
}

/**
 * Owns the single Socket.io connection for the session: authenticates with the
 * JWT in the handshake, streams ticks into the market store, keeps room
 * subscriptions in sync with the user's watchlist, evaluates price alerts, and
 * relies on Socket.io for transparent reconnection.
 */
export function useMarketSocket(): void {
  const token = useAuth((s) => s.token);
  const socketRef = useRef<MarketSocket | null>(null);
  const sentRef = useRef<Set<string>>(new Set());

  // Reconcile the server's room membership with the current watchlist.
  const syncSubscriptions = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    const desired = new Set(useMarket.getState().subscriptions);
    const sent = sentRef.current;
    const toAdd = [...desired].filter((s) => !sent.has(s));
    const toRemove = [...sent].filter((s) => !desired.has(s));
    if (toAdd.length) {
      socket.emit("subscribe", toAdd);
      toAdd.forEach((s) => sent.add(s));
    }
    if (toRemove.length) {
      socket.emit("unsubscribe", toRemove);
      toRemove.forEach((s) => sent.delete(s));
    }
  }, []);

  // Connection lifecycle — re-runs only when the token changes.
  useEffect(() => {
    if (!token) return;
    const market = useMarket.getState();
    market.setStatus("connecting");

    const socket = createSocket(token);
    socketRef.current = socket;

    socket.on("connect", () => {
      useMarket.getState().setStatus("online");
      sentRef.current = new Set();
      syncSubscriptions();
    });
    socket.io.on("reconnect_attempt", () => useMarket.getState().setStatus("reconnecting"));
    socket.on("disconnect", () => useMarket.getState().setStatus("reconnecting"));
    socket.on("connect_error", () => useMarket.getState().setStatus("reconnecting"));

    socket.on("snapshot", (quotes) => useMarket.getState().applySnapshot(quotes));
    socket.on("tick", (quote) => {
      useMarket.getState().applyTick(quote);
      evaluateAlerts(quote.symbol, quote.price);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      useMarket.getState().setStatus("offline");
    };
  }, [token, syncSubscriptions]);

  // Push subscribe/unsubscribe diffs whenever the watchlist changes.
  useEffect(() => useMarket.subscribe((s) => s.subscriptions, syncSubscriptions), [syncSubscriptions]);
}
