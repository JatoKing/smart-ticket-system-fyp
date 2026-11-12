// Login ↔ Register choreography (reference: diagonal panel sweep from the supplied video).
//
// Desktop/tablet: the football panel is a 4-point clip-path polygon. It sweeps right → left,
// briefly covers the whole card, then retracts so the layout mirrors. Mobile: a diagonal
// gold/charcoal wipe over the form area. Reduced motion: a plain cross-fade.
//
// Static states live in auth.css (keyed by [data-mode]); these animations only bridge them,
// then inline styles are cleared so CSS is the single source of truth again.

import { animate, stagger } from "motion/react";
import type { FootballHandle } from "@/components/auth/AnimatedFootball";
import {
  EASE, CSS_EASE, type Diagonal, type Mode, clearInline, polygon, variants, wait, widen,
} from "./motion";

// Keep in sync with --clip-* / --stripe-* / --glow-* in auth.css
const STATES: Record<"login" | "cover" | "release" | "register", Diagonal> = {
  login: { l1: 49, l2: 41, r1: 100, r2: 100 },
  cover: { l1: -2, l2: -16, r1: 100, r2: 100 },
  release: { l1: 0, l2: 0, r1: 100, r2: 90 },
  register: { l1: 0, l2: 0, r1: 59, r2: 51 },
};
const STRIPE = 0.6;
const GLOW = 2.2;
const PANEL = 0.88; // seconds
const DELAY = 0.11;
const STAGE_SHIFT = "-81.8182%"; // 45 / 55 — hero content moves from the right column to the left
const BG_SHIFT = "-58.7302%"; // 37 / 63

export type SwitchKind = "desktop" | "mobile" | "reduced";

export type SwitchContext = {
  root: HTMLElement;
  from: Mode;
  to: Mode;
  football: FootballHandle | null;
  /** Render both forms (incoming marked as entering). Must flush synchronously. */
  begin: () => void;
  /** Commit the new mode to React state. Must flush synchronously. */
  commit: () => void;
};

const sel = <T extends Element = HTMLElement>(root: Element, s: string) => root.querySelector<T>(s);
const all = (root: Element, s: string) => Array.from(root.querySelectorAll<HTMLElement>(s));

type Trackable = { finished: Promise<unknown> };
const settle = (items: Trackable[]) => Promise.all(items.map((a) => a.finished.catch(() => null)));

function edge(from: Mode, widenBy: number) {
  const forward = from === "login";
  const keys = forward
    ? (["login", "cover", "release", "register"] as const)
    : (["register", "release", "cover", "login"] as const);
  return {
    values: keys.map((k) => polygon(widen(STATES[k], widenBy))),
    times: forward ? [0, 0.42, 0.56, 1] : [0, 0.44, 0.58, 1],
  };
}

const band = (a: number, b: number, w: number) => `polygon(${a}% 0%, ${a + w}% 0%, ${b + w}% 100%, ${b}% 100%)`;

export async function runSwitch(kind: SwitchKind, ctx: SwitchContext) {
  if (kind === "reduced") return runReduced(ctx);
  if (kind === "mobile") return runMobile(ctx);
  return runDesktop(ctx);
}

