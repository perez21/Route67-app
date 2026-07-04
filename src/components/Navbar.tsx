"use client";

import { useState } from "react";
import Link from "next/link";
import NotificationBell from "./NotificationBell";
import AccountLink from "./AccountLink";

const NAV_LINKS = [
  { href: "/#actualites", label: "Actualités" },
  { href: "/procedure", label: "Procédure" },
  { href: "/#tirages", label: "Tirages" },
  { href: "/#tarifs", label: "Soutenir le projet" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30">
      <nav className="flex items-center justify-between bg-ink px-4 py-4 text-parchment sm:px-6 md:px-10">
        <Link href="/" className="font-display text-xl font-bold sm:text-2xl" onClick={() => setOpen(false)}>
          <span className="text-cmr-green">Route</span>{" "}
          <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
        </Link>

        <ul className="hidden gap-6 text-sm lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />
          <AccountLink />
          <Link
            href="/register"
            className="hidden rounded-sm bg-gold px-3.5 py-2 text-xs font-semibold text-ink sm:px-5 sm:text-sm lg:inline-block"
          >
            Créer mon suivi
          </Link>

          {/* Bouton hamburger — seul moyen d'accéder au menu en dessous du
              breakpoint lg, où la liste de liens ci-dessus est masquée. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="flex h-9 w-9 flex-shrink-0 flex-col items-center justify-center gap-[5px] rounded-sm border border-parchment/25 lg:hidden"
          >
            <span className={`h-[2px] w-5 bg-parchment transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-[2px] w-5 bg-parchment transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-[2px] w-5 bg-parchment transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Liseré tricolore Cameroun — signature visuelle discrète, pas un aplat. */}
      <div className="flex h-[3px] w-full">
        <div className="flex-1 bg-cmr-green" />
        <div className="flex-1 bg-cmr-red" />
        <div className="flex-1 bg-cmr-yellow" />
      </div>

      {/* Panneau mobile — affiche tous les liens de navigation en dessous du
          breakpoint lg, là où le menu horizontal est masqué. */}
      {open && (
        <div id="mobile-nav-menu" className="border-b border-parchment/10 bg-ink lg:hidden">
          <ul className="flex flex-col px-4 py-2 text-sm text-parchment sm:px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-t border-parchment/10 first:border-t-0">
                <Link href={link.href} className="block py-3" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-parchment/10 py-3">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="inline-block rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-ink"
              >
                Créer mon suivi
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
