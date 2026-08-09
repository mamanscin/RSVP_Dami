"use client";

import { useI18n } from "@/components/I18nProvider";
import { wedding } from "@/lib/wedding-data";
import { WishesList } from "@/components/WishesList";

export function InfoSection() {
  const { t } = useI18n();

  // Groom's parents on the left, bride's parents on the right.
  // Each side shows both parents stacked (father on top, mother below).
  const groomParents = `${wedding.groom.father} & ${wedding.groom.mother}`;
  const brideParents = `${wedding.bride.father} & ${wedding.bride.mother}`;

  return (
    <div className="space-y-16">
      {/* Top: Walimatulurus header card */}
      <header className="text-center space-y-3">
        <div className="divider-ornament" aria-hidden>
          <span>🍋</span>
          <span>✦</span>
          <span>🌿</span>
        </div>
        <h2 className="section-title">{t.info.title}</h2>
      </header>

      {/* Greeting + blessing */}
      <div className="text-center space-y-2">
        <p
          className="italic text-xl sm:text-2xl"
          style={{ color: "var(--highlight)", fontFamily: "var(--font-serif)" }}
        >
          {t.info.greeting}
        </p>
        <p
          style={{
            color: "var(--text-body)",
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "1.05rem",
          }}
        >
          {t.info.blessing}
        </p>
      </div>

      {/* Parents inviting — groom's on the left, bride's on the right */}
      <div className="grid grid-cols-2 items-center gap-8 sm:gap-16">
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--highlight)" }}>
            {t.info.groom}
          </p>
          {/* Reserve the same vertical space for each father name so the inner
              "&" below lines up on both sides regardless of how the name wraps. */}
          <h3
            className="font-display text-xl sm:text-2xl w-full flex items-center justify-center sm:justify-end"
            style={{ color: "var(--highlight)", minHeight: "3.8em" }}
          >
            {wedding.groom.father}
          </h3>
          <p
            className="couple-amp"
            style={{ fontSize: "1.4rem", color: "var(--highlight)", lineHeight: 1 }}
          >
            &amp;
          </p>
          <h3
            className="font-display text-xl sm:text-2xl"
            style={{ color: "var(--highlight)" }}
          >
            {wedding.groom.mother}
          </h3>
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--highlight)" }}>
            {t.info.bride}
          </p>
          <h3
            className="font-display text-xl sm:text-2xl w-full flex items-center justify-center sm:justify-start"
            style={{ color: "var(--highlight)", minHeight: "3.8em" }}
          >
            {wedding.bride.father}
          </h3>
          <p
            className="couple-amp"
            style={{ fontSize: "1.4rem", color: "var(--highlight)", lineHeight: 1 }}
          >
            &amp;
          </p>
          <h3
            className="font-display text-xl sm:text-2xl"
            style={{ color: "var(--highlight)" }}
          >
            {wedding.bride.mother}
          </h3>
        </div>
      </div>

      {/* Invitation line + honorifics + wedding-of */}
      <div className="text-center space-y-2">
        <p
          className="font-display italic text-lg sm:text-xl"
          style={{ color: "var(--highlight)" }}
        >
          {t.info.invitationLine}
        </p>
        <p
          className="text-xs uppercase tracking-[0.25em]"
          style={{ color: "var(--highlight)" }}
        >
          {t.info.honorifics}
        </p>
        <p
          className="font-display italic text-lg sm:text-xl pt-1"
          style={{ color: "var(--highlight)" }}
        >
          {t.info.weddingOfDaughter}
        </p>
      </div>

      {/* Couple names — High Spirited (the centerpiece of the invite) */}
      <div className="text-center">
        <p
          className="text-leaf-700"
          style={{
            fontFamily: '"High Spirited", "Lucy Rose", cursive',
            fontSize: "clamp(2.8rem, 8vw, 5rem)",
            lineHeight: 1.1,
            color: "var(--highlight)",
          }}
        >
          {wedding.bride.fullName}
        </p>
        <p
          className="my-1"
          style={{
            fontFamily: '"High Spirited", "Lucy Rose", cursive',
            fontSize: "clamp(2.2rem, 6vw, 3rem)",
            color: "var(--highlight)",
            lineHeight: 1,
          }}
        >
          &amp;
        </p>
        <p
          style={{
            fontFamily: '"High Spirited", "Lucy Rose", cursive',
            fontSize: "clamp(2.8rem, 8vw, 5rem)",
            lineHeight: 1.1,
            color: "var(--highlight)",
          }}
        >
          {wedding.groom.fullName}
        </p>
      </div>

      {/* Existing details grid */}
      <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
        <DetailRow label={t.info.dateLabel} value={t.info.dateValue} />
        <DetailRow label={t.info.timeLabel} value={t.info.timeValue} />
        <DetailRow label={t.info.venueLabel} value={t.info.venueValue} />
        <DetailRow label={t.info.dresscode} value={t.info.dresscodeValue} />
      </dl>

      {/* Wishes */}
      <div>
        <h3 className="section-title text-2xl sm:text-3xl mb-8 text-center">
          {t.info.wishesTitle}
        </h3>
        <WishesList />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <dt
        className="text-xs uppercase tracking-[0.25em]"
        style={{ color: "var(--highlight)" }}
      >
        {label}
      </dt>
      <dd
        className="mt-2 text-lg"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "var(--text-body)",
          whiteSpace: "pre-line",
        }}
      >
        {value}
      </dd>
    </div>
  );
}
