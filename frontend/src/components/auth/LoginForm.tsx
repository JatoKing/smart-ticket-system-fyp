"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { login } from "@/lib/auth-api";
import { FORGOT_PASSWORD_URL } from "@/lib/auth-config";
import { validateFields } from "@/lib/validation";
import AuthButton from "./AuthButton";
import AuthIcon from "./AuthIcon";
import AuthInput from "./AuthInput";
import { useAuthForm, type AuthFormDeps } from "./useAuthForm";
import type { SlotState } from "./AuthContainer";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

type LoginValues = { email: string; password: string; remember: boolean };

export default function LoginForm({ slot, ...deps }: { slot: SlotState } & AuthFormDeps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const { values, setField, errors, alert, loading, onSubmit } = useAuthForm<LoginValues>(
    { email: "", password: "", remember: false },
    {
      ...deps,
      containerRef: innerRef,
      validate: (v) => validateFields({ email: v.email, password: v.password }),
      send: (v) => login(v),
      onFail: (v) => ({ ...v, password: "" }),
    },
  );

  return (
    <section
      className={`form-slot slot-login${slot.active ? " is-active" : ""}${slot.entering ? " is-entering" : ""}`}
      data-slot="login"
      aria-labelledby="login-title"
      inert={slot.inert}
    >
      <div className="form-inner" ref={innerRef}>
        <header className="form-head" data-stagger data-intro style={d(350)}>
          <p className="eyebrow">Sign in</p>
          <h1 className="form-title" id="login-title">Log in</h1>
          <p className="form-sub">Enter your details to access your tickets.</p>
        </header>

        <form onSubmit={onSubmit} noValidate aria-busy={loading}>
          {alert && (
            <p className="form-alert" role="alert">
              {alert}
            </p>
          )}

          <AuthInput
            id="login-email" name="email" type="email" label="Email address" icon="mail"
            autoComplete="email" required introDelay={450}
            value={values.email} onValueChange={(v) => setField("email", v)} error={errors.email}
          />
          <AuthInput
            id="login-password" name="password" type="password" label="Password" icon="lock"
            autoComplete="current-password" required introDelay={520}
            value={values.password} onValueChange={(v) => setField("password", v)} error={errors.password}
          />

          <div className="form-row" data-stagger data-intro style={d(590)}>
            <label className="check">
              <input
                type="checkbox" name="remember" id="login-remember"
                checked={values.remember} onChange={(e) => setField("remember", e.target.checked)}
              />
              <span className="check__box" aria-hidden="true">
                <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
              </span>
              <span className="check__label">Remember me</span>
            </label>
            <a className="link-underline" href={FORGOT_PASSWORD_URL}>Forgot your password?</a>
          </div>

          <AuthButton loading={loading} introDelay={680}>Log In</AuthButton>
        </form>

        <p className="switch-line" data-stagger data-intro style={d(750)}>
          Don&apos;t have an account?
          <Link href="/register" scroll={false} className="switch-link">
            Sign Up <AuthIcon name="arrow" />
          </Link>
        </p>
      </div>
    </section>
  );
}
