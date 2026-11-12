"use client";

import { useEffect, type RefObject } from "react";

const MAX_SHIFT = 12; // px — layers multiply this by their --depth (0–1)

/**
 * Desktop-only cursor parallax. Writes --mx / --my (px) on the root; layers opt in with the
 * `.depth` class and a `--depth` value. Disabled for touch, small screens and reduced motion.
 */
export function useParallax(rootRef: RefObject<HTMLElement | null>, disabled: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    const fine = window.matchMedia("(pointer: fine) and (min-width: 1100px)");
    if (!root || disabled) return;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;

    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      root.style.setProperty("--mx", x.toFixed(2));
      root.style.setProperty("--my", y.toFixed(2));
      raf = Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2 * MAX_SHIFT;
      ty = (e.clientY / window.innerHeight - 0.5) * 2 * MAX_SHIFT;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      root.style.removeProperty("--mx");
      root.style.removeProperty("--my");
    };
  }, [rootRef, disabled]);
}
