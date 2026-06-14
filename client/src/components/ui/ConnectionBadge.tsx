import { useMarket } from "../../store/marketStore";
import type { ConnectionStatus } from "../../types";

const COPY: Record<ConnectionStatus, { label: string; dot: string; text: string }> = {
  connecting: { label: "Connecting", dot: "bg-ink-dim", text: "text-ink-dim" },
  online: { label: "Live", dot: "bg-gain", text: "text-gain" },
  reconnecting: { label: "Reconnecting", dot: "bg-loss", text: "text-loss" },
  offline: { label: "Offline", dot: "bg-ink-faint", text: "text-ink-faint" },
};

export function ConnectionBadge() {
  const status = useMarket((s) => s.status);
  const c = COPY[status];
  return (
    <span className={`pill border border-border bg-surface-2 ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${status === "online" ? "animate-pulse-dot" : ""}`} />
      {c.label}
    </span>
  );
}
