/** CUPI wordmark + mark. The mark is a stylised "C" cradling an upward tick. */
export function Logo({ size = 34, wordmark = false }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="relative grid place-items-center overflow-hidden rounded-2xl"
        style={{
          width: size,
          height: size,
          backgroundImage: "linear-gradient(135deg, #7C3AED 0%, #A855F7 60%, #6D28D9 100%)",
          boxShadow: "0 0 0 1px rgba(168,85,247,0.5), 0 8px 22px -8px rgba(124,58,237,0.8)",
        }}
      >
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M18 6.5A8 8 0 1 0 18 17.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M9 14 L12.5 9.5 L15 12 L19 6.5" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {wordmark && (
        <span className="font-display text-xl font-700 tracking-tight">
          CUPI
        </span>
      )}
    </span>
  );
}
