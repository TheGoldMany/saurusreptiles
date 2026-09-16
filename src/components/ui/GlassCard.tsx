import type { ReactNode } from "react";

/**
 * Satin dark-slate glass surface with a hairline top highlight — the base
 * surface for every cinematic panel.
 */
export default function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  /** Adds a soft amber rim glow, used for the active/primary panel. */
  glow?: boolean;
}) {
  return (
    <div
      className={`glass-panel relative overflow-hidden rounded-3xl ${
        glow ? "shadow-[0_0_60px_-20px_rgba(229,138,60,0.45)]" : ""
      } ${className}`}
    >
      {/* hairline highlight along the top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      {children}
    </div>
  );
}
