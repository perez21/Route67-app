"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { dictionaries, LOCALE_COOKIE, type Locale } from "@/lib/i18n/dictionary";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  // Traduit une clé du dictionnaire (ex. "nav.faq") dans la langue active.
  // Retombe sur le français puis sur la clé brute si la traduction manque,
  // pour ne jamais faire planter l'affichage pendant qu'on étend les
  // traductions page par page.
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Un an — cohérent avec une préférence d'interface durable plutôt qu'une
// donnée de session.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof document !== "undefined") {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    }
  }, []);

  const t = useCallback(
    (key: string) => dictionaries[locale]?.[key] ?? dictionaries.fr[key] ?? key,
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage() doit être utilisé à l'intérieur de <LanguageProvider>.");
  }
  return ctx;
}
