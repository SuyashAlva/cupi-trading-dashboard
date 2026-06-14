import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { Logo } from "./ui/Logo";
import { ParticleField } from "./ui/ParticleField";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login() {
  const { mutate, isPending, error } = useLogin();
  const [email, setEmail] = useState("");
  const [localErr, setLocalErr] = useState("");

  const submit = () => {
    if (!EMAIL_RE.test(email.trim())) return setLocalErr("Enter a valid email address.");
    setLocalErr("");
    mutate(email.trim());
  };
  const errMsg = localErr || (error instanceof Error ? error.message : "");

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
      {/* Left — brand hero */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="aurora" />
        <div className="absolute inset-0"><ParticleField /></div>
        <div className="grid-fade absolute inset-0" />

        <div className="relative z-10 flex items-center gap-3">
          <Logo size={40} wordmark />
        </div>

        <div className="relative z-10 max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display font-700"
          >
            Invest smarter
            <br />
            with <span className="text-grad">CUPI</span>.
          </motion.h1>
          <p className="mt-5 max-w-md text-lg text-ink-dim">
            A real-time trading terminal — stream live prices, build watchlists, and run a paper
            portfolio that updates every second.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5 text-sm">
            <Chip icon={<Sparkles size={14} />} label="Sub-second streaming" />
            <Chip icon={<ShieldCheck size={14} />} label="Isolated per user" />
            <Chip icon={<Trophy size={14} className="text-gold" />} label="CUPI100 Exclusive" gold />
          </div>
        </div>

        <div className="relative z-10 text-xs text-ink-faint">
          Demo build · prices are simulated and no real orders are placed.
        </div>
      </div>

      {/* Right — auth */}
      <div className="relative flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 lg:hidden"><Logo size={36} wordmark /></div>
          <h2 className="font-display text-3xl font-700 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-ink-dim">Sign in with any email — your watchlist and portfolio live here.</p>

          <label className="mt-9 block text-xs font-600 uppercase tracking-[0.16em] text-ink-dim">Email</label>
          <input
            className="input mt-2"
            type="email"
            autoFocus
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setLocalErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            aria-invalid={Boolean(errMsg)}
          />
          {errMsg && <p className="mt-2 text-sm text-loss">{errMsg}</p>}

          <button className="btn-brand mt-5 w-full py-3" onClick={submit} disabled={isPending}>
            {isPending ? "Signing in…" : "Enter CUPI"}
            {!isPending && <ArrowRight size={16} />}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function Chip({ icon, label, gold }: { icon: ReactNode; label: string; gold?: boolean }) {
  return (
    <span className={`glass pill ${gold ? "border-gold/30 text-gold" : "text-ink-dim"}`}>
      {icon} {label}
    </span>
  );
}
