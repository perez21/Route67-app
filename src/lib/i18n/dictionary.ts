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
    "home.hero.externalNote":
      "L'admissibilité Entrée Express et la page d'équivalence des diplômes ouvrent sur des sites externes indépendants de Route 67.",

    // Page d'accueil — tirages
    "home.tirages.title": "Derniers tirages Entrée express",
    "home.tirages.empty": "Aucun tirage enregistré pour le moment.",
    "home.tirages.col.tirage": "Tirage",
    "home.tirages.col.categorie": "Catégorie",
    "home.tirages.col.score": "Score min.",
    "home.tirages.col.invitations": "Invitations",
    "home.tirages.col.date": "Date",

    // Page d'accueil — bande procédure
    "home.procedureTeaser.eyebrow": "Guide complet",
    "home.procedureTeaser.title": "Procédure Entrée express",
    "home.procedureTeaser.link": "Voir la ligne du temps complète →",
    "home.procedureTeaser.step1.title": "Le test de langue officiel",
    "home.procedureTeaser.step1.eyebrow": "Étape 1",
    "home.procedureTeaser.step1.description":
      "IELTS (International English Language Testing System), CELPIP (Canadian English Language Proficiency Index Program), TEF Canada (Test d'évaluation de français) et TCF Canada (Test de connaissance du français) : lequel choisir, comment convertir ton score en niveau CLB/NCLC (Canadian Language Benchmarks / Niveaux de compétence linguistique canadiens), et l'astuce du bonus bilingue.",
    "home.procedureTeaser.step2.title": "L'équivalence des diplômes (EDE / ECA)",
    "home.procedureTeaser.step2.eyebrow": "Étape 2",
    "home.procedureTeaser.step2.description":
      "EDE : évaluation des diplômes d'études (ECA en anglais, Educational Credential Assessment). Organismes désignés — WES (World Education Services), ICAS (International Credential Assessment Service), IQAS (International Qualifications Assessment Service), ICES (International Credential Evaluation Service), CES (Comparative Education Service) —, documents à fournir, délais et validité de 5 ans.",
    "home.procedureTeaser.step3.title": "Créer son compte et son profil Entrée express",
    "home.procedureTeaser.step3.eyebrow": "Étape 3",
    "home.procedureTeaser.step3.description":
      "GCKey (identifiant unique du gouvernement du Canada pour accéder aux services en ligne), documents à préparer, codes CNP/TEER (Classification nationale des professions / Training, Education, Experience and Responsibilities), et ce qu'il se passe une fois le profil soumis.",

    // Page d'accueil — comment ça marche
    "home.howItWorks.title": "Comment fonctionne l'Entrée express",
    "home.howItWorks.subtitle": "Le système à points en quatre grandes phases, expliqué sans jargon administratif.",
    "home.howItWorks.step1.title": "Profil en ligne",
    "home.howItWorks.step1.text": "Test de langue, équivalence de diplôme, puis création du profil sur le système d'IRCC pour obtenir un score CRS.",
    "home.howItWorks.step2.title": "Entrée dans le bassin",
    "home.howItWorks.step2.text": "Ton profil rejoint le bassin des candidats, en attente d'une invitation à un tirage.",
    "home.howItWorks.step3.title": "Invitation à présenter une demande (ITA)",
    "home.howItWorks.step3.text": "Si ton score dépasse le seuil du tirage, tu reçois une invitation à déposer une demande complète.",
    "home.howItWorks.step4.title": "Dépôt et vérifications",
    "home.howItWorks.step4.text": "60 jours pour soumettre le dossier, puis biométrie, examen médical, certificat de police et vérifications de sécurité.",
    "home.howItWorks.link": "Voir toutes les étapes jusqu'au visa →",

    // Page d'accueil — contact teaser
    "home.contactTeaser.title": "Une question ? Écris-nous directement.",
    "home.contactTeaser.description": "Que tu sois déjà inscrit ou juste en train de te renseigner, l'équipe Route 67 répond personnellement à chaque message. Consulte aussi notre",
    "home.contactTeaser.faqLink": "FAQ",
    "home.contactTeaser.cta": "Contacter l'équipe",

    // Page d'accueil — soutenir le projet
    "home.support.title": "Soutenir le projet",
    "home.support.description":
      "Route 67 reste gratuit et utile à tous. Le site vit grâce aux dons de celles et ceux qui veulent nous aider à continuer : ils couvrent l'hébergement, la maintenance pour rester à jour en temps réel, et un peu de quoi faire vivre l'équipe qui s'en occupe.",
    "home.support.donBadge": "Don anonyme",
    "home.support.donTitle": "Comment contribuer",
    "home.support.donOrange": "Orange Money",
    "home.support.donMtn": "MTN MoMo",
    "home.support.donAccountName": "Nom Mobile Money",
    "home.support.donPaypal": "PayPal",
    "home.support.donDisclaimer":
      "Un don n'est pas un paiement pour un service individualisé. C'est un soutien volontaire et anonyme au projet. Si vous trouvez notre action utile et souhaitez nous encourager, vous pouvez faire un don d'un montant de votre choix via les contacts ci-dessus.",
    "home.support.premiumBadge": "Avantages Premium",
    "home.support.premiumTitle": "Ce que je reçois en devenant utilisateur prémium",
    "home.support.premiumItem1": "Rencontre virtuelle avec l'équipe",
    "home.support.premiumItem2": "Chat direct avec l'équipe",
    "home.support.premiumItem3": "Assistant IA disponible 24h/24",
    "home.support.premiumItem4": "Valable 1 mois",
    "home.support.premiumCta": "Devenir Premium",

    // Pied de page
    "footer.tagline": "Route 67 — plateforme d'information et d'entraide indépendante sur l'Entrée express canadienne.",
    "footer.disclaimer":
      "Route 67 n'est pas un cabinet ni un agent d'immigration agréé et ne fournit pas de conseils juridiques individualisés — notre seul projet est de rendre l'information officielle plus accessible. Les informations publiées sont vulgarisées à partir des sources officielles d'IRCC à titre informatif. Pour un accompagnement personnalisé et réglementé, contacte un consultant agréé (CRCIC : Collège des consultants en immigration et en citoyenneté) ou un avocat membre d'un barreau.",
    "footer.contact": "Nous contacter",
    "footer.procedure": "Procédure complète",
    "footer.rights": "Tous droits réservés.",

    // Disclaimer partagé
    "disclaimer.label": "À savoir — ",
    "disclaimer.default":
      "Route 67 n'est pas un cabinet ni un agent d'immigration agréé. Notre projet vise uniquement à rendre l'information officielle plus accessible — pour un avis qui engage ton dossier, contacte un consultant réglementé (CRCIC : Collège des consultants en immigration et en citoyenneté) ou le site officiel canada.ca.",
    "disclaimer.compact": "Rappel : Route 67 informe, mais n'est pas un agent d'immigration agréé.",
    "disclaimer.procedure":
      "Ce guide est une vulgarisation à but informatif, rédigée pour rendre la procédure plus claire. Route 67 n'est pas un cabinet d'immigration agréé : vérifie toujours l'information à jour sur canada.ca avant toute démarche officielle.",

    // Authentification — connexion
    "auth.login.tagline":
      "La plateforme qui traduit l'Entrée express canadienne en informations claires — avec un suivi personnalisé pour savoir exactement où tu en es.",
    "auth.login.2faTitle": "Vérification en deux étapes",
    "auth.login.2faSubtitle": "Ce compte est protégé par une double authentification. Ouvre ton application d'authentification et saisis le code à 6 chiffres.",
    "auth.login.2faVerifying": "Vérification…",
    "auth.login.2faSubmit": "Valider",
    "auth.emailPlaceholder": "Adresse email",
    "auth.passwordPlaceholder": "Mot de passe",
    "auth.login.submitting": "Connexion…",
    "auth.login.submit": "Se connecter",
    "auth.login.forgotPassword": "Mot de passe oublié ?",
    "auth.or": "ou",
    "auth.login.createAccount": "Créer mon compte",
    "auth.login.secureNote": "Connexion sécurisée — tes identifiants sont chiffrés.",
    "auth.genericError": "Une erreur est survenue. Réessaie.",

    // Authentification — inscription
    "auth.register.tagline": "Crée ton suivi personnalisé : checklist de la procédure, simulateur de score CRS, et alertes sur les tirages qui te concernent.",
    "auth.register.title": "Créer mon compte",
    "auth.register.alreadyAccount": "Déjà un compte ?",
    "auth.register.login": "Se connecter",
    "auth.register.nameLabel": "Pseudo",
    "auth.register.namePlaceholder": "Comment veux-tu qu'on t'appelle ?",
    "auth.register.emailLabel": "Email",
    "auth.register.passwordLabel": "Mot de passe",
    "auth.register.passwordPlaceholder": "Au moins 10 caractères",
    "auth.register.passwordHint": "Au moins 10 caractères, avec une majuscule et un chiffre.",
    "auth.register.confirmPasswordLabel": "Confirmer le mot de passe",
    "auth.register.confirmPasswordPlaceholder": "Retape ton mot de passe",
    "auth.register.passwordMismatch": "Les mots de passe ne correspondent pas.",
    "auth.register.disclaimerPre": "Je reconnais que Route 67",
    "auth.register.disclaimerBold": "n'est pas un cabinet ni un consultant en immigration agréé",
    "auth.register.disclaimerPost": ", et que je crée ce compte uniquement pour m'informer sur l'Entrée express — pas pour recevoir un avis juridique individualisé.",
    "auth.register.submitting": "Création en cours…",
    "auth.register.privacyNote": "Tes données personnelles sont chiffrées et ne sont jamais partagées avec des tiers.",
    "auth.register.errorDisclaimer": "Merci de cocher la case pour confirmer que tu as compris ce point avant de continuer.",
    "auth.register.errorMismatch": "Les deux mots de passe ne correspondent pas.",

    // Simulateur CRS
    "sim.eyebrow": "Grille officielle SCG / CRS",
    "sim.title": "Simulateur de score CRS complet",
    "sim.intro": "Calqué sur la grille officielle du Système de classement global d'IRCC (capital humain, facteurs du conjoint, transférabilité des compétences, points supplémentaires) — la même grille que reproduit l'outil Canadavisa.",
    "sim.spouseInclude": "Inclure un époux ou conjoint(e) de fait qui t'accompagne",
    "sim.spouseHint": "Coche seulement si ton époux/conjoint t'accompagne au Canada et n'est pas déjà citoyen/résident permanent canadien.",
    "sim.age": "Âge",
    "sim.educationLabel": "Niveau d'études le plus élevé",
    "sim.firstLangIsFrench": "Ma première langue officielle déclarée est le français",
    "sim.firstLangLabel": "Première langue officielle",
    "sim.french": "français — NCLC",
    "sim.english": "anglais — CLB",
    "sim.secondLangTested": "J'ai aussi passé un test dans ma deuxième langue officielle",
    "sim.secondLangLabel": "Deuxième langue officielle",
    "sim.canadianWorkExp": "Expérience de travail au Canada",
    "sim.sectionA": "A : Capital humain (toi)",
    "sim.sectionB": "B — Facteurs du conjoint",
    "sim.spouseEducation": "Études du conjoint",
    "sim.spouseLangLabel": "Langue officielle du conjoint",
    "sim.spouseWorkExp": "Expérience de travail au Canada du conjoint",
    "sim.sectionC": "C — Transférabilité des compétences",
    "sim.foreignWorkExp": "Expérience de travail à l'étranger",
    "sim.hasCertificate": "J'ai un certificat de compétence (métier spécialisé)",
    "sim.sectionD": "D — Points supplémentaires",
    "sim.hasSibling": "Frère ou sœur (18 ans+) citoyen/résident permanent au Canada",
    "sim.canadianStudy": "Études postsecondaires effectuées au Canada",
    "sim.canadianStudyNone": "Aucune",
    "sim.canadianStudy1_2": "Diplôme d'un ou deux ans",
    "sim.canadianStudy3Plus": "Diplôme de trois ans ou plus",
    "sim.hasPCP": "J'ai une désignation de candidat provincial (PCP)",
    "sim.submitting": "Calcul en cours…",
    "sim.submit": "Calculer mon score CRS",
    "sim.estimatedScore": "Score estimé",
    "sim.notEligibleTitle": "⚠ Admissibilité non confirmée",
    "sim.notEligibleNote": "Signal indicatif basé sur des critères plancher courants — pas une évaluation légale complète. Vérifie ton admissibilité exacte sur ton compte Entrée express officiel.",
    "sim.breakdownA": "A — Capital humain",
    "sim.breakdownB": "B — Conjoint",
    "sim.breakdownC": "C — Transférabilité",
    "sim.breakdownD": "D — Points suppl.",
    "sim.scoreSaved": "Score enregistré sur ton tableau de bord.",
    "sim.footnote": "Outil informatif calqué sur la grille officielle IRCC — ne remplace pas le calcul fait sur ton compte Entrée express officiel.",

    // Contact
    "contact.eyebrow": "Une question ?",
    "contact.title": "Contacter l'équipe Route 67",
    "contact.intro": "Une question sur ton dossier, un bug sur le site, une suggestion ? Écris-nous directement — un membre de l'équipe te répond personnellement. Regarde aussi notre",
    "contact.faqLink": "FAQ",
    "contact.loggedInPre": "Tu es connecté : ce message rejoindra ton",
    "contact.loggedInChatLink": "chat avec l'équipe",
    "contact.loggedInPost": ", accessible à tout moment depuis ton tableau de bord.",

    // FAQ
    "faq.eyebrow": "Questions fréquentes",
    "faq.intro": "Les questions qui reviennent le plus souvent sur l'Entrée express et sur Route 67.",
    "faq.notFound": "Tu ne trouves pas ta réponse ?",
    "faq.contactCta": "Contacter l'équipe",
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
    "home.hero.externalNote":
      "Express Entry eligibility and the credential equivalence page open external sites independent from Route 67.",

    // Page d'accueil — tirages
    "home.tirages.title": "Latest Express Entry draws",
    "home.tirages.empty": "No draw recorded yet.",
    "home.tirages.col.tirage": "Draw",
    "home.tirages.col.categorie": "Category",
    "home.tirages.col.score": "Min. score",
    "home.tirages.col.invitations": "Invitations",
    "home.tirages.col.date": "Date",

    // Page d'accueil — bande procédure
    "home.procedureTeaser.eyebrow": "Full guide",
    "home.procedureTeaser.title": "Express Entry process",
    "home.procedureTeaser.link": "See the full timeline →",
    "home.procedureTeaser.step1.title": "The official language test",
    "home.procedureTeaser.step1.eyebrow": "Step 1",
    "home.procedureTeaser.step1.description":
      "IELTS (International English Language Testing System), CELPIP (Canadian English Language Proficiency Index Program), TEF Canada and TCF Canada (French tests): which one to choose, how to convert your score to a CLB/NCLC level (Canadian Language Benchmarks), and the bilingual bonus trick.",
    "home.procedureTeaser.step2.title": "Credential equivalence (ECA)",
    "home.procedureTeaser.step2.eyebrow": "Step 2",
    "home.procedureTeaser.step2.description":
      "ECA: Educational Credential Assessment. Designated organizations — WES, ICAS, IQAS, ICES, CES —, required documents, timelines, and 5-year validity.",
    "home.procedureTeaser.step3.title": "Creating your Express Entry account and profile",
    "home.procedureTeaser.step3.eyebrow": "Step 3",
    "home.procedureTeaser.step3.description":
      "GCKey (unique Government of Canada ID for online services), documents to prepare, NOC/TEER codes (National Occupational Classification), and what happens once the profile is submitted.",

    // Page d'accueil — comment ça marche
    "home.howItWorks.title": "How Express Entry works",
    "home.howItWorks.subtitle": "The points-based system in four main phases, explained without administrative jargon.",
    "home.howItWorks.step1.title": "Online profile",
    "home.howItWorks.step1.text": "Language test, credential equivalence, then creating your profile on IRCC's system to get a CRS score.",
    "home.howItWorks.step2.title": "Entering the pool",
    "home.howItWorks.step2.text": "Your profile joins the pool of candidates, waiting for an invitation from a draw.",
    "home.howItWorks.step3.title": "Invitation to Apply (ITA)",
    "home.howItWorks.step3.text": "If your score exceeds the draw's threshold, you receive an invitation to submit a full application.",
    "home.howItWorks.step4.title": "Submission and checks",
    "home.howItWorks.step4.text": "60 days to submit the file, then biometrics, medical exam, police certificate, and security checks.",
    "home.howItWorks.link": "See all the steps to the visa →",

    // Page d'accueil — contact teaser
    "home.contactTeaser.title": "A question? Write to us directly.",
    "home.contactTeaser.description": "Whether you're already registered or just researching, the Route 67 team replies personally to every message. Also check our",
    "home.contactTeaser.faqLink": "FAQ",
    "home.contactTeaser.cta": "Contact the team",

    // Page d'accueil — soutenir le projet
    "home.support.title": "Support the project",
    "home.support.description":
      "Route 67 stays free and useful to everyone. The site runs on donations from those who want to help us keep going: they cover hosting, upkeep to stay up to date in real time, and a bit to support the team behind it.",
    "home.support.donBadge": "Anonymous donation",
    "home.support.donTitle": "How to contribute",
    "home.support.donOrange": "Orange Money",
    "home.support.donMtn": "MTN MoMo",
    "home.support.donAccountName": "Mobile Money name",
    "home.support.donPaypal": "PayPal",
    "home.support.donDisclaimer":
      "A donation is not payment for an individualized service — it's voluntary, anonymous support for the project. If you find our work useful and want to support us, you can make a donation of any amount via the contacts above.",
    "home.support.premiumBadge": "Premium benefits",
    "home.support.premiumTitle": "What I get by becoming a premium user",
    "home.support.premiumItem1": "Virtual meeting with the team",
    "home.support.premiumItem2": "Direct chat with the team",
    "home.support.premiumItem3": "AI assistant available 24/7",
    "home.support.premiumItem4": "Valid for 1 month after donation confirmation",
    "home.support.premiumCta": "Become Premium",

    // Pied de page
    "footer.tagline": "Route 67 — independent information and peer-support platform on Canadian Express Entry.",
    "footer.disclaimer":
      "Route 67 is not a licensed immigration firm or consultant and does not provide individualized legal advice — our only aim is to make official information more accessible. Published information is a simplified summary of official IRCC sources for informational purposes. For personalized, regulated support, contact a licensed consultant (CICC: College of Immigration and Citizenship Consultants) or a lawyer member of a bar association.",
    "footer.contact": "Contact us",
    "footer.procedure": "Full process",
    "footer.rights": "All rights reserved.",

    // Disclaimer partagé
    "disclaimer.label": "Good to know — ",
    "disclaimer.default":
      "Route 67 is not a licensed immigration firm or consultant. Our project only aims to make official information more accessible — for advice that affects your file, contact a regulated consultant (CICC: College of Immigration and Citizenship Consultants) or the official canada.ca website.",
    "disclaimer.compact": "Reminder: Route 67 informs, but is not a licensed immigration consultant.",
    "disclaimer.procedure":
      "This guide is a simplified, informational summary written to make the process clearer. Route 67 is not a licensed immigration firm: always check the up-to-date information on canada.ca before any official step.",

    // Authentification — connexion
    "auth.login.tagline":
      "The platform that translates Canadian Express Entry into clear information — with personalized tracking so you know exactly where you stand.",
    "auth.login.2faTitle": "Two-step verification",
    "auth.login.2faSubtitle": "This account is protected by two-factor authentication. Open your authenticator app and enter the 6-digit code.",
    "auth.login.2faVerifying": "Verifying…",
    "auth.login.2faSubmit": "Confirm",
    "auth.emailPlaceholder": "Email address",
    "auth.passwordPlaceholder": "Password",
    "auth.login.submitting": "Signing in…",
    "auth.login.submit": "Sign in",
    "auth.login.forgotPassword": "Forgot your password?",
    "auth.or": "or",
    "auth.login.createAccount": "Create my account",
    "auth.login.secureNote": "Secure sign-in — your credentials are encrypted.",
    "auth.genericError": "Something went wrong. Please try again.",

    // Authentification — inscription
    "auth.register.tagline": "Create your personalized tracking: process checklist, CRS score calculator, and alerts on draws that concern you.",
    "auth.register.title": "Create my account",
    "auth.register.alreadyAccount": "Already have an account?",
    "auth.register.login": "Sign in",
    "auth.register.nameLabel": "Nickname",
    "auth.register.namePlaceholder": "What should we call you?",
    "auth.register.emailLabel": "Email",
    "auth.register.passwordLabel": "Password",
    "auth.register.passwordPlaceholder": "At least 10 characters",
    "auth.register.passwordHint": "At least 10 characters, with an uppercase letter and a number.",
    "auth.register.confirmPasswordLabel": "Confirm password",
    "auth.register.confirmPasswordPlaceholder": "Retype your password",
    "auth.register.passwordMismatch": "Passwords don't match.",
    "auth.register.disclaimerPre": "I acknowledge that Route 67",
    "auth.register.disclaimerBold": "is not a licensed immigration firm or consultant",
    "auth.register.disclaimerPost": ", and that I'm creating this account only to learn about Express Entry — not to receive individualized legal advice.",
    "auth.register.submitting": "Creating account…",
    "auth.register.privacyNote": "Your personal data is encrypted and never shared with third parties.",
    "auth.register.errorDisclaimer": "Please check the box to confirm you understood this point before continuing.",
    "auth.register.errorMismatch": "The two passwords don't match.",

    // Simulateur CRS
    "sim.eyebrow": "Official CRS grid",
    "sim.title": "Full CRS score calculator",
    "sim.intro": "Modeled on IRCC's official Comprehensive Ranking System grid (human capital, spouse factors, skill transferability, additional points) — the same grid reproduced by the Canadavisa tool.",
    "sim.spouseInclude": "Include a spouse or common-law partner accompanying you",
    "sim.spouseHint": "Only check this if your spouse/partner is accompanying you to Canada and is not already a Canadian citizen/permanent resident.",
    "sim.age": "Age",
    "sim.educationLabel": "Highest level of education",
    "sim.firstLangIsFrench": "My declared first official language is French",
    "sim.firstLangLabel": "First official language",
    "sim.french": "French — NCLC",
    "sim.english": "English — CLB",
    "sim.secondLangTested": "I also took a test in my second official language",
    "sim.secondLangLabel": "Second official language",
    "sim.canadianWorkExp": "Canadian work experience",
    "sim.sectionA": "A: Human capital (you)",
    "sim.sectionB": "B — Spouse factors",
    "sim.spouseEducation": "Spouse's education",
    "sim.spouseLangLabel": "Spouse's official language",
    "sim.spouseWorkExp": "Spouse's Canadian work experience",
    "sim.sectionC": "C — Skill transferability",
    "sim.foreignWorkExp": "Foreign work experience",
    "sim.hasCertificate": "I have a certificate of qualification (skilled trade)",
    "sim.sectionD": "D — Additional points",
    "sim.hasSibling": "Sibling (18+) who is a citizen/permanent resident of Canada",
    "sim.canadianStudy": "Post-secondary studies completed in Canada",
    "sim.canadianStudyNone": "None",
    "sim.canadianStudy1_2": "One or two-year diploma",
    "sim.canadianStudy3Plus": "Three-year or longer diploma",
    "sim.hasPCP": "I have a Provincial Nomination (PNP)",
    "sim.submitting": "Calculating…",
    "sim.submit": "Calculate my CRS score",
    "sim.estimatedScore": "Estimated score",
    "sim.notEligibleTitle": "⚠ Eligibility not confirmed",
    "sim.notEligibleNote": "Indicative signal based on common baseline criteria — not a full legal assessment. Check your exact eligibility on your official Express Entry account.",
    "sim.breakdownA": "A — Human capital",
    "sim.breakdownB": "B — Spouse",
    "sim.breakdownC": "C — Transferability",
    "sim.breakdownD": "D — Add'l points",
    "sim.scoreSaved": "Score saved to your dashboard.",
    "sim.footnote": "Informational tool modeled on the official IRCC grid — does not replace the calculation on your official Express Entry account.",

    // Contact
    "contact.eyebrow": "A question?",
    "contact.title": "Contact the Route 67 team",
    "contact.intro": "A question about your file, a bug on the site, a suggestion? Write to us directly — a team member replies to you personally. Also check our",
    "contact.faqLink": "FAQ",
    "contact.loggedInPre": "You're signed in: this message will join your",
    "contact.loggedInChatLink": "chat with the team",
    "contact.loggedInPost": ", accessible any time from your dashboard.",

    // FAQ
    "faq.eyebrow": "Frequently asked questions",
    "faq.intro": "The most common questions about Express Entry and about Route 67.",
    "faq.notFound": "Can't find your answer?",
    "faq.contactCta": "Contact the team",
  },
};
