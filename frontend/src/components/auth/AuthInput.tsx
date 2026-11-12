"use client";

import { useState, type CSSProperties, type InputHTMLAttributes, type Ref } from "react";
import AuthIcon, { type IconName } from "./AuthIcon";

type Props = {
  id: string;
  name: string;
  label: string;
  icon: IconName;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  type?: "text" | "email" | "password" | "tel";
  inputRef?: Ref<HTMLInputElement>;
  /** Delay for the CSS intro animation. */
  introDelay?: number;
} & Pick<InputHTMLAttributes<HTMLInputElement>, "autoComplete" | "inputMode" | "minLength" | "required">;

/** Floating-label field with icon, focus bar, inline error and optional show/hide password. */
export default function AuthInput({
  id, name, label, icon, value, onValueChange, error, type = "text", inputRef, introDelay, ...inputProps
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const errorId = `${id}-error`;

  return (
    <div
      className={`field${isPassword ? " field--password" : ""}${error ? " has-error" : ""}`}
      data-stagger
      data-intro
      style={{ "--d": `${introDelay ?? 0}ms` } as CSSProperties}
    >
      <div className="field__control">
        <span className="field__icon" aria-hidden="true">
          <AuthIcon name={icon} />
        </span>
        <input
          ref={inputRef}
          className="field__input"
          id={id}
          name={name}
          type={isPassword && revealed ? "text" : type}
          placeholder=" "
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...inputProps}
        />
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            aria-controls={id}
            aria-pressed={revealed}
            aria-label={revealed ? "Hide password" : "Show password"}
            onClick={() => setRevealed((r) => !r)}
          >
            <AuthIcon name={revealed ? "eye-off" : "eye"} />
          </button>
        )}
        <span className="field__bar" aria-hidden="true" />
      </div>
      <p className="field__error" id={errorId}>
        {error}
      </p>
    </div>
  );
}
