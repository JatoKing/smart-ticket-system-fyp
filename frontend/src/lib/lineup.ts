"use client";

// Current lineup from Laravel (GET /api/lineup via the /backend proxy).

import { useCallback, useEffect, useState } from "react";
import { LARAVEL_PUBLIC_URL } from "./auth-config";

export type Position = "GK" | "DF" | "MF" | "FW";

export type LineupPlayer = {
  id: number;
  name: string;
  number: number | null;
  position: Position;
  positionLabel: string;
  role: string | null; // e.g. "Centre-Back", "Left Winger"
  age: number | null;
  club: string | null;
  marketValue: string | null; // e.g. "€350.0K"
  photo: string | null; // site-relative path on the Laravel host
  captain: boolean;
};

export type Lineup = {
  formation: string | null;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
  updatedAt: string | null;
};

// Short position codes used on the pitch and in the substitutes list.
const ROLE_CODES: Record<string, string> = {
  Goalkeeper: "GK",
  "Left-Back": "LB",
  "Centre-Back": "CB",
  "Right-Back": "RB",
  "Defensive Midfield": "CDM",
  "Central Midfield": "CM",
  "Attacking Midfield": "CAM",
  "Left Winger": "LW",
  "Right Winger": "RW",
  "Centre-Forward": "ST",
};
/** "Centre-Forward" → "ST", "Left Winger" → "LW"; falls back to the line (GK / DF / MF / FW). */
export const positionCode = (p: LineupPlayer) => (p.role && ROLE_CODES[p.role]) || p.position;

export const photoUrl = (p: LineupPlayer) => (p.photo ? `${LARAVEL_PUBLIC_URL}${p.photo}` : null);

const LINE_Y: Record<Position, number> = { GK: 90, DF: 71, MF: 48, FW: 23 }; // % from the top (attacking upward)

/** Pitch coordinates (in %) for each starter, grouped in lines by position. */
export function placePlayers(starters: LineupPlayer[]) {
  const order: Position[] = ["GK", "DF", "MF", "FW"];
  return order.flatMap((pos) => {
    const line = starters.filter((p) => p.position === pos);
    return line.map((player, i) => ({
      player,
      line: pos,
      x: line.length === 1 ? 50 : 12 + (76 * i) / (line.length - 1),
      y: LINE_Y[pos],
    }));
  });
}

type State = { status: "loading" } | { status: "error" } | { status: "ready"; lineup: Lineup };

export function useLineup() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/backend/api/lineup", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((lineup: Lineup) => {
        if (!cancelled) setState({ status: "ready", lineup });
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
