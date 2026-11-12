import type { ReactNode } from "react";

export type SlotState = { active: boolean; entering: boolean; inert: boolean };

/**
 * The card that holds both forms, the diagonal football panel and its gold edge.
 * Layering (bottom → top): forms · gold glow/edge · hero panel (clip-path) · sweep band.
 */
export default function AuthContainer({ forms, hero }: { forms: ReactNode; hero: ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-forms">
        {forms}
        {/* Mobile-only diagonal wipe used when switching forms on small screens */}
        <div className="mobile-wipe" aria-hidden="true">
          <span className="mobile-wipe__gold" />
          <span className="mobile-wipe__ink" />
        </div>
      </div>

      <div className="hero-stripe-glow" aria-hidden="true" />
      <div className="hero-stripe" aria-hidden="true" />
      {hero}
      {/* Broadcast-style sweep band that crosses the card during Login ↔ Register */}
      <div className="hero-sweep" aria-hidden="true">
        <span />
        <span />
      </div>
    </div>
  );
}
