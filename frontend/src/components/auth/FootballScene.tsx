import type { CSSProperties, Ref } from "react";
import AnimatedFootball, { type FootballHandle } from "./AnimatedFootball";
import FootballTrajectory from "./FootballTrajectory";

// Deterministic particle layout (same on server and client → no hydration mismatch).
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  "--x": `${(i * 37 + 11) % 100}%`,
  "--y": `${(i * 53 + 17) % 100}%`,
  "--s": `${2 + (i % 3)}px`,
  "--d": `-${(i * 0.73).toFixed(2)}s`,
  "--t": `${6 + (i % 5)}s`,
  "--dx": `${(i % 2 ? 1 : -1) * (4 + (i % 7))}px`,
})) as CSSProperties[];

export default function FootballScene({ footballRef, reduced }: { footballRef: Ref<FootballHandle>; reduced: boolean }) {
  return (
    <div className="ball-scene" aria-hidden="true">
      <div className="ball-glow" />
      <FootballTrajectory />
      <div className="ball-float depth" style={{ "--depth": 1 } as CSSProperties}>
        <AnimatedFootball ref={footballRef} reduced={reduced} />
      </div>
      <div className="ball-shadow" />
      <div className="particles">
        {PARTICLES.map((style, i) => (
          <i key={i} style={style} />
        ))}
      </div>
    </div>
  );
}
