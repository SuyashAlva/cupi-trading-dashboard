/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep navy canvas (never pure black) + elevation tiers
        bg: "#0B1020",
        surface: "#111733",
        "surface-2": "#161E3D",
        "surface-3": "#1E2850",
        border: "#222C50",
        "border-strong": "#33407A",
        // Text
        ink: "#ECEEF8",
        "ink-dim": "#9AA3C7",
        "ink-faint": "#626C96",
        // CUPI brand — violet primary / secondary
        brand: "#7C3AED",
        "brand-2": "#A855F7",
        "brand-glow": "#9333EA",
        // Accent (positive / interactive highlight)
        accent: "#22C55E",
        "accent-soft": "#4ADE80",
        // Premium gold (CUPI100)
        gold: "#FBBF24",
        "gold-2": "#F59E0B",
        "gold-deep": "#B45309",
        // Semantic market direction
        gain: "#22C55E",
        loss: "#F43F5E",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontWeight: { 500: "500", 600: "600", 700: "700" },
      fontSize: {
        // A confident display scale for the hero
        "display-sm": ["2.75rem", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        display: ["4rem", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        "display-lg": ["5.5rem", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
      },
      borderRadius: { xl: "16px", "2xl": "22px", "3xl": "28px" },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 18px 40px -22px rgba(0,0,0,0.8)",
        glow: "0 0 0 1px rgba(124,58,237,0.45), 0 0 40px -6px rgba(124,58,237,0.55)",
        "glow-gold": "0 0 0 1px rgba(251,191,36,0.5), 0 0 60px -10px rgba(245,158,11,0.6)",
      },
      backgroundImage: {
        "brand-grad": "linear-gradient(120deg, #7C3AED 0%, #A855F7 55%, #22C55E 130%)",
        "gold-grad": "linear-gradient(120deg, #FBBF24 0%, #F59E0B 50%, #B45309 120%)",
        "brand-text": "linear-gradient(100deg, #C4B5FD 0%, #A855F7 45%, #7C3AED 100%)",
      },
      keyframes: {
        flashGain: { "0%": { backgroundColor: "rgba(34,197,94,0.22)" }, "100%": { backgroundColor: "rgba(34,197,94,0)" } },
        flashLoss: { "0%": { backgroundColor: "rgba(244,63,94,0.22)" }, "100%": { backgroundColor: "rgba(244,63,94,0)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.35" } },
        auroraShift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(6%,-4%,0) scale(1.12)" },
          "66%": { transform: "translate3d(-5%,5%,0) scale(0.95)" },
        },
        gradientPan: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        shine: { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(220%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        rise: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "flash-gain": "flashGain 0.6s ease-out",
        "flash-loss": "flashLoss 0.6s ease-out",
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
        aurora: "auroraShift 18s ease-in-out infinite",
        "gradient-pan": "gradientPan 6s linear infinite",
        shine: "shine 3.5s ease-in-out infinite",
        floaty: "floaty 6s ease-in-out infinite",
        rise: "rise 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
