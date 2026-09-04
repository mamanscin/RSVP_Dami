"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpIcon } from "./Icons";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const past = window.scrollY > window.innerHeight * 0.6;
      // Hide near the bottom of the page so the button doesn't sit on top
      // of the final contact section's call/WhatsApp buttons.
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - window.scrollY - window.innerHeight;
      const atEnd = remaining < 80;
      setVisible(past && !atEnd);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollUp}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--leaf-500), var(--leaf-700))",
            color: "white",
            boxShadow: "0 6px 18px rgba(45, 68, 34, 0.30)",
            border: "none",
            cursor: "pointer",
          }}
          whileHover={{ y: -2 }}
        >
          <ArrowUpIcon size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
