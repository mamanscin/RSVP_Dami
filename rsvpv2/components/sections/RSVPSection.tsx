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
        <h2 className="section-title">{t.rsvp.title}</h2>
        <p className="section-subtitle">
          {t.rsvp.subtitle
            .split(/(seats are limited|tempat duduk adalah terhad)/i)
            .map((part, i) =>
              /seats are limited|tempat duduk adalah terhad/i.test(part) ? (
                <strong key={i} style={{ fontWeight: 700 }}>
                  {part}
                </strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
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
