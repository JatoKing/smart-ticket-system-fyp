"use client";

// A real rotating 3D football drawn as SVG — no 3D library. Faces are projected every frame
// and written straight to the DOM (no React re-renders), ~1k points per frame.

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { buildBallFaces, makeRotation } from "@/lib/football-geometry";

export type FootballHandle = {
  /** Short spin burst (transitions). */
  kick: (power?: number, ms?: number) => void;
  /** Sustained faster spin while a request is in flight. */
  windUp: () => void;
  rest: () => void;
  element: () => SVGSVGElement | null;
};

const NS = "http://www.w3.org/2000/svg";
const RADIUS = 96;
const BASE_SPEED = 0.16; // rad/s — extremely slow idle rotation
const TILT_X = -0.42;
const TILT_Z = 0.24;

export default function AnimatedFootball({ ref, reduced }: { ref?: Ref<FootballHandle>; reduced: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const target = useRef(BASE_SPEED);
  const timer = useRef<number | undefined>(undefined);

  useImperativeHandle(
    ref,
    () => ({
      kick(power = 5, ms = 650) {
        if (reduced) return;
        target.current = power;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => (target.current = BASE_SPEED), ms);
      },
      windUp() {
        if (reduced) return;
        window.clearTimeout(timer.current);
        target.current = 2.4;
      },
      rest() {
        window.clearTimeout(timer.current);
        target.current = BASE_SPEED;
      },
      element: () => svgRef.current,
    }),
    [reduced],
  );

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const faces = buildBallFaces(6);
    const paths = faces.map((face) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("class", face.pentagon ? "ball-pent" : "ball-hex");
      group.appendChild(p);
      return p;
    });
    const visible = faces.map(() => false);

    let theta = 0.55;
    let speed = BASE_SPEED;
    let last = performance.now();
    let raf = 0;

    const render = () => {
      const rotate = makeRotation(theta, TILT_X, TILT_Z);
      for (let i = 0; i < faces.length; i++) {
        const face = faces[i];
        if (rotate(face.center)[2] < -0.5) {
          if (visible[i]) {
            paths[i].setAttribute("d", "");
            visible[i] = false;
          }
          continue;
        }
        visible[i] = true;
        let d = "";
        for (let k = 0; k < face.points.length; k++) {
          const q = rotate(face.points[k]);
          let x = q[0] * RADIUS;
          let y = q[1] * RADIUS;
          if (q[2] < 0) {
            // behind the horizon: pin to the silhouette so faces wrap around the edge
            const l = Math.hypot(x, y) || 1;
            x = (x / l) * RADIUS;
            y = (y / l) * RADIUS;
          }
          d += (k ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
        }
        paths[i].setAttribute("d", d + "Z");
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed += (target.current - speed) * Math.min(1, dt * 3.2);
      theta += speed * dt;
      render();
      raf = requestAnimationFrame(frame);
    };

    render();
    if (!reduced) raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      paths.forEach((p) => p.remove());
    };
  }, [reduced]);

  return (
    <svg ref={svgRef} className="football" viewBox="-100 -100 200 200" aria-hidden="true" data-football>
      <defs>
        <radialGradient id="nft-ball-shade" cx="38%" cy="32%" r="78%">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#000" stopOpacity=".06" />
          <stop offset=".82" stopColor="#000" stopOpacity=".42" />
          <stop offset="1" stopColor="#000" stopOpacity=".72" />
        </radialGradient>
        <radialGradient id="nft-ball-spec" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nft-ball-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset=".45" stopColor="#f5b818" stopOpacity="0" />
          <stop offset="1" stopColor="#ffc93c" stopOpacity=".85" />
        </linearGradient>
        <clipPath id="nft-ball-clip">
          <circle r="96" />
        </clipPath>
      </defs>
      <circle r="96" fill="#efefea" />
      <g ref={groupRef} clipPath="url(#nft-ball-clip)" />
      <circle r="96" fill="url(#nft-ball-shade)" />
      <ellipse cx="-36" cy="-44" rx="30" ry="18" fill="url(#nft-ball-spec)" transform="rotate(-32 -36 -44)" opacity=".75" />
      <circle r="95" fill="none" stroke="url(#nft-ball-rim)" strokeWidth="2.5" />
    </svg>
  );
}
