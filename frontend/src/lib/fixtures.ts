"use client";

// Fixtures data from Laravel (GET /api/fixtures via the /backend proxy) + match status helpers.

import { useCallback, useEffect, useState } from "react";
import { LARAVEL_PUBLIC_URL } from "./auth-config";

export type Fixture = {
  id: number;
  home: string;
  away: string | null;
  kickoff: string | null; // ISO 8601 with offset (Malaysia time)
  date: string;
  time: string;
  venue: string;
  tickets: { listed: boolean; priceFrom: number | null; remaining: number | null; currency: string };
  bookingPath: string;
};

export type MatchStatus = "upcoming" | "live" | "completed" | "tba";

export const MATCH_TIMEZONE = "Asia/Kuala_Lumpur";
const MATCH_LENGTH_MS = 2 * 60 * 60 * 1000; // treat a match as live for ~2h after kick-off

// `now` is always passed in: reading the clock during render breaks prerendering (Next 16).
export function matchStatus(f: Fixture, now: number): MatchStatus {
  if (!f.kickoff) return "tba";
  const start = Date.parse(f.kickoff);
  if (Number.isNaN(start)) return "tba";
  if (now < start) return "upcoming";
  if (now < start + MATCH_LENGTH_MS) return "live";
  return "completed";
}

/** The nearest upcoming/live match; otherwise the most recently played one. */
export function pickFeatured(list: Fixture[], now: number) {
  const next = list.find((f) => ["upcoming", "live"].includes(matchStatus(f, now)));
  if (next) return next;
  const played = list.filter((f) => matchStatus(f, now) === "completed");
  return played[played.length - 1] ?? list[0] ?? null;
}

export const bookingUrl = (f: Fixture) => `${LARAVEL_PUBLIC_URL}${f.bookingPath}`;

const dateFmt = new Intl.DateTimeFormat("en-MY", { timeZone: MATCH_TIMEZONE, weekday: "short", day: "numeric", month: "short", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { timeZone: MATCH_TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false });
const dayFmt = new Intl.DateTimeFormat("en-MY", { timeZone: MATCH_TIMEZONE, day: "2-digit" });
const monFmt = new Intl.DateTimeFormat("en-MY", { timeZone: MATCH_TIMEZONE, month: "short" });
const yearFmt = new Intl.DateTimeFormat("en-MY", { timeZone: MATCH_TIMEZONE, year: "numeric" });
const weekdayFmt = new Intl.DateTimeFormat("en-MY", { timeZone: MATCH_TIMEZONE, weekday: "short" });

export function formatKickoff(f: Fixture) {
  if (!f.kickoff) return { date: f.date || "Date to be confirmed", time: f.time || "", day: "", month: "", year: "", weekday: "" };
  const d = new Date(f.kickoff);
  return {
    date: dateFmt.format(d),
    time: timeFmt.format(d),
    day: dayFmt.format(d),
    month: monFmt.format(d),
    year: yearFmt.format(d),
    weekday: weekdayFmt.format(d),
  };
}

export const formatPrice = (value: number, currency: string) =>
  new Intl.NumberFormat("en-MY", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

/** `now` = the clock when the data arrived (captured outside render). */
type State = { status: "loading" } | { status: "error" } | { status: "ready"; fixtures: Fixture[]; now: number };

export function useFixtures() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/backend/api/fixtures", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { fixtures: Fixture[] }) => {
        if (!cancelled) setState({ status: "ready", fixtures: data.fixtures ?? [], now: Date.now() });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((a) => a + 1);
  }, []);

  return { state, retry };
}
