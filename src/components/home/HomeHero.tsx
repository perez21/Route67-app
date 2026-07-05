"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const OFFICIAL_CALCULATOR_URL = "https://nvimmigration.ca/67-calculator/";
const EQUIVALENCE_URL =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/documents/evaluer-diplomes-etudes.html";

// Titre + description du hero — extraits dans un composant client séparé
// car HomePage (le composant parent) reste un composant serveur (appels
// Prisma directs), et useLanguage() ne peut être utilisé que côté client.
export function HomeHeroText() {
  const { t } = useLanguage();
  return (
    <>
      <h1 className="max-w-3xl animate-fadeUp font-display text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
        {t("home.hero.title1")}{" "}
        <span className="text-gold2">{t("home.hero.title2")}</span>{" "}
        <span aria-hidden className="inline-block align-middle text-3xl sm:text-4xl md:text-6xl">🇨🇦</span>
      </h1>
      <p className="mt-4 max-w-xl animate-fadeUp text-base text-parchment/80 sm:mt-6 sm:text-lg" style={{ animationDelay: "0.1s" }}>
        {t("home.hero.description")}
      </p>
    </>
  );
}

export function HomeHeroCtas() {
  const { t } = useLanguage();
  return (
    <>
      <Link href="/simulateur" className="flex-shrink-0 rounded-sm bg-gold px-5 py-3 text-sm font-semibold text-ink sm:px-6">
        {t("home.hero.ctaCrs")}
      </Link>
      <a
        href={OFFICIAL_CALCULATOR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 rounded-sm bg-cmr-green px-5 py-3 text-sm font-semibold text-white sm:px-6"
      >
        {t("home.hero.ctaEligibilite")}
      </a>
      <a
        href={EQUIVALENCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 rounded-sm border border-parchment/30 px-5 py-3 text-sm font-semibold sm:px-6"
      >
        {t("home.hero.ctaEquivalence")}
      </a>
    </>
  );
}