async function runDesktop({ root, from, to, football, begin, commit }: SwitchContext) {
  const forward = from === "login";
  const slotFrom = sel(root, `[data-slot="${from}"]`)!;
  const slotTo = sel(root, `[data-slot="${to}"]`)!;
  const outItems = all(slotFrom, "[data-stagger]");
  const inItems = all(slotTo, "[data-stagger]");
  const panel = sel(root, ".hero-panel")!;
  const stripe = sel(root, ".hero-stripe")!;
  const glow = sel(root, ".hero-stripe-glow")!;
  const sweeps = all(root, ".hero-sweep span");
  const stage = sel(root, ".hero-stage")!;
  const heroBg = sel(root, ".hero-bg")!;
  const copyFrom = sel(root, `.hero-copy[data-for="${from}"]`)!;
  const copyTo = sel(root, `.hero-copy[data-for="${to}"]`)!;
  const ballScene = sel(root, ".ball-scene");
  const logo = sel(root, ".hero-logo");
  const traj = sel<SVGPathElement>(root, ".traj-line--gold");

  begin();
  // Hide incoming elements before they become visible (same frame, before paint).
  for (const el of [...inItems, copyTo]) el.style.opacity = "0";

  const running: Trackable[] = [];

  // 1 · outgoing form fades, drifts and blurs away (staggered)
  running.push(animate(outItems, variants.exit(forward ? -1 : 1), { duration: 0.32, delay: stagger(0.04), ease: EASE.in }));

  // 2–5 · panel, gold edge and glow sweep across, dominate the card, then settle opposite
  const segEase = [EASE.segIn, "linear", EASE.segOut] as const;
  const sweep = (el: Element, w: number) => {
    const e = edge(from, w);
    return animate(el, { clipPath: e.values }, { duration: PANEL, delay: DELAY, times: e.times, ease: [...segEase] });
  };
  const panelAnim = sweep(panel, 0);
  running.push(panelAnim, sweep(stripe, STRIPE), sweep(glow, GLOW));

  // broadcast-style band racing ahead of the panel edge
  sweeps.forEach((el, i) => {
    const w = i ? 0.45 : 6;
    const right = band(104, 96, w);
    const left = band(-30, -38, w);
    const opts = { duration: PANEL * 0.9, delay: DELAY + 0.03 + i * 0.07 };
    running.push(animate(el, { clipPath: forward ? [right, left] : [left, right] }, { ...opts, ease: EASE.io }));
    running.push(animate(el, { opacity: [0, 1, 1, 0] }, { ...opts, times: [0, 0.14, 0.8, 1], ease: "linear" }));
  });

  // hero content travels with the panel; the background trails for depth
  const zero = "translate3d(0%,0,0)";
  running.push(animate(stage, { transform: forward ? [zero, `translate3d(${STAGE_SHIFT},0,0)`] : [`translate3d(${STAGE_SHIFT},0,0)`, zero] }, {
    duration: PANEL * 0.62, delay: DELAY + PANEL * 0.2, ease: EASE.io,
  }));
  running.push(animate(heroBg, { transform: forward ? [zero, `translate3d(${BG_SHIFT},0,0)`] : [`translate3d(${BG_SHIFT},0,0)`, zero] }, {
    duration: PANEL * 0.8, delay: DELAY + PANEL * 0.12, ease: EASE.io,
  }));

  // welcome copy swap
  running.push(animate(copyFrom, variants.copyOut, { duration: 0.26, delay: DELAY, ease: EASE.in }));
  running.push(animate(copyTo, variants.copyIn, { duration: 0.56, delay: DELAY + PANEL * 0.55, ease: EASE.out }));

  // 3 · the football reacts — spin burst, squash, logo shift, trajectory re-draw
  football?.kick(6, 700);
  if (ballScene) {
    running.push(animate(ballScene, { transform: ["scale(1) rotate(0deg)", "scale(0.9) rotate(-8deg)", "scale(1.05) rotate(4deg)", "scale(1) rotate(0deg)"] }, {
      duration: PANEL, delay: DELAY, times: [0, 0.32, 0.68, 1], ease: "easeInOut",
    }));
  }
  if (logo) {
    running.push(animate(logo, { transform: ["translate3d(0,0px,0) rotate(0deg) scale(1)", "translate3d(0,-8px,0) rotate(-10deg) scale(0.92)", "translate3d(0,0px,0) rotate(0deg) scale(1)"] }, {
      duration: PANEL, delay: DELAY, ease: "easeInOut",
    }));
  }
  if (traj) {
    // SVG stroke: native WAAPI so it overrides the CSS draw-in animation cleanly.
    const a = traj.animate(
      [{ strokeDashoffset: 0 }, { strokeDashoffset: -1, offset: 0.3 }, { strokeDashoffset: 1, offset: 0.301 }, { strokeDashoffset: 0 }],
      { duration: (PANEL + 0.32) * 1000, delay: DELAY * 1000, easing: CSS_EASE.io },
    );
    running.push(a);
  }

  // 6 · incoming form: heading → fields → button → link
  running.push(animate(inItems, variants.enterUp, { duration: 0.46, delay: stagger(0.055, { startDelay: DELAY + PANEL * 0.58 }), ease: EASE.out }));

  await panelAnim.finished;
  commit();
  await settle(running);
  clearInline([...outItems, ...inItems, panel, stripe, glow, ...sweeps, stage, heroBg, copyFrom, copyTo, ballScene, logo]);
}

async function runMobile({ root, from, to, football, begin, commit }: SwitchContext) {
  const forward = from === "login";
  const slotFrom = sel(root, `[data-slot="${from}"]`)!;
  const slotTo = sel(root, `[data-slot="${to}"]`)!;
  const outItems = all(slotFrom, "[data-stagger]");
  const inItems = all(slotTo, "[data-stagger]");
  const copyFrom = sel(root, `.hero-copy[data-for="${from}"]`)!;
  const copyTo = sel(root, `.hero-copy[data-for="${to}"]`)!;
  const [gold, ink] = all(root, ".mobile-wipe span");

  const s = (l1: number, l2: number, r1: number, r2: number) => polygon({ l1, l2, r1, r2 });
  const enterSide = forward ? s(112, 100, 112, 100) : s(-14, -26, -14, -26);
  const exitSide = forward ? s(-14, -26, -14, -26) : s(112, 100, 112, 100);
  const full = s(-14, -26, 112, 100);
  const wipe = { clipPath: [enterSide, full, full, exitSide] };
  const T = 0.76;

  const goldAnim = animate(gold, wipe, { duration: T, times: [0, 0.45, 0.55, 1], ease: [EASE.io, "linear", EASE.io] });
  const inkAnim = animate(ink, wipe, { duration: T, delay: 0.07, times: [0, 0.45, 0.55, 1], ease: [EASE.io, "linear", EASE.io] });
  const running: Trackable[] = [goldAnim, inkAnim];
  running.push(animate(outItems, { opacity: [1, 0] }, { duration: 0.18, delay: stagger(0.02), ease: EASE.in }));
  running.push(animate(copyFrom, variants.copyOut, { duration: 0.22, ease: EASE.in }));
  football?.kick(4, 600);

  await wait(T * 500 + 40); // both layers fully cover the form area now
  begin();
  for (const el of [...inItems, copyTo]) el.style.opacity = "0";
  slotFrom.style.visibility = "hidden";
  running.push(animate(copyTo, variants.copyIn, { duration: 0.42, ease: EASE.out }));
  running.push(animate(inItems, variants.enterUp, { duration: 0.42, delay: stagger(0.045, { startDelay: 0.14 }), ease: EASE.out }));

  await settle([goldAnim, inkAnim]);
  commit();
  await settle(running);
  clearInline([...outItems, ...inItems, copyFrom, copyTo, gold, ink, slotFrom]);
}

async function runReduced({ root, begin, commit }: SwitchContext) {
  const shell = sel(root, ".auth-shell")!;
  await animate(shell, { opacity: [1, 0] }, { duration: 0.15, ease: "easeOut" }).finished;
  begin();
  commit();
  await animate(shell, { opacity: [0, 1] }, { duration: 0.22, ease: "easeOut" }).finished;
  clearInline([shell]);
}
