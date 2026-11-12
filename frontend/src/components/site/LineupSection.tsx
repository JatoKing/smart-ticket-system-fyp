"use client";

// LineupSection — the current starting XI on a vertical pitch (attacking upward).
// Data comes from the Squad & Lineup admin page in Laravel; nothing is invented here.

import { useRef } from "react";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { photoUrl, placePlayers, positionCode, useLineup, type LineupPlayer } from "@/lib/lineup";

/** Substitutes (or the whole squad before a lineup is named), in API order: GK → FW. */
function Bench({ title, players }: { title: string; players: LineupPlayer[] }) {
  return (
    <div className="bench">
      <h3 className="bench__title">
        {title} <span className="bench__count">{players.length}</span>
      </h3>
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            <span className="bench__code" data-line={p.position}>{positionCode(p)}</span>
            <span className="bench__name">
              {p.number !== null && <span className="bench__number">{p.number}</span>}
              {p.name}
              {p.captain && <span className="bench__captain" title="Captain">C</span>}
            </span>
            <span className="bench__club">{p.club ?? p.role ?? p.positionLabel}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const updatedFmt = new Intl.DateTimeFormat("en-MY", { timeZone: "Asia/Kuala_Lumpur", day: "numeric", month: "short", year: "numeric" });

/** FIFA pitch markings in a 68 × 105 viewBox (×10), own goal at the bottom. */
function PitchLines() {
  const line = { pathLength: 1, className: "pitch__line" } as const;
  return (
    <svg className="pitch__svg" viewBox="0 0 680 1050" preserveAspectRatio="none" aria-hidden="true">
      <rect x="10" y="10" width="660" height="1030" rx="2" {...line} />
      <path d="M10 525 H670" {...line} />
      <circle cx="340" cy="525" r="91.5" {...line} />
      <circle cx="340" cy="525" r="3" className="pitch__spot" />
      {[10, 1040].map((y, i) => {
        const dir = i === 0 ? 1 : -1;
        return (
          <g key={y}>
            <path d={`M138.5 ${y} V${y + dir * 165} H541.5 V${y}`} {...line} />
            <path d={`M248.5 ${y} V${y + dir * 55} H431.5 V${y}`} {...line} />
            <path d={`M267 ${y + dir * 165} A91.5 91.5 0 0 ${i === 0 ? 0 : 1} 413 ${y + dir * 165}`} {...line} />
            <circle cx="340" cy={y + dir * 110} r="3" className="pitch__spot" />
          </g>
        );
      })}
    </svg>
  );
}

function PlayerNode({ player, x, y }: { player: LineupPlayer; x: number; y: number }) {
  const photo = photoUrl(player);
  const tipId = `player-tip-${player.id}`;
  return (
    <li
      className="node"
      style={{ left: `${x}%`, top: `${y}%` }}
      data-line={player.position}
      data-edge={x < 25 ? "start" : x > 75 ? "end" : undefined}
    >
      <button type="button" className="node__button" aria-describedby={tipId}>
        <span className="node__glow" aria-hidden="true" />
        <span className="node__badge">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- served by Laravel, size is small
            <img src={photo} alt="" className="node__photo" loading="lazy" />
          ) : (
            <span className={`node__number${positionCode(player).length > 2 ? " node__number--long" : ""}`}>
              {positionCode(player)}
            </span>
          )}
          {player.number !== null && <span className="node__chip">{player.number}</span>}
          {player.captain && (
            <span className="node__captain" title="Captain">
              C
            </span>
          )}
        </span>
        <span className="node__name">{player.name}</span>
      </button>
      <span className="node__tip" role="tooltip" id={tipId}>
        {player.role ?? player.positionLabel}
        {player.club ? `, ${player.club}` : ""}
        {player.captain ? " (captain)" : ""}
      </span>
    </li>
  );
}

