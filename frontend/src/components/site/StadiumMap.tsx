"use client";

// Seat map pieces used inside the Stadium Bukit Jalil section:
//  • StadiumMapSvg — the interactive bowl (sections, gates, pitch)
//  • SeatGuide     — categories with prices, gate filter, details of the section in focus
// Data: GET /api/stadium (same gates / sections / prices as the Laravel booking page).

import { useMemo, type PointerEvent, type Ref } from "react";
import {
  CENTER, VIP_LABEL, bookingPlanUrl, gateLabelPoint, ringEllipse, sectionLabelPoint, sectionPath, sectionSpan,
  type CategoryKey, type StadiumPlan, type StadiumSection,
} from "@/lib/stadium";

const LEVELS = [1, 2, 3] as const;

export type SeatFocus = {
  active: StadiumSection | null;
  setActive: (s: StadiumSection | null) => void;
  focusCat: CategoryKey | null;
  setFocusCat: (c: CategoryKey | null) => void;
  focusGate: string | null;
  setFocusGate: (g: string | null) => void;
};

/** "103","104",…,"109" → "103–109"; keeps split sections readable. */
function rangeLabel(ids: string[]) {
  const nums = ids.map((id) => ({ id, n: parseInt(id, 10), plain: /^\d+$/.test(id) }));
  const out: string[] = [];
  let run: typeof nums = [];
  const flush = () => {
    if (!run.length) return;
    out.push(run.length > 2 ? `${run[0].id}–${run[run.length - 1].id}` : run.map((r) => r.id).join(", "));
    run = [];
  };
  [...nums].sort((a, b) => a.n - b.n || a.id.localeCompare(b.id)).forEach((x) => {
    const prev = run[run.length - 1];
    if (x.plain && prev?.plain && x.n === prev.n + 1) run.push(x);
    else {
      flush();
      run.push(x);
    }
  });
  flush();
  return out.join(", ");
}

function Pitch() {
  const x0 = CENTER.x - 150;
  const y0 = CENTER.y - 97;
  return (
    <g className="seatmap__pitch" aria-hidden="true">
      <rect x={x0} y={y0} width="300" height="194" rx="3" className="pitch-fill" />
      <g className="pitch-lines">
        <rect x={x0 + 6} y={y0 + 6} width="288" height="182" />
        <path d={`M${CENTER.x} ${y0 + 6}V${y0 + 188}`} />
        <circle cx={CENTER.x} cy={CENTER.y} r="26" />
        <path d={`M${x0 + 6} ${CENTER.y - 57}h45v114h-45 M${x0 + 294} ${CENTER.y - 57}h-45v114h45`} />
        <path d={`M${x0 + 6} ${CENTER.y - 26}h15v52h-15 M${x0 + 294} ${CENTER.y - 26}h-15v52h15`} />
      </g>
    </g>
  );
}

export function StadiumMapSvg({
  plan,
  focus,
  svgRef,
  labelledBy,
}: {
  plan: StadiumPlan;
  focus: SeatFocus;
  svgRef?: Ref<SVGSVGElement>;
  labelledBy: string;
}) {
  const shapes = useMemo(
    () =>
      plan.sections.map((s) => {
        const span = sectionSpan(s.id);
        const [lx, ly] = sectionLabelPoint(s.level, span);
        return { section: s, d: sectionPath(s.level, span), lx, ly };
      }),
    [plan],
  );

  const pick = (e: PointerEvent<SVGSVGElement>) => {
    const el = (e.target as Element).closest<SVGGElement>("[data-sec]");
    if (!el) return;
    const s = plan.sections.find((x) => x.id === el.dataset.sec);
    if (s) focus.setActive(s);
  };

  return (
    <svg
      ref={svgRef}
      className="seatmap__svg"
      viewBox="0 0 1000 780"
      role="img"
      aria-labelledby={labelledBy}
      data-focus-cat={focus.focusCat ?? undefined}
      data-focus-gate={focus.focusGate ?? undefined}
      onPointerOver={pick}
      onClick={pick}
      onPointerLeave={(e) => e.pointerType === "mouse" && focus.setActive(null)}
    >
      {LEVELS.flatMap((lvl) =>
        (["inner", "outer"] as const).map((edge) => (
          <ellipse key={`${lvl}${edge}`} className="seatmap__outline" pathLength={1} {...ringEllipse(lvl, edge)} />
        )),
      )}
      <Pitch />
      <g>
        {shapes.map(({ section: s, d, lx, ly }) => (
          <g
            key={s.id}
            className={`sec${focus.active?.id === s.id ? " is-active" : ""}`}
            data-sec={s.id}
            data-cat={s.category}
            data-gate={s.gate}
            data-level={s.level}
          >
            <path d={d} />
            <text x={lx} y={ly} className={s.id.length > 3 ? "is-split" : undefined}>
              {s.id}
            </text>
          </g>
        ))}
      </g>
      <g aria-hidden="true">
        {plan.gates.map((g) => {
          const { point } = gateLabelPoint(g, plan.sections);
          return (
            <text key={g} className={`seatmap__gate${focus.focusGate === g ? " is-focus" : ""}`} x={point[0]} y={point[1]}>
              Gate {g}
            </text>
          );
        })}
        <text className="seatmap__gate seatmap__gate--vip" x={VIP_LABEL[0]} y={VIP_LABEL[1]}>
          VIP
        </text>
      </g>
    </svg>
  );
}

