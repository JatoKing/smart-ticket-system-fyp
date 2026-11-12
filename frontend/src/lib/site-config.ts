import { LARAVEL_PUBLIC_URL } from "./auth-config";

// Navigation keeps the existing landing-page structure (layouts/cust.blade.php).
// Real Laravel routes are used where they exist; the remaining entries still point at the
// static template pages that the current site links to (public/NationalFootballTicket/*.html).

const page = (file: string) => `${LARAVEL_PUBLIC_URL}/NationalFootballTicket/${file}`;

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  bookTickets: `${LARAVEL_PUBLIC_URL}/customer/bookticket`,
  orderHistory: `${LARAVEL_PUBLIC_URL}/order-history`,
  fixturesAnchor: "#fixtures",
  lineupAnchor: "#lineup",
  venueAnchor: "#venue",
  seatMapAnchor: "#seat-map",
  directions: "https://www.google.com/maps/search/?api=1&query=Bukit+Jalil+National+Stadium",
};

export type NavLink = { label: string; href: string };
export type NavItem = NavLink | { label: string; children: NavLink[] };

export const NAV: NavItem[] = [
  { label: "Home", href: ROUTES.home },
  {
    label: "Club List",
    children: [
      { label: "Badda FC", href: page("badda.html") },
      { label: "Banani FC", href: page("banani.html") },
      { label: "Trishal FC", href: page("trisali.html") },
      { label: "Dhoar FC", href: page("dhoar.html") },
      { label: "Mirpur FC", href: page("mirpur.html") },
      { label: "Joypur FC", href: page("Joypur.html") },
    ],
  },
  {
    label: "Pages",
    children: [
      { label: "About", href: page("about.html") },
      { label: "World Cup", href: page("world-cup.html") },
      { label: "Team", href: page("team.html") },
      { label: "Gallery", href: page("gallery.html") },
      { label: "Shop", href: page("shop.html") },
      { label: "Cart", href: page("cart.html") },
    ],
  },
  { label: "Point Table", href: page("point-table.html") },
  {
    label: "Result",
    children: [
      { label: "Results", href: page("result.html") },
      { label: "Result details", href: page("result-single.html") },
    ],
  },
  { label: "Fixtures & Tickets", href: ROUTES.bookTickets },
  {
    label: "News",
    children: [
      { label: "News", href: page("blog.html") },
      { label: "News, left sidebar", href: page("blog-left.html") },
      { label: "News, right sidebar", href: page("blog-right.html") },
      { label: "News details", href: page("blog-single.html") },
    ],
  },
  { label: "Contact", href: page("contact.html") },
];
