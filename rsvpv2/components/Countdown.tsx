"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";
import { wedding } from "@/lib/wedding-data";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

function compute(target: number): Remaining {
  const now = Date.now();
  const total = target - now;
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total };
  }
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds, total };
}

export function Countdown() {
  const { t } = useI18n();
  const target = new Date(wedding.date.iso).getTime();
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setRemaining(compute(target));
    const id = setInterval(() => setRemaining(compute(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!remaining) {
    // Render a stable placeholder on the server / first paint.
    return (
      <div className="mt-10 mx-auto max-w-md" aria-hidden>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl py-3 px-2"
              style={{
                background: "var(--glass-70)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
              }}
            >
              <div className="text-2xl font-medium" style={{ color: "var(--highlight)" }}>
                --
              </div>
              <div
                className="mt-1 text-[0.65rem] uppercase tracking-[0.2em]"
                style={{ color: "var(--highlight)" }}
              >
                &nbsp;
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const labels = {
    days: t.entrance.countdown.days,
    hours: t.entrance.countdown.hours,
    minutes: t.entrance.countdown.minutes,
    seconds: t.entrance.countdown.seconds,
  };

  const cells: Array<[number, string]> = [
    [remaining.days, labels.days],
    [remaining.hours, labels.hours],
    [remaining.minutes, labels.minutes],
    [remaining.seconds, labels.seconds],
  ];

  const message =
    remaining.total <= 0 && remaining.days === 0 && remaining.hours === 0
      ? remaining.total > -1000 * 60 * 60 * 24
        ? t.entrance.countdown.today
        : t.entrance.countdown.passed
      : null;

  return (
    <div className="mt-10 mx-auto max-w-md">
      <p
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--highlight)" }}
      >
        {t.entrance.countdown.heading}
      </p>
      <div
        className="mt-3 grid grid-cols-4 gap-3"
        role="timer"
        aria-live="polite"
      >
        {cells.map(([value, label], i) => (
          <div
            key={i}
            className="rounded-2xl py-3 px-2 backdrop-blur"
            style={{
              background: "var(--glass-70)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <div
              className="text-2xl font-medium tabular-nums"
              style={{ color: "var(--highlight)" }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div
              className="mt-1 text-[0.65rem] uppercase tracking-[0.2em]"
              style={{ color: "var(--highlight)" }}
            >
              {label}
            </div>
          </div>
          ))}
      </div>
      {message && (
        <p
          className="mt-4 font-script text-2xl"
          style={{ color: "var(--highlight)" }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
