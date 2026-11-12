"use client";

// Seating plan (GET /api/stadium) + the geometry that turns section numbers into an SVG bowl.
//
// Three rings of 34 sections (level 1 = 1xx inner, 2 = 2xx, 3 = 3xx outer), numbered clockwise.
// Angles: 0° = 3 o'clock, clockwise (SVG y points down). The orientation matches the official
// Bukit Jalil plan: VIP at the top, Gate A top-right, B right, C bottom, D left, E top-left.

import { useEffect, useState } from "react";
import { LARAVEL_PUBLIC_URL } from "./auth-config";

export type CategoryKey = "Premium" | "Grandstand" | "Home" | "UltrasMalaya" | "Away";

export type StadiumSection = { id: string; gate: string; level: 1 | 2 | 3; category: CategoryKey };
export type StadiumCategory = { key: CategoryKey; label: string; price: number };
export type StadiumPlan = {
  venue: string;
  currency: string;
  categories: StadiumCategory[];
  gates: string[];
  sections: StadiumSection[];
  bookingPath: string;
};

export const bookingPlanUrl = (p: StadiumPlan) => `${LARAVEL_PUBLIC_URL}${p.bookingPath}`;

export const CENTER = { x: 500, y: 390 };
const RINGS: Record<1 | 2 | 3, { inner: [number, number]; outer: [number, number] }> = {
  1: { inner: [212, 150], outer: [266, 198] },
  2: { inner: [274, 206], outer: [338, 262] },
  3: { inner: [346, 270], outer: [406, 322] },
};
const STEP = 360 / 34;
const GAP = 0.55; // degrees between neighbouring sections

/** Angular span [start, end] in degrees for a section id like "307", "201A". */
export function sectionSpan(id: string): [number, number] {
  const n = parseInt(id, 10);
  const level = Math.floor(n / 100) as 1 | 2 | 3;
  let start: number;
  let step = STEP;
  if (level === 1) {
    // 340° with a gap at the top for the media/VIP box; 132 sits right of the gap
    step = 340 / 34;
    const k = (n - 132 + 34) % 34;
    start = -80 + k * step;
  } else {
    const centre = level === 2 ? -90 + (n - 229) * STEP : -90 + (n - 330.5) * STEP;
    start = centre - STEP / 2;
  }
  // split sections: "B" half comes first clockwise, then "A"
  const suffix = id.slice(-1);
  if (suffix === "B") return [start, start + step / 2];
  if (suffix === "A") return [start + step / 2, start + step];
  return [start, start + step];
}

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (rx: number, ry: number, deg: number) =>
  [CENTER.x + rx * Math.cos(rad(deg)), CENTER.y + ry * Math.sin(rad(deg))] as const;

/** Closed path for a ring segment between two angles. */
export function sectionPath(level: 1 | 2 | 3, [a0, a1]: [number, number]) {
  const { inner, outer } = RINGS[level];
  const s = a0 + GAP / 2;
  const e = a1 - GAP / 2;
  const steps = 6;
  const outerPts = Array.from({ length: steps + 1 }, (_, i) => pt(outer[0], outer[1], s + ((e - s) * i) / steps));
  const innerPts = Array.from({ length: steps + 1 }, (_, i) => pt(inner[0], inner[1], e - ((e - s) * i) / steps));
  return `M${[...outerPts, ...innerPts].map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;
}

export function sectionLabelPoint(level: 1 | 2 | 3, [a0, a1]: [number, number]) {
  const { inner, outer } = RINGS[level];
  const mid = (a0 + a1) / 2;
  return pt((inner[0] + outer[0]) / 2, (inner[1] + outer[1]) / 2, mid);
}

/** Ring outline (for the line-drawing intro). */
export function ringEllipse(level: 1 | 2 | 3, edge: "inner" | "outer") {
  const [rx, ry] = RINGS[level][edge];
  return { cx: CENTER.x, cy: CENTER.y, rx, ry };
}

/** Label position for a gate: circular mean of its outer-ring sections, pushed outside the bowl. */
export function gateLabelPoint(gate: string, sections: StadiumSection[]) {
  const own = sections.filter((s) => s.gate === gate && s.level === 3);
  const pool = own.length ? own : sections.filter((s) => s.gate === gate);
  let sx = 0;
  let sy = 0;
  for (const s of pool) {
    const [a0, a1] = sectionSpan(s.id);
    sx += Math.cos(rad((a0 + a1) / 2));
    sy += Math.sin(rad((a0 + a1) / 2));
  }
  const angle = (Math.atan2(sy, sx) * 180) / Math.PI;
  return { angle, point: pt(452, 362, angle) };
}

export const VIP_LABEL = pt(452, 362, -90);

type State = { status: "loading" } | { status: "error" } | { status: "ready"; plan: StadiumPlan };

export function useStadiumPlan() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/backend/api/stadium", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((plan: StadiumPlan) => {
        if (!cancelled) setState({ status: "ready", plan });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: "loading" });
    setAttempt((a) => a + 1);
  };
  return { state, retry };
}
