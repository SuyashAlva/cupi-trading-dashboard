import { Command, LogOut, Trophy } from "lucide-react";
import { useAuth } from "../../store/authStore";
import { usePortfolio } from "../../store/portfolioStore";
import { ConnectionBadge } from "../ui/ConnectionBadge";
import { Logo } from "../ui/Logo";
import { fmtInt } from "../../lib/format";

export function TopNav() {
  const email = useAuth((s) => s.email);
  const logout = useAuth((s) => s.logout);
  const brownies = usePortfolio((s) => s.browniePoints);

  const openPalette = () =>
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo size={32} wordmark />

        <div className="flex items-center gap-2.5">
          <button
            onClick={openPalette}
            className="hidden items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-ink-dim transition hover:border-border-strong hover:text-ink sm:flex"
          >
            <Command size={13} /> Search <span className="kbd">⌘K</span>
          </button>
          <span className="pill border border-gold/25 bg-gold/10 text-gold">
            <Trophy size={12} /> <span className="tnum">{fmtInt(brownies)}</span>
          </span>
          <ConnectionBadge />
          <div className="hidden items-center gap-2 border-l border-border pl-2.5 sm:flex">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-brand/25 text-xs font-700 text-brand-2">
              {email?.[0]?.toUpperCase()}
            </span>
          </div>
          <button className="btn-ghost px-2.5 py-2" onClick={logout} title="Sign out" aria-label="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
