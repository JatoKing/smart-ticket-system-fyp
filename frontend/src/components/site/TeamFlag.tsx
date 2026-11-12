// National team flags (country-flag-icons, MIT). Explicit imports keep the bundle small —
// add a country here when a new opponent appears. Unknown names fall back to initials.

import {
  AE, AF, AU, BD, BH, BN, CN, HK, ID, IN, IQ, IR, JO, JP, KG, KH, KP, KR, KW, KZ, LA, LB, LK, MM, MN, MV, MY, NP,
  NZ, OM, PH, PK, PS, QA, SA, SG, SY, TH, TJ, TL, TM, TW, UZ, VN, YE,
} from "country-flag-icons/react/3x2";

type Flag = typeof MY;

const FLAGS: Record<string, Flag> = {
  malaysia: MY, indonesia: ID, singapore: SG, thailand: TH, vietnam: VN, "viet nam": VN, philippines: PH,
  myanmar: MM, cambodia: KH, laos: LA, brunei: BN, "brunei darussalam": BN, "timor leste": TL, "timor-leste": TL,
  "korea republic": KR, "korea republik": KR, "south korea": KR, korea: KR, "korea dpr": KP, "north korea": KP,
  japan: JP, china: CN, "china pr": CN, "hong kong": HK, "chinese taipei": TW, taiwan: TW, mongolia: MN,
  qatar: QA, iran: IR, "ir iran": IR, iraq: IQ, jordan: JO, oman: OM, bahrain: BH, kuwait: KW, syria: SY,
  lebanon: LB, palestine: PS, "saudi arabia": SA, "united arab emirates": AE, uae: AE, yemen: YE,
  india: IN, nepal: NP, bangladesh: BD, "sri lanka": LK, maldives: MV, pakistan: PK, afghanistan: AF,
  kyrgyzstan: KG, "kyrgyz republic": KG, tajikistan: TJ, turkmenistan: TM, uzbekistan: UZ, kazakhstan: KZ,
  australia: AU, "new zealand": NZ,
};

const normalise = (name: string) => name.toLowerCase().replace(/[^a-z\s-]/g, "").replace(/\s+/g, " ").trim();

export default function TeamFlag({ team, className = "" }: { team: string; className?: string }) {
  const Flag = FLAGS[normalise(team)];
  if (Flag) return <Flag className={`flag ${className}`.trim()} aria-hidden="true" focusable="false" />;
  const initials = team
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return (
    <span className={`flag flag--initials ${className}`.trim()} aria-hidden="true">
      {initials}
    </span>
  );
}
