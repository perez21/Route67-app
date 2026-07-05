"use client";

import { useLanguage } from "@/contexts/LanguageContext";

// Bascule simple FR/EN — volontairement un seul bouton plutôt qu'un menu
// déroulant, puisqu'il n'y a que deux langues. Affiche la langue vers
// laquelle on va basculer (pas celle active), comme "EN" quand le site est
// en français.
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();
  const next = locale === "fr" ? "en" : "fr";

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
      className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-sm border border-parchment/25 px-2 text-xs font-semibold uppercase text-parchment transition-colors hover:border-parchment/50 ${className}`}
    >
      {next}
    </button>
  );
}
