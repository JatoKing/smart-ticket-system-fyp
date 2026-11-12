"use client";

// VenueSection — Stadium Bukit Jalil, ONE section from venue intro to seat map.
//
// Desktop (pinned):
//  A. intro: copy on the left, top-view aerial photo on the right
//  B. the camera dives into the roof opening (photo scales + turns so the pitch lies flat),
//     the city around it darkens and drains of colour
//  C. the diagram takes over in the same frame: ring outlines draw, the pitch appears
//  D. sections fill level by level, gates appear, ticket zones light up; on the left the venue
//     details give way to the seating guide (the title stays)
//  E. short hold, then the section unpins
// Phones pin just the visual for a shorter version; reduced motion shows the finished map.
// Venue facts are fixed public information; the map uses GET /api/stadium.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MEDIA, ScrollTrigger, SplitText, gsap, useGSAP } from "@/lib/gsap";
import { useStadiumPlan, type CategoryKey, type StadiumSection } from "@/lib/stadium";
import { ROUTES } from "@/lib/site-config";
import { scrollToY } from "@/lib/smooth-scroll";
import { SeatGuide, StadiumMapSvg, type SeatFocus } from "./StadiumMap";

const FACTS = [
  { label: "Capacity", value: "87,411", note: "Malaysia's largest stadium" },
  { label: "Opened", value: "1998", note: "Built for the Commonwealth Games" },
  { label: "Entry gates", value: "A–E", note: "Plus a dedicated VIP gate" },
  { label: "Getting there", value: "LRT", note: "Bukit Jalil station, Sri Petaling Line" },
];

// Centre of the roof opening in the photo, as a fraction of the (square, object-fit: cover) frame.
const BOWL_ORIGIN = "50.5% 47.6%";

