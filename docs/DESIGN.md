# Design System — Pulse

The visual language behind the dashboard, and the rationale a designer would give for each decision. Inspired by the density of Zerodha Kite and TradingView, the calm hierarchy of Groww, and the friendliness of Robinhood — without copying any of them.

## Design thesis

**A modern trading terminal.** A dark canvas is the native language of market software, so it's a deliberate, domain-appropriate choice rather than a default. The one risk taken: the **brand accent is kept entirely separate from gain/loss colors**. Interactive elements are indigo-violet; profit is mint, loss is coral. "Clickable" is never confused with "making money" — a discipline mature fintech apps follow and beginner dashboards miss.

**Signature element:** the live price. Tabular numerics that flash green/red on every tick, sparklines that draw in real time, and a portfolio total that rolls when it changes give the surface a genuine "live wire" feel. Everything else stays quiet so this carries the personality.

## Color palette

Defined once as Tailwind tokens (`client/tailwind.config.js`); no raw hex in components.

| Token | Hex | Role |
|---|---|---|
| `bg` | `#0A0E17` | App canvas — deep blue-black, with two faint brand/teal glows layered on |
| `surface` / `surface-2` / `surface-3` | `#121826` / `#1A2233` / `#222C40` | Elevation tiers |
| `border` / `border-strong` | `#222C40` / `#2E3A52` | Hairlines / emphasised edges |
| `ink` / `ink-dim` / `ink-faint` | `#E6EAF2` / `#8A93A6` / `#5A6378` | Text tiers |
| `accent` / `accent-soft` | `#6C5CE7` / `#8A7CF0` | **Brand / interactive** only |
| `gain` | `#00D09C` | **Up moves, profit** only |
| `loss` | `#FF5A6A` | **Down moves, loss** only |

## Typography

A deliberate three-face system: **Space Grotesk** (display — brand, headings, the big price), **Inter** (body/UI), **JetBrains Mono** (data — ticker symbols). Numeric font-weights `500/600/700` are registered as tokens. All numbers use `tabular-nums` (`.tnum`) so digits hold a fixed width and the layout never jitters on a per-second update.

## Spacing & shape

4px base scale (4/8/12/16/24/32). Radii: `14px` inputs, `18px` cards, full pills for chips. A single layered `card` shadow + surface tokens do the elevation work; depth doesn't come from heavy drop shadows. A faint dotted "terminal grid" sits behind login and the main area.

## Component hierarchy

```
App  (QueryClientProvider → ToastProvider)
├─ Login                         split screen: brand + live ticker tape | email auth
└─ Dashboard
   ├─ TopBar                     Logo · ⌘K quick-add · market clock · ConnectionBadge · user · logout
   ├─ MarketStrip                index-style bar of every instrument
   ├─ Watchlist                  subscribe input (validated) + quick-add chips
   │  ├─ WatchRowSkeleton ×5     shimmer before first snapshot
   │  └─ WatchRow ×N             symbol · Sparkline · FlashPrice · %change · remove
   ├─ StockDetail                selected instrument
   │  ├─ FlashPrice              big live price
   │  ├─ segmented control       30s / 1m / 2m live window
   │  ├─ PriceChart              recharts area + gridlines
   │  ├─ Stat ×6                 open / prev / high / low / volume / range
   │  └─ TradeAndAlert           Buy · Sell · Set alert  → toasts
   ├─ PortfolioPanel             AnimatedNumber total · live P&L · positions
   ├─ AlertsPanel                active + triggered alerts
   └─ CommandPalette             ⌘K fuzzy instrument search
   ui/  Logo · Sparkline · FlashPrice · AnimatedNumber · ConnectionBadge · Toast · Skeleton
```

## Layout

Desktop: a three-column grid (`320px · fluid · 340px`) under a header and market strip — navigation left, focus center, status right, the mental model of every trading client. It collapses to a single stacked column on mobile.

## Interaction states

- **Hover** — rows lift to `surface-2`, ghost buttons gain a stronger border, quick-add chips shift toward the accent, the remove (✕) reveals on row hover only.
- **Loading** — shimmer skeletons in the watchlist before the first snapshot; the login button shows "Signing in…" and disables.
- **Empty** — written as invitations: "Your watchlist is empty. Add a ticker above…", "No positions yet. Pick a stock and hit Buy…".
- **Error** — plain and actionable: "\"XYZ\" isn't supported. Try: GOOG, TSLA…"; a rejected order toasts "Insufficient buying power."; a dropped socket shows a "Reconnecting" badge.
- **Success** — order fills toast "BUY 10 NVDA · filled at $132.41"; alerts confirm on creation and again, distinctly, when they trigger.

## Motion & micro-interactions

Spent only where it communicates something (scattered animation reads as generated):

- **Price flash** — 600ms green/red pulse per tick, the core "something happened" signal.
- **Animated counter** — portfolio total tweens with an ease-out cubic.
- **Live sparklines & area chart** redraw as ticks arrive.
- **Pulsing "Live" dot** only while the socket is healthy.
- **List & toast transitions** via Framer Motion `layout` so adds/removes feel physical.
- **Command palette** spring-scales in; **login** does a single subtle fade-and-rise.
- A **marquee ticker tape** animates the login's left panel.

## Quality floor

Responsive to mobile; `:focus-visible` accent rings everywhere; `prefers-reduced-motion` collapses all animation to ~0ms; semantic headings and aria labels on icon-only controls.
