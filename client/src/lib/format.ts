const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export const fmtPrice = (n: number): string => usd.format(n);

export const fmtChange = (n: number): string => `${n >= 0 ? "+" : ""}${n.toFixed(2)}`;

export const fmtPct = (n: number): string => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export const fmtCompact = (n: number): string => compact.format(n);

export const fmtTime = (ts: number): string =>
  new Date(ts).toLocaleTimeString("en-US", { hour12: false });

const int = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
export const fmtInt = (n: number): string => int.format(n);
