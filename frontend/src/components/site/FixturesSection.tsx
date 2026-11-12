"use client";

// FixturesSection — real fixtures from Laravel (footballmatches + tickets).
// The featured card is drawn as a halfway line: home half, centre circle (VS), away half.

import { useRef } from "react";
import { MEDIA, gsap, useGSAP } from "@/lib/gsap";
import {
  bookingUrl, formatKickoff, formatPrice, matchStatus, pickFeatured, useFixtures, type Fixture,
} from "@/lib/fixtures";
import MatchCountdown from "./MatchCountdown";
import TeamFlag from "./TeamFlag";

const STATUS_TEXT = { upcoming: "Next match", live: "Live now", completed: "Most recent match", tba: "Fixture" } as const;

function FeaturedMatch({ fixture, now }: { fixture: Fixture; now: number }) {
  const status = matchStatus(fixture, now);
  const when = formatKickoff(fixture);
  const away = fixture.away ?? "Opponent to be confirmed";

  return (
    <article className="feature" data-status={status} aria-labelledby={`feature-${fixture.id}`}>
      <div className="feature__pitch" aria-hidden="true">
        <span className="feature__halfway" />
        <svg className="feature__circle" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="96" pathLength={1} />
        </svg>
      </div>

      <p className="feature__kicker">{STATUS_TEXT[status]}</p>

      <h3 className="feature__teams" id={`feature-${fixture.id}`}>
        <span className="feature__team feature__team--home">
          <TeamFlag team={fixture.home} className="feature__flag" />
          <span className="feature__name">{fixture.home}</span>
        </span>
        <span className="feature__vs">
          <span className="feature__impact" aria-hidden="true" />
          <span className="feature__vs-text">vs</span>
        </span>
        <span className="feature__team feature__team--away">
          <TeamFlag team={away} className="feature__flag" />
          <span className="feature__name">{away}</span>
        </span>
      </h3>

      <dl className="feature__meta">
        <div>
          <dt>Date</dt>
          <dd>{fixture.kickoff ? <time dateTime={fixture.kickoff}>{when.date}</time> : when.date}</dd>
        </div>
        <div>
          <dt>Kick-off</dt>
          <dd>{when.time || "To be confirmed"}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{fixture.venue}</dd>
        </div>
      </dl>

      <MatchCountdown fixture={fixture} startedAt={now} />

      {status === "upcoming" || status === "live" ? (
        <div className="feature__cta">
          <a className="btn btn--primary" href={bookingUrl(fixture)}>Book seats</a>
          {fixture.tickets.listed && fixture.tickets.priceFrom !== null && (
            <span className="feature__price">From {formatPrice(fixture.tickets.priceFrom, fixture.tickets.currency)}</span>
          )}
        </div>
      ) : (
        <p className="feature__note">The next fixture appears here as soon as it is announced.</p>
      )}
    </article>
  );
}

function FixtureRow({ fixture, now }: { fixture: Fixture; now: number }) {
  const status = matchStatus(fixture, now);
  const when = formatKickoff(fixture);
  const away = fixture.away ?? "To be confirmed";
  return (
    <li className="fixture-row" data-status={status}>
      <span className="fixture-row__rule" aria-hidden="true" />
      <time className="fixture-row__date" dateTime={fixture.kickoff ?? undefined}>
        <span className="fixture-row__day">{when.day || "TBC"}</span>
        <span className="fixture-row__month">
          {when.weekday} {when.month} {when.year}
        </span>
      </time>
      <span className="fixture-row__time">{when.time}</span>
      <span className="fixture-row__match">
        <span className="fixture-row__team fixture-row__team--home">
          <span>{fixture.home}</span>
          <TeamFlag team={fixture.home} className="fixture-row__flag" />
        </span>
        <span className="fixture-row__vs">vs</span>
        <span className="fixture-row__team">
          <TeamFlag team={away} className="fixture-row__flag" />
          <span>{away}</span>
        </span>
      </span>
      <span className="fixture-row__venue">{fixture.venue}</span>
      <span className="fixture-row__state">
        {status === "upcoming" ? (
          <a className="fixture-row__book" href={bookingUrl(fixture)}>Book seats</a>
        ) : status === "live" ? (
          "Live now"
        ) : status === "completed" ? (
          "Played"
        ) : (
          "To be confirmed"
        )}
      </span>
    </li>
  );
}

