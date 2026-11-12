"use client";

// Single place where GSAP plugins are registered (client only).
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Shared media conditions for gsap.matchMedia(). */
export const MEDIA = {
  desktopMotion: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobileMotion: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export const EASES = {
  io: "power3.inOut",
  out: "power3.out",
  expo: "expo.out",
} as const;

/**
 * Magnetic hover: the element drifts toward the pointer (fine pointers only).
 * Returns a cleanup function.
 */
export function magnetic(el: HTMLElement, strength = 0.28) {
  if (!window.matchMedia("(pointer: fine)").matches) return () => {};
  const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
  const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    x((e.clientX - (r.left + r.width / 2)) * strength);
    y((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x(0);
    y(0);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
  };
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
