"use client";

// Kick-off countdown with rolling digits. Calculated from the real kick-off time; matches that
// have started or finished show their state instead of a negative countdown.

import { useEffect, useState } from "react";
import { matchStatus, type Fixture } from "@/lib/fixtures";

function RollingDigit({ value }: { value: number }) {
  return (
    <span className="digit" aria-hidden="true">
      <span className="digit__strip" style={{ transform: `translateY(${-value * 10}%)` }}>
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  );
}

function Unit({ value, label, min = 2 }: { value: number; label: string; min?: number }) {
  const digits = String(value).padStart(min, "0").split("").map(Number);
  return (
    <span className="countdown__unit">
      <span className="countdown__digits">
        {digits.map((d, i) => (
          <RollingDigit key={digits.length - i} value={d} />
        ))}
      </span>
      <span className="countdown__label">{label}</span>
    </span>
  );
}

export default function MatchCountdown({ fixture, startedAt }: { fixture: Fixture; startedAt: number }) {
  // Start from the time the data arrived; the interval (outside render) keeps it ticking.
  const [now, setNow] = useState(startedAt);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const status = matchStatus(fixture, now);

  if (status === "completed") return <p className="countdown countdown--state">Full time. This match has been played.</p>;
  if (status === "live") return <p className="countdown countdown--state countdown--live">Live now</p>;
  if (status === "tba") return <p className="countdown countdown--state">Kick-off time to be confirmed</p>;

  const total = Math.max(0, Date.parse(fixture.kickoff!) - now);
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor(total / 3_600_000) % 24;
  const minutes = Math.floor(total / 60_000) % 60;
  const seconds = Math.floor(total / 1000) % 60;

  return (
    <div className="countdown" role="timer" aria-label={`Kick-off in ${days} days, ${hours} hours and ${minutes} minutes`}>
      <Unit value={days} label="Days" />
      <Unit value={hours} label="Hours" />
      <Unit value={minutes} label="Min" />
      <Unit value={seconds} label="Sec" />
    </div>
  );
}
