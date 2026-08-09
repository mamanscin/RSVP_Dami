import type { ReactNode } from "react";

/**
 * InvitationCard — the cream "invitation card" surface used across the
 * site (RSVP form, wishes list, success panel). Visually echoes the
 * printed invitation: cream paper wash, hairline border, soft shadow,
 * backdrop blur, and watercolor lemon corner illustrations.
 */
export function InvitationCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative max-w-xl mx-auto px-6 sm:px-10 py-10 sm:py-12 rounded-[28px] ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,251,235,0.85) 0%, rgba(254,249,239,0.78) 100%)",
        border: "1px solid rgba(66, 92, 44, 0.18)",
        boxShadow:
          "0 30px 60px -30px rgba(45, 74, 34, 0.25), 0 1px 0 rgba(255,255,255,0.6) inset",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        fontFamily:
          '"Minion Display", "Cormorant Garamond", "Playfair Display", Georgia, serif',
      }}
    >
      {/* Inner lemon cluster — small, soft, watermark-y */}
      <img
        src="/illustrations/lemons-set-3.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-6 -left-6 w-24 sm:w-28 opacity-50 mix-blend-multiply"
        style={{ filter: "saturate(0.92) brightness(1.02) hue-rotate(-4deg)" }}
      />
      <img
        src="/illustrations/lemons-set-4.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 -right-6 w-24 sm:w-28 opacity-50 mix-blend-multiply"
        style={{ filter: "saturate(0.92) brightness(1.02)" }}
      />

      {/* Hairline frame to match the printed invitation border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-[22px]"
        style={{ border: "1px solid rgba(66, 92, 44, 0.18)" }}
      />

      {children}
    </div>
  );
}