import type { CSSProperties, ReactNode } from "react";
import AuthIcon from "./AuthIcon";

/** Primary submit: light sweep + glow on hover, press-in on click, football loader while busy. */
export default function AuthButton({
  children,
  loading,
  introDelay,
}: {
  children: ReactNode;
  loading: boolean;
  introDelay?: number;
}) {
  return (
    <button
      type="submit"
      className={`btn-kick${loading ? " is-loading" : ""}`}
      aria-disabled={loading || undefined}
      data-stagger
      data-intro
      style={{ "--d": `${introDelay ?? 0}ms` } as CSSProperties}
    >
      <span className="btn-kick__sweep" aria-hidden="true" />
      <span className="btn-kick__label">{children}</span>
      <span className="btn-kick__arrow" aria-hidden="true">
        <AuthIcon name="arrow" />
      </span>
      <span className="btn-kick__loader" aria-hidden="true">
        <span className="btn-kick__bounce">
          <svg className="mini-ball" viewBox="-12 -12 24 24">
            <circle r="11" fill="#f3f3f0" />
            <path d="M0 -4.2 L4 -1.3 L2.47 3.4 L-2.47 3.4 L-4 -1.3 Z" fill="#121316" />
            <path
              d="M0 -4.2V-11M4 -1.3L10.4 -3.4M2.47 3.4L6.4 8.9M-2.47 3.4L-6.4 8.9M-4 -1.3L-10.4 -3.4"
              stroke="#121316"
              strokeWidth="1.3"
              fill="none"
            />
          </svg>
        </span>
        <span className="btn-kick__shadow" />
      </span>
    </button>
  );
}
