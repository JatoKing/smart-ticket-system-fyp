import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/site-config";

// Closes the landing page. Besides the links, it gives the page room after the stadium
// section, so its pinned scroll sequence always finishes and releases before the page ends.

const GROUPS = [
  {
    title: "Matchday",
    links: [
      { label: "Fixtures", href: ROUTES.fixturesAnchor },
      { label: "Lineup", href: ROUTES.lineupAnchor },
      { label: "Stadium Bukit Jalil", href: ROUTES.venueAnchor },
      { label: "Book tickets", href: ROUTES.bookTickets },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: ROUTES.login },
      { label: "Create account", href: ROUTES.register },
      { label: "Order history", href: ROUTES.orderHistory },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link href={ROUTES.home} aria-label="NFT — National Football Ticket, home">
            <Image src="/brand/nft-logo.png" width={500} height={500} sizes="56px" alt="" />
          </Link>
          <p>Tickets for Harimau Malaya home matches at Stadium Bukit Jalil.</p>
        </div>
        {GROUPS.map((g) => (
          <nav className="footer__group" key={g.title} aria-label={g.title}>
            <h2>{g.title}</h2>
            <ul>
              {g.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="footer__legal">NFT — National Football Ticket</p>
    </footer>
  );
}
