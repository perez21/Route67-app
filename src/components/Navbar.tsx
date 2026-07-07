"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";
import AccountLink from "./AccountLink";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  const NAV_LINKS = [
    { href: "/", label: t("nav.accueil") },
    { href: "/qui-sommes-nous", label: t("nav.apropos") },
    { href: "/#actualites", label: t("nav.actualites") },
    { href: "/#tirages", label: t("nav.tirages") },
    { href: "/procedure", label: t("nav.procedure") },
    { href: "/simulateur", label: t("nav.simulateur") },
    { href: "/contact", label: t("nav.contact") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/#tarifs", label: t("nav.soutenir") },
  ];

  // Un lien est actif s'il correspond exactement à la page courante.
  // Les ancres (/#section) ne sont considérées actives que sur la page
  // d'accueil elle-même, sans quoi elles resteraient allumées partout.
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="sticky top-0 z-30">
      <nav className="flex items-center justify-between bg-ink px-4 py-4 text-parchment sm:px-6 md:px-10">
        <Link href="/" className="font-display text-xl font-bold sm:text-2xl" onClick={() => setOpen(false)}>
          <span className="text-cmr-green">Route</span>{" "}
          <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
        </Link>

        <ul className="hidden gap-6 text-sm lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`border-b-2 pb-1 transition-colors ${
                  isActive(link.href)
                    ? "border-gold text-gold"
                    : "border-transparent text-parchment/85 hover:text-parchment"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <NotificationBell />
          <AccountLink />
          <Link
            href="/register"
            className="hidden rounded-sm bg-gold px-3.5 py-2 text-xs font-semibold text-ink sm:px-5 sm:text-sm lg:inline-block"
          >
            {t("nav.creerCompte")}
          </Link>

          {/* Bouton hamburger — seul moyen d'accéder au menu en dessous du
              breakpoint lg, où la liste de liens ci-dessus est masquée. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            aria-label={open ? t("nav.fermerMenu") : t("nav.ouvrirMenu")}
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
                <Link
                  href={link.href}
                  className={`block border-l-2 py-3 pl-3 ${
                    isActive(link.href)
                      ? "border-gold bg-parchment/5 font-semibold text-gold"
                      : "border-transparent text-parchment"
                  }`}
                  onClick={() => setOpen(false)}
                >
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
                {t("nav.creerCompte")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
