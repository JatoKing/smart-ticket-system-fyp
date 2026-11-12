"use client";

// Lenis smooth scrolling for the landing page, driven by GSAP's ticker so ScrollTrigger
// (pins, scrubbed timelines) always reads the same scroll position Lenis is rendering.

import Lenis from "lenis";
import { ScrollTrigger, gsap } from "./gsap";

let lenis: Lenis | null = null;

/** Start Lenis (desktop wheel/trackpad; touch keeps native scrolling). Returns a cleanup. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const instance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
    anchors: true, // #fixtures, #lineup, #venue links glide instead of jumping
    allowNestedScroll: true, // e.g. a long gate list scrolls itself, then the page continues
    autoToggle: true, // pauses while the mobile menu sets overflow: hidden on <html>
    stopInertiaOnNavigate: true,
  });
  lenis = instance;

  instance.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0); // no catch-up jumps: scroll and animation stay in step

  return () => {
    gsap.ticker.remove(raf);
    gsap.ticker.lagSmoothing(500, 33);
    instance.destroy();
    lenis = null;
  };
}

/** Scroll the page to `top` (px): smooth through Lenis when it's running, native otherwise. */
export function scrollToY(top: number, opts: { duration?: number } = {}) {
  if (lenis) {
    lenis.scrollTo(top, { duration: opts.duration ?? 1.4 });
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}
