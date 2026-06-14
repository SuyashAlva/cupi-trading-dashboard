# CUPI — Visual Identity & Design Spec

The brand and layout system behind the CUPI terminal. Reference points: Linear (restraint, type), Stripe (gradient craft), Ramp/Mercury (calm fintech density), Robinhood (approachability), Arc (playful identity). The goal is a screen a reviewer remembers after 100 submissions — driven by one strong gesture (the violet→green brand gradient + the gold CUPI100 showpiece) rather than a wall of identical cards.

## 1. Redesigned layout

Not a fixed admin grid — a **scrolling, editorial page** with intentional, uneven rhythm:

```
┌ TopNav (sticky, glass) ────────────────────────────────────────────┐
│ HERO  — full-bleed, aurora + particles, giant headline, floating    │
│         live stat chips, 3 quick stats, CTA row                     │
│ CUPI100 — full-width GOLD showpiece (gradient border, shine, chart) │
│ TRENDING — horizontal carousel (overflow-x, no perfect grid)        │
│ ┌───────── 12-col asymmetrical grid (gap-5) ─────────────────────┐  │
│ │ Watchlist  col-span-5 │ Portfolio        col-span-7            │  │
│ │ Activity   col-span-5 │ Top movers col-3 │ Alerts   col-span-4 │  │
│ │ Market news                                       col-span-12  │  │
│ └────────────────────────────────────────────────────────────────┘  │
│ Footer (demo disclaimer)                                            │
└─────────────────────────────────────────────────────────────────────┘
+ StockDrawer (right slide-over)   + CommandPalette (⌘K overlay)
```

Column spans are deliberately unequal (5/7, then 5/3/4) so no row reads as a tidy N-up card grid.

## 2. Component hierarchy

```
App (QueryClientProvider → ToastProvider)
├─ Login            split hero: aurora + ParticleField + gradient headline | email auth
└─ Dashboard
   ├─ TopNav         Logo(wordmark) · ⌘K · brownie-points pill · ConnectionBadge · avatar · logout
   ├─ Hero           aurora · ParticleField · floating stat chips · AnimatedNumber quick stats · CTAs
   ├─ Cupi100Card    gradient-border · shine sweep · Trophy · gold PriceChart · Claim CTA · demo tag
   ├─ TrendingCarousel  overflow-x cards · Sparkline · hover-lift → StockDrawer
   ├─ WatchlistSection  add input · animated rows · Sparkline · FlashPrice → StockDrawer
   ├─ PortfolioSection  allocation donut (Pie) · AnimatedNumber total · positions
   ├─ ActivityFeed   live timeline (ticks/trades/alerts) via store subscriptions
   ├─ TopMovers      diverging bars, gainers/losers
   ├─ AlertsSection  active/triggered alerts
   ├─ MarketNews     themed demo headlines
   ├─ StockDrawer    slide-over: FlashPrice · timeframe seg · PriceChart · stats · trade ticket
   └─ CommandPalette ⌘K fuzzy search
   ui/  Logo · ParticleField · Sparkline · FlashPrice · AnimatedNumber · ConnectionBadge · Toast · Skeleton
```

## 3. Exact spacing

4px base scale. Page: `max-w-7xl`, padding `px-6 py-8`, section rhythm `space-y-10`. Grid gap `gap-5` (20px). Panels: padding `p-5` (20px), radius `rounded-3xl` (28px). CUPI100: outer `p-[1.5px]` gradient frame → inner `rounded-3xl p-8` (32px). Cards/inputs radius `rounded-2xl`/`rounded-xl` (22/16px). Pills `px-3 py-1`. Hero vertical padding `py-28` (112px) for a confident, premium void.

## 4. Exact typography

Faces: **Space Grotesk** (display), **Inter** (UI/body), **JetBrains Mono** (tickers/data). Custom display scale (in `tailwind.config.js`):

| Token | Size | Line | Tracking |
|---|---|---|---|
| `display-lg` | 5.5rem (88px) | 0.95 | −0.04em |
| `display` | 4rem (64px) | 0.98 | −0.035em |
| `display-sm` | 2.75rem (44px) | 1.02 | −0.03em |

Body uses Tailwind defaults: `text-lg` (18px) hero subcopy, `text-sm` (14px) UI, `text-xs` (12px) labels, `text-[11px]`/`[10px]` for uppercase micro-labels (tracking `0.16em`). Weights `500/600/700` registered as utilities. All numbers use `.tnum` (tabular figures) to stop layout jitter at 1Hz.

## 5. Animation specifications

| Element | Spec |
|---|---|
| Aurora blobs | `auroraShift` 18s / 22s-reverse, translate+scale, blur 60px, opacity 0.55 |
| Particles | canvas, ≤48 motes, drift ±0.25px/frame, links < 120px at α≤0.12 |
| Hero headline | fade+rise 0.6s, cubic-bezier(0.22,1,0.36,1) |
| Floating stat chips | `y: [0,-10,0]` 6–9s ease-in-out infinite |
| CUPI100 shine | diagonal sweep 4.5s ease-in-out infinite |
| Price flash | 0.6s green/red background pulse on each tick |
| Number roll | AnimatedNumber, ease-out cubic, ~500ms |
| Watchlist rows | Framer `layout` + height/opacity enter-exit |
| Activity items | slide-in `x:-8→0`, layout reflow |
| StockDrawer | spring (stiffness 320, damping 34) from right |
| CommandPalette | spring scale/translate in |
| Hover lift | `glow-hover`: translateY(-2px) + violet glow ring |
| Live dot | `pulse-dot` 1.6s opacity pulse |

All collapse to ~0ms under `prefers-reduced-motion`.

## 6. Tailwind implementation

Color tokens (`tailwind.config.js`): `bg #0B1020` (deep navy), surfaces `#111733/#161E3D/#1E2850`, brand `#7C3AED` / brand-2 `#A855F7`, accent/gain `#22C55E`, loss `#F43F5E`, gold `#FBBF24` / gold-2 `#F59E0B` / gold-deep `#B45309`. Gradients: `brand-grad`, `gold-grad`, `brand-text`. Shadows: `card`, `glow`, `glow-gold`. Component classes (in `@layer components`): `.glass`, `.panel`, `.btn-brand`, `.btn-gold`, `.btn-ghost`, `.glow-hover`, `.seg`, `.kbd`, `.input`, `.pill`. Utilities in CSS: `.text-grad`, `.text-grad-gold`, `.aurora`, `.grid-fade`, `.shine-wrap`, `.no-scrollbar`, skeleton shimmer.

## 7. Visual mockup description

On load, a near-black navy canvas with two slow violet auroras breathing behind a field of faint drifting particles. A giant gradient headline — **"Invest smarter with CUPI"** — sits dead-center, the word CUPI rendered in a violet→green gradient, with small glassy price chips floating and bobbing in the margins. Three quick stats (portfolio value counting up, total return, gold brownie-points) sit in a thin glass strip beneath, above two CTAs.

Scroll once and the **CUPI100** showpiece dominates: a card wrapped in a gold gradient hairline with a slow light-sweep across it, a trophy mark, the index level in big gold tabular numerals ticking only upward, mint "+%" and "100% profitable since launch" pills, and a live gold area chart that never dips — undercut by one honest grey line, "fictional demo instrument." Below, a horizontal carousel of instruments slides under the thumb; then an intentionally uneven grid pairs a tall watchlist with a wider portfolio (a violet/green allocation donut), a live ticking activity timeline, diverging gainer/loser bars, and alerts. Tapping any instrument slides a glass trade drawer in from the right. The whole surface is dark, spacious, and violet-gold — unmistakably one product, not a template.
