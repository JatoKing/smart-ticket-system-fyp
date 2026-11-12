"use client";

// Post-authentication transition (~800ms): the ball is shot across the page, a gold trajectory
// streak follows it and opens into a full-screen wipe. Authentication has already succeeded
// when this plays — the delay is only the animation, and a safety timer guarantees navigation.

import Image from "next/image";
import { useImperativeHandle, useRef, type Ref } from "react";
import { animate } from "motion/react";
import { EASE, polygon, prefersReducedMotion, wait } from "@/lib/motion";

export type TransitionOverlayHandle = {
  play: (ball: SVGSVGElement | null) => Promise<void>;
};

const supportsOffsetPath = () =>
  typeof CSS !== "undefined" && CSS.supports?.("offset-path", 'path("M 0 0 L 1 1")');

export default function TransitionOverlay({ ref }: { ref?: Ref<TransitionOverlayHandle> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<SVGSVGElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    async play(ball) {
      const root = rootRef.current;
      const gold = goldRef.current;
      const ink = inkRef.current;
      const streakSvg = streakRef.current;
      if (!root || !gold || !ink || !streakSvg) return;
      root.classList.add("is-active");

      if (prefersReducedMotion()) {
        ink.style.clipPath = "none";
        await animate(ink, { opacity: [0, 1] }, { duration: 0.22 }).finished;
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = ball?.getBoundingClientRect();
      const visible = !!rect && rect.width > 0 && rect.bottom > 0 && rect.top < vh;
      const sx = visible ? rect.left + rect.width / 2 : vw / 2;
      const sy = visible ? rect.top + rect.height / 2 : vh * 0.3;
      const dir = sx > vw / 2 ? -1 : 1; // shoot towards the far side of the screen
      const ex = dir > 0 ? vw + 160 : -160;
      const ey = Math.max(-120, sy - vh * 0.28);
      const cx = sx + (ex - sx) * 0.45;
      const cy = Math.min(sy, ey) - Math.min(180, vh * 0.2);
      const d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;

      // Gold trajectory streak
      streakSvg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
      streakSvg.innerHTML = `<path class="streak-glow" d="${d}"/><path class="streak-core" d="${d}"/>`;
      const paths = Array.from(streakSvg.querySelectorAll("path"));
      const len = paths[0].getTotalLength();
      paths.forEach((p, i) => {
        p.style.strokeDasharray = `${len} ${len}`;
        p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
          duration: 420, delay: i * 30, easing: "cubic-bezier(.5,0,.2,1)", fill: "forwards",
        });
      });

      // The ball: a clone flies along the same curve while the hero ball hides
      if (ball && rect && visible) {
        const shot = document.createElement("div");
        shot.className = "shot-ball";
        shot.style.width = shot.style.height = `${rect.width}px`;
        shot.appendChild(ball.cloneNode(true));
        document.body.appendChild(shot);
        // opacity, not visibility: the clone reuses this SVG's <clipPath> by id, and hidden
        // clip-path children would clip the clone's patches away.
        ball.style.opacity = "0";
        const timing: KeyframeAnimationOptions = { duration: 440, easing: "cubic-bezier(.45,0,.75,.3)", fill: "forwards" };
        if (supportsOffsetPath()) {
          shot.style.offsetPath = `path("${d}")`;
          shot.animate(
            [
              { offsetDistance: "0%", transform: "scale(1) rotate(0deg)" },
              { offsetDistance: "100%", transform: "scale(.22) rotate(720deg)" },
            ],
            timing,
          );
        } else {
          shot.style.left = `${sx - rect.width / 2}px`;
          shot.style.top = `${sy - rect.height / 2}px`;
          shot.animate(
            [
              { transform: "translate3d(0,0,0) scale(1)" },
              { transform: `translate3d(${ex - sx}px, ${ey - sy}px, 0) scale(.22) rotate(720deg)` },
            ],
            timing,
          );
        }
      }

      // The streak opens into a full-screen wipe in the direction of the shot
      const start = dir > 0 ? { l1: -12, l2: -24, r1: -12, r2: -24 } : { l1: 124, l2: 112, r1: 124, r2: 112 };
      const end = { l1: -12, l2: -24, r1: 124, r2: 112 };
      const wipe = { clipPath: [polygon(start), polygon(end)] };

      await wait(240);
      const g = animate(gold, wipe, { duration: 0.38, ease: EASE.io });
      const k = animate(ink, wipe, { duration: 0.38, delay: 0.09, ease: EASE.io });
      if (logoRef.current) {
        animate(logoRef.current, { opacity: [0, 1], transform: ["scale(0.86)", "scale(1)"] }, { duration: 0.26, delay: 0.33, ease: EASE.out });
      }
      await Promise.all([g.finished, k.finished]);
      await wait(80);
    },
  }));

  return (
    <div className="auth-wipe" ref={rootRef} aria-hidden="true">
      <svg className="auth-wipe__streak" ref={streakRef} />
      <div className="auth-wipe__gold" ref={goldRef} />
      <div className="auth-wipe__ink" ref={inkRef}>
        <div className="auth-wipe__logo" ref={logoRef}>
          <Image src="/brand/nft-logo.png" width={500} height={500} sizes="96px" alt="" loading="eager" />
        </div>
      </div>
    </div>
  );
}
