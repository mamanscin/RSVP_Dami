"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";
import { InvitationCard } from "./InvitationCard";

export type StoredWish = {
  name: string;
  phone?: string;
  message: string;
  date: string;
};

// Slow, continuous scroll speed (px per second).
const SCROLL_SPEED = 18;

export function WishesList() {
  const { t } = useI18n();
  const [wishes, setWishes] = useState<StoredWish[] | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch wishes from Postgres. Show a placeholder on the first paint
    // and during the network round-trip.
    /* eslint-disable react-hooks/set-state-in-effect */
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/wishes?limit=100", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as {
          ok: boolean;
          wishes?: StoredWish[];
        };
        if (cancelled) return;
        setWishes(
          (json.wishes ?? []).slice().sort((a, b) =>
            b.date.localeCompare(a.date)
          )
        );
      } catch {
        if (cancelled) return;
        setWishes([]);
      }
    })();
    return () => {
      cancelled = true;
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Slow, continuous marquee: the list is rendered twice (see below)
  // and translated up by half its height, so it loops seamlessly.
  // The viewport is sized to the tallest wish so only one message is
  // visible at a time, and the duration is derived from the measured
  // content height so the speed stays constant no matter how many
  // wishes there are. Pauses while hovered/focused (see CSS).
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !wishes || wishes.length === 0) return;

    const ul = scroller.firstElementChild as HTMLElement | null;
    if (!ul) return;

    // Size the viewport to the tallest wish so nothing gets clipped.
    const items = Array.from(ul.children) as HTMLElement[];
    const tallest = Math.max(...items.map((el) => el.offsetHeight));
    scroller.style.height = `${tallest}px`;

    if (items.length < 2) {
      ul.style.animation = "none";
      return;
    }

    // Reduced motion: leave the list static and let the user scroll.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ul.style.animation = "none";
      scroller.style.overflowY = "auto";
      return;
    }

    const setHeight = ul.scrollHeight / 2;
    ul.style.animation = `wishes-scroll ${setHeight / SCROLL_SPEED}s linear infinite`;
  }, [wishes]);

  if (wishes === null) {
    return (
      <div className="text-sm py-4 text-center" style={{ color: "var(--text-body)" }}>
        <span className="inline-block animate-pulse">…</span>
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <p className="italic py-4 text-center" style={{ color: "var(--text-body)" }}>
        {t.info.wishesEmpty}
      </p>
    );
  }

  const wishItem = (w: StoredWish, i: number, copy: number) => (
    <li
      key={`${copy}-${w.date}-${i}`}
      aria-hidden={copy === 1 || undefined}
      className="py-6"
      style={{
        borderTop:
          i === 0 && copy === 0 ? "none" : "1px solid var(--hairline)",
      }}
    >
      <p
        className="text-lg italic leading-relaxed whitespace-pre-wrap"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--text-body)",
        }}
      >
        {w.message}
      </p>
      <p
        className="mt-2 text-xs uppercase tracking-[0.25em]"
        style={{ color: "var(--highlight)" }}
      >
        — {w.name}
      </p>
    </li>
  );

  return (
    <InvitationCard className="wishes-card">
      <div className="wishes-scroller" ref={scrollerRef}>
        {/* Rendered twice so the marquee can loop seamlessly */}
        <ul className="space-y-0">
          {[0, 1].flatMap((copy) => wishes.map((w, i) => wishItem(w, i, copy)))}
        </ul>
      </div>
    </InvitationCard>
  );
}

