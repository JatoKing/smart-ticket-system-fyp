"use client";

// AuthPage — persistent across /login and /register (rendered from the (auth) layout), so the
// route change drives the Login ↔ Register transformation instead of remounting the page.
// Back/forward buttons work for free because the mode is derived from the pathname.

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { AFTER_AUTH_URL } from "@/lib/auth-config";
import { runSwitch } from "@/lib/auth-transitions";
import { isMobileLayout, prefersReducedMotion, type Mode } from "@/lib/motion";
import type { FootballHandle } from "./AnimatedFootball";
import AuthBackground from "./AuthBackground";
import AuthContainer, { type SlotState } from "./AuthContainer";
import FootballHero from "./FootballHero";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import TransitionOverlay, { type TransitionOverlayHandle } from "./TransitionOverlay";
import { useParallax } from "./useParallax";

type Phase = { from: Mode; to: Mode } | null;

const ANNOUNCE: Record<Mode, string> = { login: "Log in form", register: "Create account form" };

export default function AuthPage() {
  const pathname = usePathname();
  const routeMode: Mode = pathname?.startsWith("/register") ? "register" : "login";

  const [shown, setShown] = useState<Mode>(routeMode);
  const [phase, setPhase] = useState<Phase>(null);
  const [announcement, setAnnouncement] = useState("");
  const reduced = useReducedMotion() ?? false;

  const rootRef = useRef<HTMLElement>(null);
  const footballRef = useRef<FootballHandle>(null);
  const overlayRef = useRef<TransitionOverlayHandle>(null);
  const shownRef = useRef<Mode>(routeMode);
  const routeRef = useRef<Mode>(routeMode);
  const busy = useRef(false);

  useParallax(rootRef, reduced);

  const announce = useCallback((message: string) => {
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(message));
  }, []);

  const syncToRoute = useCallback(async () => {
    const root = rootRef.current;
    if (!root || busy.current) return;
    busy.current = true;

    // Loop so a route change made mid-animation (fast clicks, back button) is honoured after.
    while (routeRef.current !== shownRef.current) {
      const from = shownRef.current;
      const to = routeRef.current;
      const commit = () => {
        flushSync(() => {
          setShown(to);
          setPhase(null);
        });
        shownRef.current = to;
      };

      try {
        const kind = prefersReducedMotion() ? "reduced" : isMobileLayout() ? "mobile" : "desktop";
        await runSwitch(kind, {
          root,
          from,
          to,
          football: footballRef.current,
          begin: () => flushSync(() => setPhase({ from, to })),
          commit,
        });
      } catch {
        if (shownRef.current !== to) commit(); // never leave the UI half-way
      }

      announce(ANNOUNCE[to]);
      root.querySelector<HTMLInputElement>(`[data-slot="${to}"] .field__input`)?.focus({ preventScroll: true });
    }

    busy.current = false;
  }, [announce]);

  useEffect(() => {
    routeRef.current = routeMode;
    // Start outside React's commit phase: the transition uses flushSync, which React refuses
    // to run inside an effect. A microtask still runs before the next paint.
    queueMicrotask(() => void syncToRoute());
  }, [routeMode, syncToRoute]);

  const onSuccess = useCallback(async () => {
    announce("Signed in. Taking you to your dashboard.");
    const go = () => window.location.assign(AFTER_AUTH_URL);
    const safety = window.setTimeout(go, 1600); // the animation never blocks navigation
    try {
      await overlayRef.current?.play(footballRef.current?.element() ?? null);
    } finally {
      window.clearTimeout(safety);
      go();
    }
  }, [announce]);

  // Restore a clean page if the browser brings it back from the back/forward cache.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => e.persisted && window.location.reload();
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const slot = (m: Mode): SlotState => ({
    active: shown === m,
    entering: phase?.to === m,
    inert: phase ? phase.to !== m : shown !== m,
  });

  const getFootball = useCallback(() => footballRef.current, []);
  const formDeps = { getFootball, announce, onSuccess };

  return (
    <main className="auth" ref={rootRef} data-mode={shown} data-target={phase?.to ?? shown}>
      <AuthBackground />
      <AuthContainer
        forms={
          <>
            <LoginForm slot={slot("login")} {...formDeps} />
            <RegisterForm slot={slot("register")} {...formDeps} />
          </>
        }
        hero={<FootballHero enteringMode={phase?.to ?? null} footballRef={footballRef} reduced={reduced} />}
      />
      <TransitionOverlay ref={overlayRef} />
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </main>
  );
}
