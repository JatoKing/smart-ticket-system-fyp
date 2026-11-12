"use client";

// Section entrances start hidden (opacity 0 / visibility hidden) until they scroll into view,
// and hidden elements can't take keyboard focus. As soon as someone navigates with Tab, finish
// every one-time entrance so links and buttons further down the page are reachable.
// Scroll-scrubbed sequences (the stadium seat map) are left alone: they follow the scroll.

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

export default function KeyboardReveal() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.once && st.animation && st.animation.progress() < 1) st.animation.progress(1);
      });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
