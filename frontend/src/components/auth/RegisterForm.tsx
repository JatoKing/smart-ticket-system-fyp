"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { register, type RegisterInput } from "@/lib/auth-api";
import { validateFields } from "@/lib/validation";
import AuthButton from "./AuthButton";
import AuthIcon from "./AuthIcon";
import AuthInput from "./AuthInput";
import { useAuthForm, type AuthFormDeps } from "./useAuthForm";
import type { SlotState } from "./AuthContainer";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// phone_number and address are required by Laravel's RegisterController::create().
const EMPTY: RegisterInput = { name: "", email: "", password: "", password_confirmation: "", phone_number: "", address: "" };

export default function RegisterForm({ slot, ...deps }: { slot: SlotState } & AuthFormDeps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const { values, setField, errors, alert, loading, onSubmit } = useAuthForm<RegisterInput>(EMPTY, {
    ...deps,
    containerRef: innerRef,
    validate: (v) => validateFields(v, { minPassword: 8, confirm: true }),
    send: (v) => register(v),
  });

  const field = (name: keyof RegisterInput) => ({
    name,
    value: values[name],
    onValueChange: (v: string) => setField(name, v),
    error: errors[name],
    required: true,
  });

  return (
    <section
      className={`form-slot slot-register${slot.active ? " is-active" : ""}${slot.entering ? " is-entering" : ""}`}
      data-slot="register"
      aria-labelledby="register-title"
      inert={slot.inert}
    >
      <div className="form-inner" ref={innerRef}>
        <header className="form-head" data-stagger data-intro style={d(350)}>
          <p className="eyebrow">Sign up</p>
          <h1 className="form-title" id="register-title">Create account</h1>
          <p className="form-sub">It only takes a minute to get matchday-ready.</p>
        </header>

        <form onSubmit={onSubmit} noValidate aria-busy={loading}>
          {alert && (
            <p className="form-alert" role="alert">
              {alert}
            </p>
          )}

          <AuthInput id="register-name" label="Full name" icon="user" autoComplete="name" introDelay={430} {...field("name")} />
          <AuthInput id="register-email" type="email" label="Email address" icon="mail" autoComplete="email" introDelay={490} {...field("email")} />
          <div className="field-grid">
            <AuthInput id="register-password" type="password" label="Password" icon="lock" autoComplete="new-password" minLength={8} introDelay={550} {...field("password")} />
            <AuthInput id="register-password-confirm" type="password" label="Confirm password" icon="lock" autoComplete="new-password" introDelay={610} {...field("password_confirmation")} />
          </div>
          <div className="field-grid">
            <AuthInput id="register-phone" type="tel" label="Phone number" icon="phone" autoComplete="tel" inputMode="tel" introDelay={670} {...field("phone_number")} />
            <AuthInput id="register-address" label="Address" icon="pin" autoComplete="street-address" introDelay={730} {...field("address")} />
          </div>

          <AuthButton loading={loading} introDelay={790}>Create Account</AuthButton>
        </form>

        <p className="switch-line" data-stagger data-intro style={d(850)}>
          Already have an account?
          <Link href="/login" scroll={false} className="switch-link">
            Log In <AuthIcon name="arrow" />
          </Link>
        </p>
      </div>
    </section>
  );
}
