"use client";

// Global navigation — transparent over the hero, solid + blurred + shorter once scrolled.
// Keeps the existing menu structure and dropdown destinations; account links follow the
// Laravel session (login / sign up, or order history + log out).

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { NAV, ROUTES, type NavItem } from "@/lib/site-config";
import { LARAVEL_PUBLIC_URL } from "@/lib/auth-config";
import { useSession } from "@/lib/use-session";

function Chevron() {
  return (
    <svg className="nav__chevron" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DesktopItem({ item, open, onToggle }: { item: NavItem; open: boolean; onToggle: (label: string | null) => void }) {
  const id = useId();
  if (!("children" in item)) {
    const current = item.href === ROUTES.home;
    return (
      <li className="nav__item">
        <a className="nav__link" href={item.href} aria-current={current ? "page" : undefined}>
          {item.label}
        </a>
      </li>
    );
  }
  return (
    <li className={`nav__item has-menu${open ? " is-open" : ""}`} onMouseLeave={() => open && onToggle(null)}>
      <button
        type="button"
        className="nav__link"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => onToggle(open ? null : item.label)}
      >
        {item.label}
        <Chevron />
      </button>
      <ul className="nav__menu-panel" id={id}>
        {item.children.map((child) => (
          <li key={child.href}>
            <a href={child.href}>{child.label}</a>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function Navbar() {
  const { user, loaded, logout } = useSession();
  const [solid, setSolid] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setSolid(window.scrollY > 40);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close menus on Escape or a click outside.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const account = !loaded ? null : user ? (
    <>
      <a className="nav__account-link" href={ROUTES.orderHistory}>Order history</a>
      {user.role === "admin" && (
        <a className="nav__account-link" href={`${LARAVEL_PUBLIC_URL}/home`}>Admin</a>
      )}
      <button type="button" className="nav__account-link" onClick={() => void logout()}>
        Log out
      </button>
    </>
  ) : (
    <>
      <Link className="nav__account-link" href={ROUTES.login}>Log in</Link>
      <Link className="nav__cta" href={ROUTES.register}>Sign up</Link>
    </>
  );

  return (
    <header ref={navRef} className={`nav${solid ? " is-solid" : ""}${mobileOpen ? " is-mobile-open" : ""}`}>
      <div className="nav__bar">
        <Link className="nav__brand" href={ROUTES.home} aria-label="NFT — National Football Ticket, home">
          <Image src="/brand/nft-logo.png" width={500} height={500} sizes="52px" alt="" loading="eager" />
        </Link>

        <nav className="nav__primary" aria-label="Main">
          <ul className="nav__list">
            {NAV.map((item) => (
              <DesktopItem key={item.label} item={item} open={openMenu === item.label} onToggle={setOpenMenu} />
            ))}
          </ul>
        </nav>

        <div className="nav__account">
          {user && <span className="nav__user" title={user.email}>{user.name}</span>}
          {account}
        </div>

        <button
          type="button"
          className="nav__burger"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <span className="nav__burger-lines" aria-hidden="true" />
        </button>
      </div>

      <div className="nav__mobile" id="mobile-menu" hidden={!mobileOpen}>
        <nav aria-label="Mobile">
          <ul>
            {NAV.map((item) =>
              "children" in item ? (
                <li key={item.label}>
                  <details>
                    <summary>
                      {item.label}
                      <Chevron />
                    </summary>
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a href={child.href}>{child.label}</a>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.label}>
                  <a href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</a>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="nav__mobile-account">{account}</div>
      </div>
    </header>
  );
}
