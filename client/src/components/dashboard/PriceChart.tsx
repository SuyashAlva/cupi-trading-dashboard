import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import type { PricePoint } from "../../store/marketStore";
import { fmtPrice, fmtTime } from "../../lib/format";

export function PriceChart({
  data,
  up,
  color: colorOverride,
  height = "100%",
}: {
  data: PricePoint[];
  up: boolean;
  color?: string;
  height?: number | string;
}) {
  const color = colorOverride ?? (up ? "#22C55E" : "#F43F5E");
  if (data.length < 2) {
    return <div className="grid h-full place-items-center text-sm text-ink-faint">Streaming data…</div>;
  }
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pad = (max - min) * 0.15 || 1;
  const gid = `pf-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#222C50" strokeDasharray="2 6" vertical={false} />
        <YAxis domain={[min - pad, max + pad]} hide />
        <Tooltip
          contentStyle={{ background: "#111733", border: "1px solid #33407A", borderRadius: 12, fontSize: 12, boxShadow: "0 12px 30px -14px rgba(0,0,0,0.8)" }}
          labelStyle={{ color: "#9AA3C7" }}
          itemStyle={{ color: "#ECEEF8" }}
          cursor={{ stroke: "#33407A", strokeWidth: 1 }}
          formatter={(v: number) => [fmtPrice(v), "Price"]}
          labelFormatter={(t: number) => fmtTime(t)}
        />
        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2.2} fill={`url(#${gid})`} isAnimationActive={false} dot={false} activeDot={{ r: 3, strokeWidth: 0, fill: color }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
