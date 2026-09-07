"use client";

import { useEffect, useState } from "react";

export function ScrollTopBlur() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`scroll-top-blur ${scrolled ? "is-visible" : ""}`}
    />
  );
}
