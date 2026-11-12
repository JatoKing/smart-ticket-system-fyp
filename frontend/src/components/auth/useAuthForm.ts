"use client";

import { useState, type FormEvent, type RefObject } from "react";
import { animate } from "motion/react";
import type { AuthResult } from "@/lib/auth-api";
import { variants } from "@/lib/motion";
import type { FootballHandle } from "./AnimatedFootball";

export type AuthFormDeps = {
  getFootball: () => FootballHandle | null;
  announce: (message: string) => void;
  onSuccess: () => void;
};

type Options<V> = AuthFormDeps & {
  /** The form's .form-inner wrapper (used for the error shake and to find inputs). */
  containerRef: RefObject<HTMLElement | null>;
  validate: (values: V) => Record<string, string>;
  send: (values: V) => Promise<AuthResult>;
  /** Runs after a rejected submit, e.g. clearing the password like Laravel does. */
  onFail?: (values: V) => V;
};

/**
 * Shared submit flow for Login and Register: client checks → loading state → Laravel request →
 * inline field errors (422/429) or the success transition.
 */
export function useAuthForm<V extends Record<string, string | boolean>>(initial: V, opts: Options<V>) {
  const [values, setValues] = useState<V>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = <K extends keyof V & string>(name: K, value: V[K]) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const showErrors = (fieldErrors: Record<string, string>, fallback?: string) => {
    const container = opts.containerRef.current;
    const inputFor = (name: string) => container?.querySelector<HTMLInputElement>(`.field__input[name="${name}"]`) ?? null;
    const names = Object.keys(fieldErrors);
    const first = names.find((name) => inputFor(name));
    const unmatched = names.find((name) => !inputFor(name));

    setErrors(fieldErrors);
    if (unmatched || (!first && fallback)) setAlert((unmatched && fieldErrors[unmatched]) || fallback || "");
    if (first) inputFor(first)?.focus();
    opts.announce((first && fieldErrors[first]) || (unmatched && fieldErrors[unmatched]) || fallback || "Please check the form.");
    if (container) animate(container, variants.shake, { duration: 0.38, ease: "easeOut" });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setAlert("");

    const clientErrors = opts.validate(values);
    if (Object.keys(clientErrors).length) {
      showErrors(clientErrors);
      return;
    }

    setLoading(true);
    opts.getFootball()?.windUp();
    const result = await opts.send(values);

    if (result.ok) {
      opts.onSuccess();
      return; // keep the loading state while the success transition plays
    }

    opts.getFootball()?.rest();
    setLoading(false);
    if (opts.onFail) setValues(opts.onFail(values));
    showErrors(result.errors, result.message);
  };

  return { values, setField, errors, alert, loading, onSubmit };
}
