import type { CSSProperties } from "react";

const depth = (d: number) => ({ "--depth": d }) as CSSProperties;

/** Floodlights, faint pitch markings, tactical runs and grain. Purely decorative. */
export default function AuthBackground() {
  return (
    <div className="auth-bg" aria-hidden="true">
      <div className="auth-bg__glow auth-bg__glow--l depth" style={depth(0.35)} />
      <div className="auth-bg__glow auth-bg__glow--r depth" style={depth(0.2)} />
      <div className="auth-bg__beam auth-bg__beam--l depth" style={depth(0.6)} />
      <div className="auth-bg__beam auth-bg__beam--r depth" style={depth(0.6)} />

      <div className="auth-bg__field">
        <svg className="auth-bg__pitch" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <marker id="nft-tac-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1 1 L8 5 L1 9" fill="none" stroke="rgba(245,184,24,.35)" strokeWidth="1.4" />
            </marker>
          </defs>
          <g className="pl">
            <rect x="80" y="90" width="1280" height="720" rx="2" />
            <line x1="720" y1="90" x2="720" y2="810" />
            <circle cx="720" cy="450" r="104" />
            <circle cx="720" cy="450" r="3" className="spot" />
            <rect x="80" y="250" width="200" height="400" />
            <rect x="80" y="365" width="70" height="170" />
            <path d="M280 365 A104 104 0 0 1 280 535" />
            <rect x="1160" y="250" width="200" height="400" />
            <rect x="1290" y="365" width="70" height="170" />
            <path d="M1160 365 A104 104 0 0 0 1160 535" />
            <path d="M80 106 A16 16 0 0 0 96 90" />
            <path d="M1344 90 A16 16 0 0 0 1360 106" />
            <path d="M96 810 A16 16 0 0 0 80 794" />
            <path d="M1360 794 A16 16 0 0 0 1344 810" />
          </g>
          <g className="tac">
            <path d="M330 640 C 430 560, 520 600, 600 520" markerEnd="url(#nft-tac-arrow)" />
            <path d="M980 300 C 1060 360, 1100 460, 1060 560" markerEnd="url(#nft-tac-arrow)" />
            <path d="M560 250 C 640 210, 760 220, 840 280" markerEnd="url(#nft-tac-arrow)" />
          </g>
          <g className="dots">
            <circle cx="330" cy="640" r="6" />
            <circle cx="980" cy="300" r="6" />
            <circle cx="560" cy="250" r="6" />
            <circle cx="420" cy="380" r="6" />
            <circle cx="1040" cy="660" r="6" />
            <circle cx="860" cy="560" r="6" />
          </g>
        </svg>
      </div>

      <div className="auth-bg__grain" />
      <div className="auth-bg__vignette" />
    </div>
  );
}