export function SeatGuide({ plan, focus }: { plan: StadiumPlan; focus: SeatFocus }) {
  const categories = useMemo(() => new Map(plan.categories.map((c) => [c.key, c])), [plan]);
  const fmt = (price: number) =>
    new Intl.NumberFormat("en-MY", { style: "currency", currency: plan.currency, maximumFractionDigits: 0 }).format(price);

  const gateSummary = useMemo(() => {
    if (!focus.focusGate) return [];
    const groups = new Map<string, StadiumSection[]>();
    for (const s of plan.sections.filter((x) => x.gate === focus.focusGate)) {
      const key = `${s.category}|${s.level}`;
      groups.set(key, [...(groups.get(key) ?? []), s]);
    }
    return [...groups.entries()]
      .map(([key, list]) => {
        const [category, level] = key.split("|");
        return { category: category as CategoryKey, level: Number(level), sections: rangeLabel(list.map((s) => s.id)) };
      })
      .sort((a, b) => a.level - b.level);
  }, [plan, focus.focusGate]);

  const active = focus.active;
  const activeCat = active ? categories.get(active.category) : null;

  return (
    <div className="seatmap__panel" aria-label="Seating guide" role="region">
      <h3 className="seatmap__panel-title">Seating</h3>
      <ul className="seatmap__legend">
        {plan.categories.map((c) => (
          <li key={c.key}>
            <button
              type="button"
              data-cat={c.key}
              aria-pressed={focus.focusCat === c.key}
              onClick={() => focus.setFocusCat(focus.focusCat === c.key ? null : c.key)}
            >
              <span className="swatch" aria-hidden="true" />
              <span className="seatmap__legend-label">{c.label}</span>
              <span className="seatmap__legend-price">{fmt(c.price)}</span>
            </button>
          </li>
        ))}
      </ul>

      <h3 className="seatmap__panel-title">Gates</h3>
      <div className="seatmap__gates" role="group" aria-label="Show sections by gate">
        {plan.gates.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={focus.focusGate === g}
            onClick={() => {
              focus.setActive(null); // show the gate summary, not the last section
              focus.setFocusGate(focus.focusGate === g ? null : g);
            }}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="seatmap__info" aria-live="polite">
        {active && activeCat ? (
          <>
            <p className="seatmap__info-title">Section {active.id}</p>
            <p>
              {activeCat.label}, Gate {active.gate}, level {active.level}
            </p>
            <p className="seatmap__info-price">{fmt(activeCat.price)} per seat</p>
          </>
        ) : focus.focusGate ? (
          <>
            <p className="seatmap__info-title">Gate {focus.focusGate}</p>
            <ul className="seatmap__gate-list">
              {gateSummary.map((row) => (
                <li key={`${row.category}${row.level}`}>
                  <span>
                    {categories.get(row.category)?.label}, level {row.level}
                  </span>
                  <span className="seatmap__gate-sections">{row.sections}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="seatmap__info-hint">Point at a section, or pick a gate, to see where you&apos;ll enter and what a seat costs.</p>
        )}
      </div>

      <a className="btn btn--primary seatmap__book" href={bookingPlanUrl(plan)}>Book seats</a>
    </div>
  );
}
