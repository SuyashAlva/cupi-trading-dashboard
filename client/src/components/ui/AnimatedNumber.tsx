import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  format: (n: number) => string;
  className?: string;
  durationMs?: number;
}

/**
 * Tweens the displayed value toward the target with an ease-out curve, so the
 * portfolio total and large prices "roll" rather than snap. Respects
 * prefers-reduced-motion by jumping straight to the value.
 */
export function AnimatedNumber({ value, format, className = "", durationMs = 500 }: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    fromRef.current = display;
    startRef.current = performance.now();
    const from = fromRef.current;
    const delta = value - from;

    const step = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + delta * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return <span className={`tnum ${className}`}>{format(display)}</span>;
}
