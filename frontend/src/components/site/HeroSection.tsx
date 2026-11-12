"use client";

// HeroSection — Malaysia Home & Away kits as premium 2D product shots (no WebGL).
//
// Each jersey is a stack of layers so every GSAP effect owns its own element/property:
//   .kit__stage    intro entrance (x, rotation, opacity) + scroll-out drift on .kit
//   .kit__parallax pointer parallax (x / y via quickTo, desktop only)
//   .kit__float    idle floating (y, yoyo)
//   .kit__frame    hover (scale + brightness)
//   .kit__img      front ↔ back cross-fade
//   .kit__glow / .kit__shadow  hover glow, soft floor shadow (scale follows the float)
// Front / Back use the real back-view photos. A click/tap on a jersey also turns it.

import Image from "next/image";
import { useRef, useState } from "react";
import { MEDIA, SplitText, gsap, magnetic, useGSAP } from "@/lib/gsap";
import { ROUTES } from "@/lib/site-config";

type KitId = "home" | "away";
type View = "front" | "back";

const KITS: Array<{ id: KitId; label: string; front: string; back: string; w: number; h: number }> = [
  { id: "home", label: "Home", front: "/jerseys/home-front.webp", back: "/jerseys/home-back.webp", w: 1104, h: 1426 },
  { id: "away", label: "Away", front: "/jerseys/away-front.webp", back: "/jerseys/away-back.webp", w: 1112, h: 1434 },
];

// Floating: slightly different amplitude / period per kit so they never move in lockstep.
const FLOAT: Record<KitId, { y: number; duration: number; delay: number }> = {
  home: { y: -12, duration: 3, delay: 0 },
  away: { y: -14, duration: 3.5, delay: 0.6 },
};
// Parallax reach in px at the edge of the screen (each kit responds on its own).
const PARALLAX: Record<KitId, { x: number; y: number; lag: number }> = {
  home: { x: 12, y: 8, lag: 0.9 },
  away: { x: 15, y: 10, lag: 1.15 },
};

// Rendered width of a jersey: ~46vw on phones, otherwise capped by the 64svh-tall stage.
const KIT_SIZES = "(max-width: 767px) 46vw, min(30vw, 50vh)";