export default function VenueSection() {
  const root = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const seatTrigger = useRef<ScrollTrigger | null>(null);
  const { state, retry } = useStadiumPlan();
  const plan = state.status === "ready" ? state.plan : null;

  const [active, setActive] = useState<StadiumSection | null>(null);
  const [focusCat, setFocusCat] = useState<CategoryKey | null>(null);
  const [focusGate, setFocusGate] = useState<string | null>(null);
  const focus: SeatFocus = { active, setActive, focusCat, setFocusCat, focusGate, setFocusGate };

  /** "View seat map": jump to the finished map state of the scroll sequence. */
  const showSeatMap = () => {
    const st = seatTrigger.current;
    const reduced = window.matchMedia(MEDIA.reduced).matches;
    if (st) scrollToY(st.start + (st.end - st.start) * 0.94, { duration: 2.2 });
    else document.getElementById("seat-map")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  // Fixtures and lineup load their data after the page renders, which changes the height of
  // everything above this section. Re-measure the pinned sequence whenever that happens,
  // otherwise it would pin at a stale scroll position.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const above: Element[] = [];
    for (let s = el.previousElementSibling; s; s = s.previousElementSibling) above.push(s);
    let timer = 0;
    const heights = new Map<Element, number>();
    const ro = new ResizeObserver((entries) => {
      let changed = false;
      for (const e of entries) {
        const h = Math.round(e.contentRect.height);
        if (heights.has(e.target) && heights.get(e.target) !== h) changed = true;
        heights.set(e.target, h);
      }
      if (!changed) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    above.forEach((s) => ro.observe(s));
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const svg = svgRef.current;
      const mm = gsap.matchMedia();
      const ready = state.status === "ready";

      // ── A: entrance (all motion-enabled layouts) ──
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(q(".venue__title")[0], { type: "lines", mask: "lines" });
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 70%", once: true } })
          .fromTo(q(".venue__frame"), { clipPath: "inset(100% 0% 0% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo.inOut" }, 0)
          .from(q(".venue__photo"), { scale: 1.3, duration: 1.8, ease: "expo.out", clearProps: "scale" }, 0.1)
          .from(q(".venue__place"), { y: 14, autoAlpha: 0, duration: 0.7 }, 0.35)
          .from(split.lines, { yPercent: 105, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.4)
          .from(q(".venue__desc"), { y: 16, autoAlpha: 0, duration: 0.8 }, 0.7)
          .from(q(".venue__fact"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.85)
          .from(q(".venue__fact-rule"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.9, stagger: 0.08, ease: "power3.inOut" }, 0.85)
          .from(q(".venue__actions > *"), { y: 12, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 1.2);
        return () => split.revert();
      });

      if (!ready) return;

      /** B–D on a scrubbed timeline; `withCopy` adds the left-column swap (desktop only). */
      const buildSequence = (withCopy: boolean) => {
        const tl = gsap.timeline({ defaults: { ease: "none" } });
        tl.fromTo(
          q(".venue__photo"),
          { scale: 1, rotate: 0, filter: "saturate(1) brightness(1)", transformOrigin: BOWL_ORIGIN },
          { scale: 3.1, rotate: 24, filter: "saturate(0.25) brightness(0.45)", duration: 0.42, ease: "power2.inOut" },
          0.04,
        )
          .fromTo(q(".venue__focus"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.12)
          .to(q(".venue__caption, .venue__pin"), { autoAlpha: 0, duration: 0.08 }, 0.06)
          .fromTo(q(".venue__map"), { autoAlpha: 0, scale: 0.82, rotateX: 38, transformPerspective: 1400 }, { autoAlpha: 1, scale: 1, rotateX: 0, duration: 0.24, ease: "power2.out" }, 0.34)
          .fromTo(q(".seatmap__outline"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.16, stagger: 0.01 }, 0.36)
          .from(q(".seatmap__pitch"), { autoAlpha: 0, duration: 0.06 }, 0.44)
          .to(q(".venue__photo-wrap"), { autoAlpha: 0.12, duration: 0.12 }, 0.46);
        ([1, 2, 3] as const).forEach((lvl, i) => {
          tl.from(q(`.sec[data-level="${lvl}"]`), { autoAlpha: 0, duration: 0.05, stagger: 0.0016 }, 0.5 + i * 0.08);
        });
        tl.from(q(".seatmap__gate"), { autoAlpha: 0, y: -10, duration: 0.05, stagger: 0.012 }, 0.74);
        if (withCopy) {
          tl.to(q(".venue__details"), { autoAlpha: 0, y: -24, duration: 0.12 }, 0.5)
            .fromTo(q(".venue__guide"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.78);
        }
        tl.to({}, { duration: 0.08 }); // hold on the finished map
        return tl;
      };

      // ── B–E desktop: pin the whole section ──
      mm.add(MEDIA.desktopMotion, () => {
        svg?.classList.remove("is-zoned");
        const tl = buildSequence(true);
        const stage = q<HTMLElement>(".venue__stage")[0];
        seatTrigger.current = ScrollTrigger.create({
          trigger: stage,
          // On very short screens the stage can be taller than the viewport: pin it by its
          // bottom edge then, so the seating guide and "Book seats" stay on screen.
          start: () => (stage.offsetHeight > window.innerHeight + 1 ? "bottom bottom" : "top top"),
          end: "+=240%",
          pin: true,
          scrub: 0.7,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: (self) => svg?.classList.toggle("is-zoned", self.progress > 0.8),
        });
        return () => {
          seatTrigger.current = null;
        };
      });

      // ── phones: pin only the visual for a shorter version ──
      mm.add(MEDIA.mobileMotion, () => {
        svg?.classList.remove("is-zoned");
        const tl = buildSequence(false);
        seatTrigger.current = ScrollTrigger.create({
          trigger: q(".venue__frame")[0],
          start: "center center",
          end: "+=140%",
          pin: true,
          scrub: 0.6,
          animation: tl,
          onUpdate: (self) => svg?.classList.toggle("is-zoned", self.progress > 0.8),
        });
        return () => {
          seatTrigger.current = null;
        };
      });

      // ── reduced motion: the finished map, no pinning ──
      mm.add(MEDIA.reduced, () => {
        svg?.classList.add("is-zoned");
        el.classList.add("is-static");
      });
    },
    { scope: root, dependencies: [state.status], revertOnUpdate: true },
  );

  return (
    <section id="venue" ref={root} className="venue" aria-labelledby="venue-title">
      <div className="venue__stage">
        <div className="venue__inner">
          <div className="venue__copy">
            <p className="venue__place">National Sports Complex, Bukit Jalil, Kuala Lumpur</p>
            <h2 id="venue-title" className="section-title venue__title">
              Stadium
              <br />
              Bukit Jalil
            </h2>

            <div className="venue__swap">
              <div className="venue__details">
                <p className="venue__desc" id="venue-desc">
                  Malaysia&apos;s national stadium and the home of Harimau Malaya. Built for the 1998 Commonwealth Games,
                  the bowl holds more than 87,000 fans under one roof, and on matchday the whole of it sings.
                </p>
                <dl className="venue__facts">
                  {FACTS.map((f) => (
                    <div className="venue__fact" key={f.label}>
                      <span className="venue__fact-rule" aria-hidden="true" />
                      <dt>{f.label}</dt>
                      <dd>
                        <span className="venue__fact-value">{f.value}</span>
                        <span className="venue__fact-note">{f.note}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="venue__actions">
                  <button type="button" className="btn btn--primary" onClick={showSeatMap}>View seat map</button>
                  <a className="btn btn--ghost" href={ROUTES.directions} target="_blank" rel="noopener noreferrer">
                    Get directions
                    <span className="sr-only"> (opens Google Maps in a new tab)</span>
                  </a>
                </div>
              </div>

              <div className="venue__guide">
                {plan && <SeatGuide plan={plan} focus={focus} />}
                {state.status === "error" && (
                  <div className="fixtures__message" role="alert">
                    <p>The seat map can&apos;t be loaded right now. Check that the Laravel server is running, then try again.</p>
                    <button type="button" className="btn btn--ghost" onClick={retry}>Try again</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <figure className="venue__frame" id="seat-map">
            <div className="venue__photo-wrap">
              <Image
                className="venue__photo"
                src="/venue/bukit-jalil-top.webp"
                alt="Top-down aerial view of Stadium Bukit Jalil, its white roof and the pitch inside"
                width={1080}
                height={1342}
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </div>
            <span className="venue__focus" aria-hidden="true" />
            <span className="venue__pin" aria-hidden="true">
              <span className="venue__pin-dot" />
            </span>
            <figcaption className="venue__caption">
              <span>Stadium Bukit Jalil</span>
              <span className="venue__coords">3.05° N, 101.69° E</span>
            </figcaption>
            <div className="venue__map">
              {plan && <StadiumMapSvg plan={plan} focus={focus} svgRef={svgRef} labelledBy="venue-title venue-desc" />}
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
