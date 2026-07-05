export type Locale = "fr" | "en";

export const LOCALE_COOKIE = "route67_locale";

// Dictionnaire de traduction. Structure volontairement plate et groupée par
// zone du site (nav.*, home.*, disclaimer.*...) pour rester simple à
// parcourir et à étendre : chaque nouvelle page ajoute son propre groupe de
// clés ici, puis utilise `t("groupe.cle")` dans son JSX.
//
// IMPORTANT pour l'extension future : garder le même nombre de clés dans
// `fr` et `en`, sinon `t()` retombera sur la clé brute faute de traduction.
export const dictionaries: Record<Locale, Record<string, string>> = {
  fr: {
    // Navbar
    "nav.actualites": "Actualités",
    "nav.tirages": "Tirages",
    "nav.procedure": "Procédure",
    "nav.simulateur": "Simulateur",
    "nav.contact": "Contact",
    "nav.faq": "FAQ",
    "nav.soutenir": "Soutenir le projet",
    "nav.creerCompte": "Créer mon compte",
    "nav.fermerMenu": "Fermer le menu",
    "nav.ouvrirMenu": "Ouvrir le menu",

    // Page d'accueil — hero
    "home.hero.title1": "La plateforme qui ouvre la porte",
    "home.hero.title2": "du VISA.",
    "home.hero.description":
      "Route67 est une source indépendante d'information sur l'immigration au Canada via le système Entrée Express. Nous ne sommes pas affiliés au gouvernement canadien (IRCC) et nous relayons des informations, analyses et actualités à titre informatif uniquement.",
    "home.hero.ctaCrs": "Calculer mon score CRS",
    "home.hero.ctaEligibilite": "Admissibilité Entrée Express ↗",
    "home.hero.ctaEquivalence": "Équivalence des diplômes ↗",

    // Disclaimer partagé
    "disclaimer.label": "À savoir — ",
    "disclaimer.default":
      "Route 67 n'est pas un cabinet ni un agent d'immigration agréé. Notre projet vise uniquement à rendre l'information officielle plus accessible — pour un avis qui engage ton dossier, contacte un consultant réglementé (CRCIC : Collège des consultants en immigration et en citoyenneté) ou le site officiel canada.ca.",
    "disclaimer.compact": "Rappel : Route 67 informe, mais n'est pas un agent d'immigration agréé.",
    "disclaimer.procedure":
      "Ce guide est une vulgarisation à but informatif, rédigée pour rendre la procédure plus claire. Route 67 n'est pas un cabinet d'immigration agréé : vérifie toujours l'information à jour sur canada.ca avant toute démarche officielle.",
  },
  en: {
    // Navbar
    "nav.actualites": "News",
    "nav.tirages": "Draws",
    "nav.procedure": "Process",
    "nav.simulateur": "Calculator",
    "nav.contact": "Contact",
    "nav.faq": "FAQ",
    "nav.soutenir": "Support the project",
    "nav.creerCompte": "Create my account",
    "nav.fermerMenu": "Close menu",
    "nav.ouvrirMenu": "Open menu",

    // Page d'accueil — hero
    "home.hero.title1": "The platform that opens the door",
    "home.hero.title2": "to a VISA.",
    "home.hero.description":
      "Route67 is an independent source of information on immigration to Canada through the Express Entry system. We are not affiliated with the Canadian government (IRCC) and we relay information, analysis, and news for informational purposes only.",
    "home.hero.ctaCrs": "Calculate my CRS score",
    "home.hero.ctaEligibilite": "Express Entry eligibility ↗",
    "home.hero.ctaEquivalence": "Credential equivalence ↗",

    // Disclaimer partagé
    "disclaimer.label": "Good to know — ",
    "disclaimer.default":
      "Route 67 is not a licensed immigration firm or consultant. Our project only aims to make official information more accessible — for advice that affects your file, contact a regulated consultant (CICC: College of Immigration and Citizenship Consultants) or the official canada.ca website.",
    "disclaimer.compact": "Reminder: Route 67 informs, but is not a licensed immigration consultant.",
    "disclaimer.procedure":
      "This guide is a simplified, informational summary written to make the process clearer. Route 67 is not a licensed immigration firm: always check the up-to-date information on canada.ca before any official step.",
  },
};
