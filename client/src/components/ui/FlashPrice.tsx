import { useEffect, useRef, useState } from "react";
import { fmtPrice } from "../../lib/format";

/**
 * Renders a price using tabular figures and flashes the background green or red
 * for ~600ms whenever the value moves. This is the dashboard's signature live
 * micro-interaction.
 */
export function FlashPrice({ value, className = "" }: { value: number; className?: string }) {
  const prev = useRef(value);
  const [flash, setFlash] = useState<"" | "up" | "down">("");

  useEffect(() => {
    if (value > prev.current) setFlash("up");
    else if (value < prev.current) setFlash("down");
    prev.current = value;
    if (value) {
      const t = setTimeout(() => setFlash(""), 600);
      return () => clearTimeout(t);
    }
  }, [value]);

  const flashCls = flash === "up" ? "animate-flash-gain" : flash === "down" ? "animate-flash-loss" : "";

  return (
    <span className={`tnum rounded px-1 ${flashCls} ${className}`}>{fmtPrice(value)}</span>
  );
}
