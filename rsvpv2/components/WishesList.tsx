"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

export type StoredWish = {
  name: string;
  phone?: string;
  message: string;
  date: string;
};

export function WishesList() {
  const { t } = useI18n();
  const [wishes, setWishes] = useState<StoredWish[] | null>(null);

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

  return (
    <div className="wishes-scroller">
      <ul className="space-y-0 pt-8 pb-8">
        {wishes.map((w, i) => (
          <li
            key={`${w.date}-${i}`}
            className="py-6"
            style={{
              borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
            }}
          >
            <p
              className="text-lg italic whitespace-pre-wrap"
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
        ))}
      </ul>
    </div>
  );
}