export default function FixturesSection() {
  const root = useRef<HTMLElement>(null);
  const { state, retry } = useFixtures();
  const fixtures = state.status === "ready" ? state.fixtures : [];
  const now = state.status === "ready" ? state.now : 0;
  const featured = pickFeatured(fixtures, now);
  const others = fixtures.filter((f) => f !== featured);

  useGSAP(
    () => {
      if (state.status !== "ready" || !root.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const feature = root.current!.querySelector(".feature");
        if (feature) {
          gsap
            .timeline({
              scrollTrigger: { trigger: feature, start: "top 78%", once: true },
              onStart: () => feature.classList.add("is-revealed"),
            })
            .from(".fixtures__head > *", { yPercent: 40, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" }, 0)
            .from(".feature__halfway", { scaleY: 0, duration: 0.9, ease: "power3.inOut" }, 0.1)
            .fromTo(".feature__circle circle", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0.2)
            .from(".feature__team--home", { xPercent: -24, rotateY: 38, autoAlpha: 0, duration: 1, ease: "expo.out" }, 0.35)
            .from(".feature__team--away", { xPercent: 24, rotateY: -38, autoAlpha: 0, duration: 1, ease: "expo.out" }, 0.35)
            .fromTo(".feature__impact", { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "power4.out" }, 0.72)
            .to(".feature__impact", { autoAlpha: 0.35, duration: 0.9 }, 1.2)
            .from(".feature__vs-text", { scale: 1.8, autoAlpha: 0, duration: 0.5, ease: "back.out(2.2)" }, 0.72)
            .from(".feature__kicker, .feature__meta > div, .countdown, .feature__cta, .feature__note", { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.07 }, 0.85);
        }
        const list = root.current!.querySelector(".fixture-list");
        if (list) {
          gsap
            .timeline({ scrollTrigger: { trigger: list, start: "top 85%", once: true } })
            .from(".fixture-list__title", { y: 12, autoAlpha: 0, duration: 0.6 }, 0)
            .from(".fixture-row__rule", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.9, stagger: 0.1, ease: "power3.inOut" }, 0.1)
            .from(".fixture-row > :not(.fixture-row__rule)", { y: 12, autoAlpha: 0, duration: 0.6, stagger: 0.03 }, 0.25);
        }
      });
      mm.add(MEDIA.reduced, () => {
        root.current?.querySelector(".feature")?.classList.add("is-revealed");
      });
    },
    { scope: root, dependencies: [state.status], revertOnUpdate: true },
  );

  return (
    <section id="fixtures" ref={root} className="fixtures" aria-labelledby="fixtures-title">
      <header className="fixtures__head">
        <h2 id="fixtures-title" className="section-title">Fixtures</h2>
        <p className="fixtures__tz">All kick-off times are Malaysia time (GMT+8).</p>
      </header>

      {state.status === "loading" && (
        <div className="fixtures__loading" role="status">
          <span className="sr-only">Loading fixtures</span>
          <span className="skeleton skeleton--feature" />
          <span className="skeleton skeleton--row" />
        </div>
      )}

      {state.status === "error" && (
        <div className="fixtures__message" role="alert">
          <p>Fixtures can&apos;t be loaded right now. Check that the Laravel server is running, then try again.</p>
          <button type="button" className="btn btn--ghost" onClick={retry}>Try again</button>
        </div>
      )}

      {state.status === "ready" && fixtures.length === 0 && (
        <div className="fixtures__message">
          <p>No fixtures have been announced yet.</p>
        </div>
      )}

      {featured && <FeaturedMatch fixture={featured} now={now} />}

      {others.length > 0 && (
        <div className="fixture-list">
          <h3 className="fixture-list__title">All fixtures</h3>
          <ol>
            {others.map((f) => (
              <FixtureRow key={f.id} fixture={f} now={now} />
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