const isFinePointer = () => window.matchMedia("(pointer: fine)").matches;
const prefersReduced = () => window.matchMedia(MEDIA.reduced).matches;

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const [views, setViews] = useState<Record<KitId, View>>({ home: "front", away: "front" });

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MEDIA.reduced, () => {
        el.dataset.intro = "done";
      });

      mm.add({ desktop: MEDIA.desktopMotion, mobile: MEDIA.mobileMotion }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const split = SplitText.create(q(".hero__title")[0], { type: "lines,chars", mask: "lines" });
        el.dataset.intro = "running";

        // ── Intro (~1.2s): light → Home from the left → Away from the right → both settle →
        //    headline → subtitle → CTAs → labels and view controls ──
        const intro = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
          onComplete: () => void (el.dataset.intro = "done"),
        });
        intro
          .from(q(".hero__atmos > *"), { autoAlpha: 0, duration: 0.6, stagger: 0.05 }, 0)
          .from(q(".kit__light"), { autoAlpha: 0, duration: 0.7 }, 0.05)
          .from(q(".kit--home .kit__stage"), { xPercent: -28, rotation: -4, autoAlpha: 0, duration: 0.85 }, 0.1)
          .from(q(".kit--away .kit__stage"), { xPercent: 28, rotation: 4, autoAlpha: 0, duration: 0.85 }, 0.18)
          .from(split.chars, { yPercent: 115, duration: 0.6, stagger: 0.012, ease: "expo.out" }, 0.34)
          .from(q(".hero__lede"), { y: 12, autoAlpha: 0, duration: 0.45 }, 0.6)
          .from(q(".hero__actions > *"), { y: 12, autoAlpha: 0, duration: 0.4, stagger: 0.06 }, 0.7)
          .from(q(".kit__caption > *"), { y: 8, autoAlpha: 0, duration: 0.4, stagger: 0.05 }, 0.76);

        // Start once the front photos are decoded (never wait longer than 800ms).
        const photos = q<HTMLImageElement>(".kit__img--front");
        void Promise.race([
          Promise.all(photos.map((img) => img.decode().catch(() => undefined))),
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]).then(() => intro.play());

        // ── Idle float, shadow breathes with it (smaller on phones) ──
        const scale = desktop ? 1 : 0.5;
        KITS.forEach(({ id }) => {
          const f = FLOAT[id];
          const common = { duration: f.duration, delay: f.delay, ease: "sine.inOut", yoyo: true, repeat: -1 };
          gsap.to(q(`.kit--${id} .kit__float`), { y: f.y * scale, ...common });
          gsap.to(q(`.kit--${id} .kit__shadow`), { scaleX: 0.88, scaleY: 0.82, ...common });
        });

        // ── Scroll out: kits drift apart, copy lifts away ──
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } })
          .to(q(".kit--home"), { xPercent: -10, autoAlpha: 0.35, ease: "none" }, 0)
          .to(q(".kit--away"), { xPercent: 10, autoAlpha: 0.35, ease: "none" }, 0)
          .to(q(".hero__center"), { yPercent: -18, autoAlpha: 0, ease: "power1.in" }, 0);

        // ── Pointer parallax (desktop, mouse): each kit and the coloured light respond on their own ──
        let offParallax = () => {};
        if (desktop && isFinePointer()) {
          const movers = KITS.map(({ id }) => {
            const p = PARALLAX[id];
            const target = q(`.kit--${id} .kit__parallax`);
            return {
              p,
              x: gsap.quickTo(target, "x", { duration: p.lag, ease: "power3.out" }),
              y: gsap.quickTo(target, "y", { duration: p.lag, ease: "power3.out" }),
            };
          });
          const glowX = gsap.quickTo(q(".hero__glow"), "x", { duration: 1.6, ease: "power2.out" });
          const glowY = gsap.quickTo(q(".hero__glow"), "y", { duration: 1.6, ease: "power2.out" });
          const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            movers.forEach((m) => {
              m.x(nx * m.p.x);
              m.y(ny * m.p.y);
            });
            glowX(nx * 22);
            glowY(ny * 14);
          };
          const onLeave = () => {
            movers.forEach((m) => {
              m.x(0);
              m.y(0);
            });
            glowX(0);
            glowY(0);
          };
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
          offParallax = () => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
          };
        }

        const unmagnet = q(".hero__actions .btn").map((b) => magnetic(b as HTMLElement));
        return () => {
          offParallax();
          unmagnet.forEach((off) => off());
          split.revert();
        };
      });
    },
    { scope: root },
  );

  /** Hover: lift the jersey a touch, brighten it, deepen the shadow, bring up the glow. */
  const hover = (fig: Element | null, on: boolean) => {
    if (!fig || !isFinePointer()) return;
    const q = gsap.utils.selector(fig);
    const d = prefersReduced() ? 0 : 0.35;
    const opts = { duration: d, ease: "power2.out", overwrite: "auto" as const };
    gsap.to(q(".kit__frame"), { scale: on ? 1.035 : 1, filter: `brightness(${on ? 1.07 : 1})`, ...opts });
    gsap.to(q(".kit__glow"), { autoAlpha: on ? 1 : 0, scale: on ? 1 : 0.92, ...opts, duration: d * 1.2 });
    gsap.to(q(".kit__shadow"), { opacity: on ? 0.85 : 0.6, ...opts });
  };

  /** Front ↔ back: the outgoing photo slides and softens away while the other one settles in. */
  const show = (fig: Element | null, id: KitId, view: View) => {
    if (!fig || views[id] === view) return;
    setViews((v) => ({ ...v, [id]: view }));
    const q = gsap.utils.selector(fig);
    const front = q(".kit__img--front");
    const back = q(".kit__img--back");
    const [outgoing, incoming] = view === "back" ? [front, back] : [back, front];
    if (prefersReduced()) {
      gsap.set(outgoing, { autoAlpha: 0 });
      gsap.set(incoming, { autoAlpha: 1, x: 0, scale: 1, filter: "blur(0px)" });
      return;
    }
    const dir = view === "back" ? 1 : -1;
    gsap
      .timeline({ defaults: { overwrite: "auto" } })
      .to(outgoing, { autoAlpha: 0, x: -dir * 22, scale: 0.97, filter: "blur(4px)", duration: 0.35, ease: "power2.in" }, 0)
      .fromTo(
        incoming,
        { autoAlpha: 0, x: dir * 22, scale: 0.97, filter: "blur(4px)" },
        { autoAlpha: 1, x: 0, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
        0.16,
      );
  };

  const renderKit = (kit: (typeof KITS)[number]) => (
    <figure className={`kit kit--${kit.id}`} data-view={views[kit.id]}>
      <div className="kit__light" aria-hidden="true" />
      {/* Pointer target only; the accessible controls are the buttons in the caption. */}
      <div
        className="kit__stage"
        aria-hidden="true"
        onPointerEnter={(e) => e.pointerType === "mouse" && hover(e.currentTarget.closest(".kit"), true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && hover(e.currentTarget.closest(".kit"), false)}
        onClick={(e) => show(e.currentTarget.closest(".kit"), kit.id, views[kit.id] === "front" ? "back" : "front")}
      >
        <div className="kit__parallax">
          <span className="kit__glow" />
          <span className="kit__shadow" />
          <div className="kit__float">
            <div className="kit__frame">
              <Image
                className="kit__img kit__img--front"
                src={kit.front}
                alt=""
                width={kit.w}
                height={kit.h}
                quality={90}
                sizes={KIT_SIZES}
                preload
                draggable={false}
              />
              <Image
                className="kit__img kit__img--back"
                src={kit.back}
                alt=""
                width={kit.w}
                height={kit.h}
                quality={90}
                sizes={KIT_SIZES}
                loading="eager"
                fetchPriority="low" // only needed once someone turns the jersey
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="kit__caption">
        <span className="kit__label">{kit.label}</span>
        <div className="kit__controls" role="group" aria-label={`Malaysia ${kit.label.toLowerCase()} jersey view`}>
          <button type="button" aria-pressed={views[kit.id] === "front"} onClick={(e) => show(e.currentTarget.closest(".kit"), kit.id, "front")}>
            Front
          </button>
          <button type="button" aria-pressed={views[kit.id] === "back"} onClick={(e) => show(e.currentTarget.closest(".kit"), kit.id, "back")}>
            Back
          </button>
        </div>
      </figcaption>
    </figure>
  );

  return (
    <section ref={root} className="hero" data-intro="pending" aria-labelledby="hero-title">
      <div className="hero__atmos" aria-hidden="true">
        <span className="hero__glow hero__glow--home" />
        <span className="hero__glow hero__glow--away" />
        <span className="hero__rays" />
        <span className="hero__grain" />
      </div>

      <div className="hero__grid">
        {renderKit(KITS[0])}

        <div className="hero__center">
          <h1 className="hero__title" id="hero-title">
            Home. Away.
            <br />
            One nation.
          </h1>
          <div className="hero__body">
            <p className="hero__lede">Experience the pride of Malaysian football.</p>
            <div className="hero__actions">
              <a className="btn btn--primary" href={ROUTES.fixturesAnchor}>View fixtures</a>
              <a className="btn btn--ghost" href={ROUTES.bookTickets}>Explore tickets</a>
              <a className="btn btn--text" href={ROUTES.lineupAnchor}>View lineup</a>
            </div>
          </div>
        </div>

        {renderKit(KITS[1])}
      </div>
    </section>
  );
}
