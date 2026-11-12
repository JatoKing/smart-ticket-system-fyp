import type { CSSProperties } from "react";

// Curved flight paths around the ball. The gold line draws in on load and re-draws on transitions.
export default function FootballTrajectory() {
  return (
    <svg className="trajectory depth" style={{ "--depth": 0.45 } as CSSProperties} viewBox="0 0 600 440" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="nft-traj-gold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#f5b818" stopOpacity="0" />
          <stop offset=".4" stopColor="#f5b818" stopOpacity=".95" />
          <stop offset="1" stopColor="#ffd45e" stopOpacity=".1" />
        </linearGradient>
        <linearGradient id="nft-traj-soft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".35" />
        </linearGradient>
      </defs>
      <ellipse className="traj-orbit" cx="300" cy="226" rx="282" ry="70" transform="rotate(-13 300 226)" />
      <path className="traj-line traj-line--soft" pathLength={1} d="M0 338 C 80 312, 160 306, 226 322" />
      <path className="traj-line traj-line--soft" pathLength={1} d="M420 392 C 500 370, 556 318, 592 250" />
      <path className="traj-line traj-line--gold" pathLength={1} d="M18 414 C 140 404, 252 334, 330 252 S 520 72, 592 30" />
    </svg>
  );
}