export default function LineupSection() {
  const root = useRef<HTMLElement>(null);
  const { state, retry } = useLineup();
  const lineup = state.status === "ready" ? state.lineup : null;
  const placed = lineup ? placePlayers(lineup.starters) : [];
  const captain = lineup?.starters.find((p) => p.captain) ?? lineup?.substitutes.find((p) => p.captain);
  const announced = placed.length > 0;

  useGSAP(
    () => {
      if (state.status !== "ready" || !root.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ scrollTrigger: { trigger: q(".pitch")[0], start: "top 75%", once: true } });
        tl.from(q(".lineup__head > *"), { yPercent: 40, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" }, 0)
          .fromTo(q(".pitch__line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.04, ease: "power2.inOut" }, 0.1)
          .from(q(".pitch__spot"), { scale: 0, transformOrigin: "50% 50%", duration: 0.4, stagger: 0.05 }, 0.9);

        // players run out from the centre circle into their positions, line by line
        const nodes = q(".node") as HTMLElement[];
        nodes.forEach((node) => {
          const { left, top } = node.style;
          const line = node.dataset.line ?? "GK";
          const at = 0.9 + ["GK", "DF", "MF", "FW"].indexOf(line) * 0.16 + Math.random() * 0.06;
          tl.from(node, { left: "50%", top: "50%", scale: 0.4, autoAlpha: 0, duration: 0.9, ease: "power3.out", clearProps: "scale" }, at);
          tl.set(node, { left, top }, at + 0.9);
        });

        // only animate what this lineup actually has (captain / bench are optional)
        const digits = q(".lineup__formation-value > span");
        if (digits.length) tl.from(digits, { yPercent: 100, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "expo.out" }, 0.6);
        const details = q(".bench__title, .bench li, .lineup__meta > *");
        if (details.length) tl.from(details, { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.04 }, 1.1);

      });
      mm.add(MEDIA.reduced, () => {});
    },
    { scope: root, dependencies: [state.status], revertOnUpdate: true },
  );

  return (
    <section id="lineup" ref={root} className="lineup" aria-labelledby="lineup-title">
      <div className="lineup__inner">
        <div className="lineup__info">
          <header className="lineup__head">
            <h2 id="lineup-title" className="section-title">Current lineup</h2>
            <p className="lineup__intro">The starting XI for Malaysia&apos;s next match, as named by the coaching staff.</p>
          </header>

          {state.status === "error" && (
            <div className="fixtures__message" role="alert">
              <p>The lineup can&apos;t be loaded right now. Check that the Laravel server is running, then try again.</p>
              <button type="button" className="btn btn--ghost" onClick={retry}>Try again</button>
            </div>
          )}

          {lineup && (
            <>
              <div className="lineup__formation">
                <span className="lineup__formation-label">Formation</span>
                <span className="lineup__formation-value" aria-label={lineup.formation ?? "To be confirmed"}>
                  {(lineup.formation ?? "TBC").split("").map((c, i) => (
                    <span key={i} aria-hidden="true">{c}</span>
                  ))}
                </span>
              </div>
              {lineup.substitutes.length > 0 && (
                <Bench title={announced ? "Substitutes" : "Squad"} players={lineup.substitutes} />
              )}
              <dl className="lineup__meta">
                {captain && (
                  <div>
                    <dt>Captain</dt>
                    <dd>{captain.name}</dd>
                  </div>
                )}
                {lineup.updatedAt && (
                  <div>
                    <dt>Updated</dt>
                    <dd>
                      <time dateTime={lineup.updatedAt}>{updatedFmt.format(new Date(lineup.updatedAt))}</time>
                    </dd>
                  </div>
                )}
              </dl>

            </>
          )}
        </div>

        <div className={`pitch${announced ? "" : " pitch--empty"}`} aria-label={announced ? "Starting eleven on the pitch" : undefined}>
          <PitchLines />
          {state.status === "loading" && <span className="skeleton pitch__skeleton" role="status" aria-label="Loading lineup" />}
          {announced ? (
            <ol className="pitch__players">
              {placed.map(({ player, x, y }) => (
                <PlayerNode key={player.id} player={player} x={x} y={y} />
              ))}
            </ol>
          ) : (
            lineup && <p className="pitch__empty">The starting lineup hasn&apos;t been announced yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
