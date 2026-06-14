# Feature Catalogue — Pulse

Scored for recruiter impact and effort. ✅ = already implemented in this build.

## Part A — 20 features beyond the requirements

| # | Feature | Description | Difficulty | Est. time | Impact /10 |
|---|---|---|---|---|---|
| 1 | ✅ Paper-trading desk | Buy/sell at live price, weighted-avg cost, buying-power checks | Medium | 4h | 10 |
| 2 | ✅ Live mark-to-market P&L | Portfolio revalued on every tick | Medium | 2h | 10 |
| 3 | ✅ Price alerts + notifications | Conditional triggers on the live stream → toast + Web Notification | Easy | 2h | 9 |
| 4 | ✅ Command palette (⌘K) | Fuzzy instrument search & quick-add | Easy | 2h | 9 |
| 5 | ✅ Auto-reconnect + status badge | Socket.io backoff, visible connection state | Easy | 1h | 8 |
| 6 | ✅ Sparklines + price flash | Per-row mini-charts, green/red flash on tick | Easy | 2h | 8 |
| 7 | ✅ Animated portfolio counter | Count-up tween on total value | Easy | 1h | 7 |
| 8 | ✅ Toast system | Order fills, alerts, errors | Easy | 1h | 7 |
| 9 | ✅ Skeleton loading states | Shimmer placeholders before first snapshot | Easy | 1h | 7 |
| 10 | ✅ Market strip | Index-style bar of all instruments | Easy | 1h | 7 |
| 11 | Trade blotter view | Tabbed order history (data already stored) | Easy | 2h | 8 |
| 12 | Sortable market table | Sort by price/%change/volume | Easy | 2h | 7 |
| 13 | Sector heatmap | Grid shaded by %change, TradingView-style | Medium | 4h | 9 |
| 14 | Candlestick chart | Aggregate ticks → OHLC, custom SVG candles | Hard | 6–8h | 10 |
| 15 | Technical indicators | SMA / EMA / RSI overlays on the buffer | Medium | 4h | 9 |
| 16 | CSV export | Download trades + positions | Easy | 1h | 6 |
| 17 | Watchlist groups | Multiple named lists | Medium | 3h | 6 |
| 18 | Light/dark theme toggle | Second palette (tokens exist) | Easy | 2h | 6 |
| 19 | PWA + offline shell | Installable, cached last snapshot | Medium | 3h | 7 |
| 20 | Keyboard trade shortcuts | B/S to buy/sell selected | Easy | 1h | 6 |

### Top 10 by ROI (impact ÷ effort)

1. Live mark-to-market P&L
2. Price alerts + notifications
3. Command palette (⌘K)
4. Sparklines + price flash
5. Auto-reconnect + status badge
6. Trade blotter view
7. Market strip
8. Toast + skeleton polish
9. Sector heatmap
10. Sortable market table

## Part B — 10 "wow" features and the single best

| Feature | Why it stands out | Impact /10 | Difficulty | Approach |
|---|---|---|---|---|
| Streaming candlestick + indicators | Looks like a mini TradingView built from your own feed | 10 | Hard | Bucket ticks into OHLC; custom SVG candles; compute SMA/EMA/RSI over the buffer |
| Mark-to-market paper trading ✅ | Turns a quote feed into a working broker | 10 | Medium | Derive P&L from positions × live quotes each tick |
| Sector heatmap | Instantly "real platform" at a glance | 9 | Medium | Grid cells sized/shaded by %change |
| Command palette ✅ | Signals product taste, not just coding | 9 | Easy | Global ⌘K modal over the instrument list |
| Price alerts ✅ | Demonstrates event logic on a stream | 9 | Easy | Evaluate conditions per tick, notify |
| Replay / time-travel | Scrub the session and watch it re-play | 8 | Medium | Store tick history, drive chart from an index |
| Multi-pane layout | Drag-resizable terminal panels | 8 | Hard | CSS grid + a resizer lib |
| Order book simulation | Synthetic depth ladder per symbol | 8 | Medium | Generate bid/ask levels around the price |
| Portfolio allocation donut | Live holdings breakdown | 7 | Easy | Recharts pie over positions |
| Sound + haptic cues | Subtle tick/alert audio | 6 | Easy | WebAudio on threshold events |

**Single best ROI: the mark-to-market paper-trading desk** (implemented). It reuses the subscription system the assignment already requires, needs no new infrastructure, and is the feature most likely to make a reviewer say "this person understands real-time derived state and got the finance right." The candlestick engine has higher ceiling but materially more effort; paper trading delivers near-equal impact at a fraction of the cost.
