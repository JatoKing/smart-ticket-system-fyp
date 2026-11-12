// Shared motion language for the NFT auth experience.

export type Mode = "login" | "register";

/** Bezier tuples for Motion (`ease`) and matching CSS strings for WAAPI / CSS. */
export const EASE = {
  io: [0.76, 0, 0.24, 1] as const,
  out: [0.22, 1, 0.36, 1] as const,
  in: [0.55, 0, 0.75, 0.2] as const,
  /** Segment easings for multi-keyframe sweeps (accelerate → cruise → settle). */
  segIn: [0.64, 0, 0.78, 0] as const,
  segOut: [0.22, 1, 0.36, 1] as const,
};
export const CSS_EASE = {
  io: "cubic-bezier(0.76, 0, 0.24, 1)",
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
};

export const isMobileLayout = () => window.matchMedia("(max-width: 767px)").matches;
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** A four-point diagonal shape, x positions in % (top-left, top-right, bottom-right, bottom-left). */
export type Diagonal = { l1: number; l2: number; r1: number; r2: number };

export const polygon = ({ l1, r1, r2, l2 }: Diagonal) =>
  `polygon(${l1}% 0%, ${r1}% 0%, ${r2}% 100%, ${l2}% 100%)`;

export const widen = (s: Diagonal, d: number): Diagonal => ({
  l1: s.l1 - d,
  l2: s.l2 - d,
  r1: s.r1 + d,
  r2: s.r2 + d,
});

/** Reusable keyframe variants (arrays = from → to). */
export const variants = {
  exit: (dir: 1 | -1) => ({
    opacity: [1, 0],
    transform: ["translate3d(0px,0,0)", `translate3d(${36 * dir}px,0,0)`],
    filter: ["blur(0px)", "blur(5px)"],
  }),
  enterUp: {
    opacity: [0, 1],
    transform: ["translate3d(0,18px,0)", "translate3d(0,0px,0)"],
    filter: ["blur(4px)", "blur(0px)"],
  },
  copyOut: { opacity: [1, 0], transform: ["translate3d(0,0px,0)", "translate3d(0,-14px,0)"] },
  copyIn: { opacity: [0, 1], transform: ["translate3d(0,22px,0)", "translate3d(0,0px,0)"] },
  shake: { transform: ["translate3d(0px,0,0)", "translate3d(-7px,0,0)", "translate3d(6px,0,0)", "translate3d(-4px,0,0)", "translate3d(2px,0,0)", "translate3d(0px,0,0)"] },
};

/** Remove inline styles left behind by imperative animations so CSS state takes over again. */
export function clearInline(elements: Iterable<Element | null | undefined>) {
  for (const el of elements) {
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) continue;
    for (const prop of ["opacity", "transform", "filter", "clip-path", "will-change", "stroke-dashoffset", "visibility"]) {
      el.style.removeProperty(prop);
    }
  }
}
