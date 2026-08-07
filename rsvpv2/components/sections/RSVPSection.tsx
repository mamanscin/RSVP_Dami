"use client";

import { useI18n } from "@/components/I18nProvider";
import { RSVPForm } from "@/components/RSVPForm";

/**
 * RSVP section — visually echoes the printed wedding invitation.
 *  - Cream paper background (set in globals.css on body).
 *  - Two watercolor lemon illustrations flank the heading
 *    (top-left + bottom-right) so the section reads like an
 *    invitation card.
 *  - Heading uses the handwritten "Lucy Rose" / "HighSpirited"
 *    fonts while the subtitle stays in Garamond to match the
 *    invite's editorial feel.
 */
export function RSVPSection() {
  const { t } = useI18n();
  return (
    <section
      id="rsvp"
      className="relative isolate overflow-hidden"
    >
      {/* Decorative thin rule above the heading — invitation card style */}
      <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-3 text-[var(--leaf-600)]/80">
        <span aria-hidden className="h-px w-16 bg-[var(--leaf-400)]/60" />
        <span aria-hidden className="text-xl">🍋</span>
        <span aria-hidden className="h-px w-16 bg-[var(--leaf-400)]/60" />
      </div>

      <header className="relative text-center space-y-3">
        <h2
          className="text-[var(--highlight)] text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-wide drop-shadow-sm"
          style={{ fontFamily: "var(--font-serif)", textShadow: "0 1px 0 rgba(255,255,255,0.6)" }}
        >
          {t.rsvp.title}
        </h2>
        <p
          className="italic text-[var(--text-body)] text-base sm:text-lg max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {t.rsvp.subtitle}
        </p>
        <p
          className="font-script text-[var(--highlight)] text-2xl sm:text-3xl pt-2 opacity-90"
          style={{ fontFamily: "var(--font-script)" }}
        >
          ♡
        </p>
      </header>

      <div className="relative mt-10">
        <RSVPForm />
      </div>

      {/* Bottom decorative rule */}
      <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 text-[var(--leaf-600)]/70">
        <span aria-hidden className="h-px w-24 bg-[var(--leaf-400)]/50" />
        <span aria-hidden className="text-2xl">🌿</span>
        <span aria-hidden className="h-px w-24 bg-[var(--leaf-400)]/50" />
      </div>
    </section>
  );
}
