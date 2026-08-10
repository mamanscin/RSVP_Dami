"use client";

import { Fragment } from "react";
import { useI18n } from "@/components/I18nProvider";
import type { ItineraryEvent } from "@/app/[lang]/dictionaries";

export function ItinerarySection() {
  const { t } = useI18n();
  const events = t.itinerary.events;

  return (
    <div className="space-y-10">
      <header className="text-center space-y-2">
        <div className="divider-ornament" aria-hidden>
          <span>🍋</span>
          <span>✦</span>
          <span>🌿</span>
        </div>
        <h2 className="section-title">{t.itinerary.title}</h2>
        <p className="section-subtitle">{t.itinerary.subtitle}</p>
      </header>

      <ol className="timeline max-w-xl mx-auto">
        {events.map((ev, idx) => (
          <Fragment key={idx}>{renderEvent(ev, idx + 1)}</Fragment>
        ))}
      </ol>
    </div>
  );
}

function renderEvent(ev: ItineraryEvent, position: number) {
  if ("section" in ev) {
    return (
      <li className="timeline-banner" role="separator" aria-label={ev.section}>
        {ev.section}
      </li>
    );
  }

  if ("items" in ev) {
    return (
      <li className="timeline-item">
        <span aria-hidden className="timeline-dot" />
        <p
          className="timeline-time text-xs uppercase tracking-[0.25em]"
          style={{ color: "var(--highlight)" }}
        >
          <TimeText value={ev.time} />
        </p>
        <div className="timeline-content">
          <ul className="space-y-2">
            {ev.items.map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-base"
                style={{ color: "var(--text-body)" }}
              >
                <span
                  aria-hidden
                  className="leading-none mt-2"
                  style={{ color: "var(--highlight)" }}
                >
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <li className="timeline-item">
      <span aria-hidden className="timeline-dot" />
      <p
        className="timeline-time text-xs uppercase tracking-[0.25em]"
        style={{ color: "var(--highlight)" }}
      >
        <TimeText value={ev.time} />
      </p>
      <h3
        className="timeline-content text-lg"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "var(--highlight)",
        }}
      >
        {ev.label}
      </h3>
    </li>
  );
}

function TimeText({ value }: { value: string }) {
  const parts = value.split(/\s*[–—\-]\s*/);
  if (parts.length <= 1) return <>{value}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className="block">
          {part.trim()}
        </span>
      ))}
    </>
  );
}
