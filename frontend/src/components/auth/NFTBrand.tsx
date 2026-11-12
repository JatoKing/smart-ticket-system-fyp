import Image from "next/image";
import type { CSSProperties } from "react";

/** The supplied NFT logo asset — shown at its native square ratio, never redrawn or stretched. */
export default function NFTBrand() {
  return (
    <div className="hero-top">
      <Image
        className="hero-logo depth"
        style={{ "--depth": 0.3 } as CSSProperties}
        src="/brand/nft-logo.png"
        width={500}
        height={500}
        sizes="104px"
        loading="eager"
        alt="NFT — National Football Ticket, Malaysia's Football Team"
      />
      <p className="hero-tag">
        <span>National Football Ticket</span>
        <span>Malaysia</span>
      </p>
    </div>
  );
}
