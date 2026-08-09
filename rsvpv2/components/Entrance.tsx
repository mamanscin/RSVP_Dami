"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "./I18nProvider";
import { Countdown } from "./Countdown";
import { ArrowDownIcon, PawIcon } from "./Icons";

const EASE = [0.77, 0, 0.175, 1] as const;
const DOOR_DURATION = 1.1;
const CONTENT_DELAY = 0.45;

export function Entrance() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  // Lock page scroll while the entrance is closed. We:
  //   1. Force the scroll position to the top (overriding the browser's
  //      own "scroll restoration" memory from the previous visit).
  //   2. Hide overflow on <html> so the page can't be scrolled.
  //   3. Block wheel, touch, and arrow-key scrolling on the window.
  //   4. Set overscroll-behavior: contain so wheel doesn't bubble.
  //
  // We do NOT pin the body with `position: fixed; top: -${scrollY}px`
  // because that hack can leave the page visually offset on iOS Safari
  // after a refresh — the user would see a black/empty screen above
  // the entrance. Since the entrance fills the first viewport, the
  // user has nothing to look at above it anyway, so a plain overflow
  // lock is the right choice.
  useEffect(() => {
    if (open) return;

    // Disable the browser's "scroll restoration" so a refresh always
    // starts at the top of the page, then jump to the top in case the
    // browser had already restored a position before this effect ran.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }

    const body = document.body;
    const html = document.documentElement;
    const prev = {
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
    };

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "contain";

    function prevent(e: Event) {
      e.preventDefault();
    }
    function onKey(e: KeyboardEvent) {
      const blocked = [
        "PageDown",
        "PageUp",
        "ArrowDown",
        "ArrowUp",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        " ",
      ];
      if (blocked.includes(e.key)) {
        const target = e.target as HTMLElement | null;
        if (target?.tagName === "BUTTON" || target?.tagName === "A") return;
        e.preventDefault();
      }
    }
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", onKey);
      body.style.overflow = prev.bodyOverflow;
      html.style.overflow = prev.htmlOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
    };
  }, [open]);

  function handleOpen() {
    if (open) return;
    setOpen(true);
    try {
      sessionStorage.setItem("entrance.opened", "1");
    } catch {
      // Ignore storage errors.
    }
    window.dispatchEvent(new Event("entrance-opened"));
  }

  return (
    <div className="relative w-full" style={{ minHeight: "100vh" }}>
      {/* Doors — the artwork is anchored to the viewport centre. Each
          half renders a full-viewport-width layer with a centred `cover`
          background, so both halves always meet exactly at the middle of
          the screen (the seam never drifts with the viewport size) and
          the outer edges of the artwork are cropped by the screen edges
          instead of being stretched. */}
      <div className="absolute inset-0 flex">
        {/* Left door */}
        <motion.div
          className="door-panel relative overflow-hidden"
          style={{ width: "50%", height: "100%" }}
          initial={{ x: "0%" }}
          animate={{ x: open ? "-100%" : "0%" }}
          transition={{ duration: DOOR_DURATION, ease: EASE }}
          aria-hidden
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "100vw",
              backgroundImage: 'url("/illustrations/lemon-border.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </motion.div>
        {/* Right door */}
        <motion.div
          className="door-panel relative overflow-hidden"
          style={{ width: "50%", height: "100%" }}
          initial={{ x: "0%" }}
          animate={{ x: open ? "100%" : "0%" }}
          transition={{ duration: DOOR_DURATION, ease: EASE }}
          aria-hidden
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: "100vw",
              backgroundImage: 'url("/illustrations/lemon-border.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </motion.div>
      </div>

      {/* Reveal content */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="entrance-content"
            className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-2xl mx-auto px-6 sm:px-10 py-10 sm:py-14 rounded-[2rem]"
            style={{
              background: "rgba(255, 251, 235, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: CONTENT_DELAY }}
          >
            <h2
              className="italic text-3xl"
              style={{ color: "var(--highlight)", fontFamily: "var(--font-serif)" }}
            >
              {t.entrance.dear} {t.entrance.guest}
            </h2>

            <p
              className="mt-4 max-w-xl text-lg italic"
              style={{ color: "var(--text-body)" }}
            >
              {t.entrance.invitation}
            </p>

            <h1 className="couple-name mt-6">
              <span className="block">{t.info.brideName.split(" binti ")[0]}</span>
              <span className="couple-amp">{t.entrance.and}</span>
              <span className="block">{t.info.groomName.split(" bin ")[0]}</span>
            </h1>

            <p className="wedding-date mt-8">{t.entrance.date}</p>
            <p
              className="mt-2 text-sm uppercase tracking-[0.25em]"
              style={{ color: "var(--highlight)" }}
            >
              {t.entrance.venue}
            </p>

            <Countdown />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll hint — pinned 80% down the screen */}
      <AnimatePresence>
        {open && (
          <motion.span
            aria-hidden
            className="absolute left-0 right-0 z-10 flex flex-col items-center text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--highlight)", top: "80%" }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            scroll
            <motion.span
              className="block mx-auto mt-1"
              style={{ lineHeight: 1 }}
              animate={{ y: [0, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
            >
              <ArrowDownIcon size={22} />
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tap-to-open — invisible overlay, AP.svg is the visible affordance */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="entrance-cta"
            type="button"
            onClick={handleOpen}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 cursor-pointer"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
            }}
            aria-label={t.entrance.openDoors}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* AP.svg as the button */}
            <span
              className="block"
              style={{
                width: "min(22vw, 160px)",
                height: "auto",
                pointerEvents: "none",
              }}
            >
              <img
                src="/illustrations/SVG/AP.svg"
                alt=""
                aria-hidden
                draggable={false}
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            </span>

            {/* Wedding date — sits between the monogram and the paw icon */}
            <motion.span
              aria-hidden
              className="block"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
                letterSpacing: "0.25em",
                color: "var(--ink)",
                opacity: 0.75,
                pointerEvents: "none",
              }}
              animate={{ opacity: [0.6, 0.85, 0.6] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              31.08.2026
            </motion.span>

            {/* Tap indicator — paw icon at 50% opacity, pulsing like a finger tap */}
            <motion.span
              aria-hidden
              className="block"
              style={{ color: "var(--leaf-700)", opacity: 0.5, pointerEvents: "none" }}
              animate={{ scale: [1, 1, 0.78, 1, 1] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.5, 0.6, 1],
              }}
            >
              <PawIcon size={28} />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
