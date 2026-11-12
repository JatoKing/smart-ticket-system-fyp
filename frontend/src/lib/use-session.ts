"use client";

import { useCallback, useEffect, useState } from "react";
import { logout as logoutRequest } from "./auth-api";

export type SessionUser = { id: number; name: string; email: string; role: "admin" | "customer" | string };

/** Reads the Laravel session through GET /backend/auth/session (null = guest or backend offline). */
export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/backend/auth/session", { credentials: "include", headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .catch(() => ({ user: null }))
      .then((data: { user: SessionUser | null }) => {
        if (cancelled) return;
        setUser(data.user);
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  return { user, loaded, logout };
}
