"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "./I18nProvider";
import {
  InfoIcon,
  ItineraryIcon,
  MapIcon,
  RsvpIcon,
  ContactIcon,
} from "./Icons";

type NavItem = {
  id: string;
  label: string;
  Icon: (p: { size?: number }) => React.JSX.Element;
};

export function FloatingNav() {
  const { t } = useI18n();
  const [active, setActive] = useState<string>("info");
  const [visible, setVisible] = useState(false);

  const items: NavItem[] = useMemo(
    () => [
      { id: "info", label: t.nav.info, Icon: InfoIcon },
      { id: "itinerary", label: t.nav.itinerary, Icon: ItineraryIcon },
      { id: "map", label: t.nav.map, Icon: MapIcon },
      { id: "rsvp", label: t.nav.rsvp, Icon: RsvpIcon },
      { id: "contact", label: t.nav.contact, Icon: ContactIcon },
    ],
    [t.nav],
  );

  useEffect(() => {
    // Show dock only after the user scrolls past the first viewport
    // (i.e. past the entrance / hero). Hide when we're near the bottom of
    // the page so the dock doesn't cover the last contact section's
    // call/WhatsApp buttons.
    function onScroll() {
      const past = window.scrollY > window.innerHeight * 0.4;
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - window.scrollY - window.innerHeight;
      const atEnd = remaining < 80;
      setVisible(past && !atEnd);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Track which section is currently in view using IntersectionObserver.
    const ids = items.map((i) => i.id);
    const observers: IntersectionObserver[] = [];
    const visibleRatios = new Map<string, number>();

    function recompute() {
      let best: { id: string; ratio: number } | null = null;
      for (const [id, ratio] of visibleRatios) {
        if (!best || ratio > best.ratio) best = { id, ratio };
      }
      if (best && best.ratio > 0) setActive(best.id);
    }

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visibleRatios.set(id, entry.intersectionRatio);
          }
          recompute();
        },
        {
          // Active when the section occupies the middle of the viewport.
          rootMargin: "-40% 0px -40% 0px",
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        }
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Primary"
      className={[
        "fixed left-1/2 bottom-5 z-40 -translate-x-1/2",
        "transition-all duration-500 ease-out",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none",
      ].join(" ")}
    >
      <div
        className="glass-soft flex items-end gap-1 px-3 py-2"
        style={{ borderRadius: "999px" }}
      >
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              aria-label={label}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex flex-col items-center justify-center px-2 py-1.5 rounded-full transition-all duration-300 ease-out"
              style={{
                color: isActive ? "var(--leaf-700)" : "var(--ink-soft)",
                transform: isActive ? "translateY(-4px) scale(1.08)" : "translateY(0)",
              }}
            >
              <span
                aria-hidden
                className="flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 44 : 36,
                  height: isActive ? 44 : 36,
                  background: isActive ? "var(--leaf-50)" : "transparent",
                  boxShadow: isActive
                    ? "0 4px 14px rgba(45, 74, 34, 0.18)"
                    : "none",
                }}
              >
                <Icon size={20} />
              </span>
              <span
                className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none"
                style={{
                  background: "var(--glass-92)",
                  color: "var(--highlight)",
                  border: "1px solid rgba(255,255,255,0.7)",
                  boxShadow: "0 4px 12px rgba(45, 74, 34, 0.10)",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
