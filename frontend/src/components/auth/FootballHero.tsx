import type { Ref } from "react";
import type { Mode } from "@/lib/motion";
import type { FootballHandle } from "./AnimatedFootball";
import FootballScene from "./FootballScene";
import NFTBrand from "./NFTBrand";

const COPY: Record<Mode, { eyebrow: string; title: [string, string]; lead: string; meta: string }> = {
  login: {
    eyebrow: "Matchday access",
    title: ["Welcome", "Back"],
    lead: "Your matchday journey starts here.",
    meta: "Access your tickets, matches and football experiences.",
  },
  register: {
    eyebrow: "New supporter",
    title: ["Join the", "Game"],
    lead: "Create your account and be part of the experience.",
    meta: "Book seats, follow fixtures and keep every ticket in one place.",
  },
};

export default function FootballHero({
  enteringMode,
  footballRef,
  reduced,
}: {
  enteringMode: Mode | null;
  footballRef: Ref<FootballHandle>;
  reduced: boolean;
}) {
  return (
    <aside className="hero-panel" aria-label="NFT — National Football Ticket">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg__base" />
        <svg className="hero-bg__hex" preserveAspectRatio="none">
          <defs>
            <pattern id="nft-hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(.62)">
              <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#fff" strokeWidth="1.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nft-hex)" />
        </svg>
        <svg className="hero-bg__pitch" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice">
          <path d="M-140 400 L250 60 M940 400 L550 60 M250 60 L550 60" />
          <path d="M318 60 L300 112 L500 112 L482 60" />
          <path d="M-80 330 L880 330" />
          <ellipse cx="400" cy="330" rx="150" ry="34" />
          <ellipse cx="400" cy="330" rx="3" ry="1.4" />
        </svg>
        <div className="hero-bg__beam hero-bg__beam--a" />
        <div className="hero-bg__beam hero-bg__beam--b" />
        <div className="hero-bg__grain" />
      </div>

      <div className="hero-stage">
        <div className="hero-intro">
          <div className="hero-content">
            <NFTBrand />
            <FootballScene footballRef={footballRef} reduced={reduced} />
            <div className="hero-copy-wrap">
              {(Object.keys(COPY) as Mode[]).map((m) => (
                <div key={m} className={`hero-copy${enteringMode === m ? " is-entering" : ""}`} data-for={m}>
                  <p className="hero-eyebrow">{COPY[m].eyebrow}</p>
                  <h2 className="hero-title">
                    {COPY[m].title[0]} <em>{COPY[m].title[1]}</em>
                  </h2>
                  <p className="hero-lead">{COPY[m].lead}</p>
                  <p className="hero-meta">{COPY[m].meta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <svg className="hero-edge-mobile" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="100" x2="100" y2="86" />
      </svg>
    </aside>
  );
}
