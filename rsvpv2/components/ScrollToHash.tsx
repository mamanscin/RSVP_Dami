"use client";

import { useEffect } from "react";

/**
 * Scrolls to the element matching `location.hash` after the entrance
 * doors have been opened. Used for QR codes / shared links that should
 * jump straight to a section (e.g. `#map`, `#rsvp`).
 *
 * Behavior:
 *  - If the entrance is already open (or has been opened this session),
 *    scroll immediately.
 *  - Otherwise, wait for the `entrance-opened` event fired by
 *    <Entrance /> and then scroll. A small delay is added so the door
 *    animation + reveal can finish before the page jumps.
 *  - Also handles `hashchange` so navigating to a hash from within the
 *    page (e.g. via the FloatingNav) scrolls correctly.
 */
export function ScrollToHash() {
  useEffect(() => {
    let cancelled = false;

    function scrollToHash() {
      if (cancelled) return;
      const hash = window.location.hash;
      if (!hash || hash === "#") return;
      // Wait one frame so any layout changes (e.g. the entrance content
      // reveal) have settled, then scroll. `scrollIntoView` honors the
      // `scroll-margin-top` CSS prop, so a sticky nav won't cover the
      // target if one is added later.
      requestAnimationFrame(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    let alreadyOpened = false;
    try {
      alreadyOpened = sessionStorage.getItem("entrance.opened") === "1";
    } catch {
      // Ignore storage errors (private mode, etc.).
    }

    // Wait for the entrance doors to open before scrolling. The
    // <Entrance /> component forces the page back to scrollY=0 while it
    // is mounted, so we have to defer any scroll until that effect
    // releases. We listen for the `entrance-opened` event in both
    // branches: in the "already opened" case it has already fired, so
    // we wait one tick for the entrance mount + scroll-to-top to
    // settle; in the "not opened yet" case we wait for the event.
    function onOpened() {
      // Long enough for the door open + reveal animation to finish.
      window.setTimeout(scrollToHash, 1100);
      window.removeEventListener("entrance-opened", onOpened);
    }
    window.addEventListener("entrance-opened", onOpened);

    if (alreadyOpened) {
      // Entrance is mounted on this navigation (sessionStorage was set
      // last time) — it will fire `entrance-opened` after the user
      // clicks the door. The listener above will handle the scroll.
      // We also schedule a fallback so the scroll still happens even if
      // the user is mid-tap and the event listener races.
      window.setTimeout(scrollToHash, 1500);
    } else {
      // Belt-and-braces: if the entrance event somehow never fires
      // (e.g. reduced-motion path that skips the CTA), still try after
      // a longer wait.
      const fallback = window.setTimeout(scrollToHash, 3000);
      window.addEventListener(
        "beforeunload",
        () => window.clearTimeout(fallback),
        { once: true },
      );
    }

    window.addEventListener("hashchange", scrollToHash);

    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}