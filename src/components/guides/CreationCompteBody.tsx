"use client";

import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import { useLanguage } from "@/contexts/LanguageContext";
import { GuideSections, type BilingualGuide } from "@/components/guides/GuideShared";

const CONTENT: BilingualGuide = {
  fr: {
    backLink: "← Retour à la procédure complète",
    stepLabel: "Étape 3 · Guide détaillé",
    title: "Créer son compte et son profil Entrée express",
    nextStepIntro: "Une fois ton profil soumis, suis ton avancement :",
    nextStepHref: "/simulateur",
    nextStepLinkText: "Vérifier ton score sur le simulateur Route 67 →",
    sections: [
      {
        heading: "Créer ton compte sécurisé",
        blocks: [
          {
            type: "p",
            text: "L'accès au portail officiel d'IRCC nécessite un compte sécurisé. Deux options équivalentes existent : un **GCKey** (identifiant créé directement sur le portail du gouvernement du Canada) ou un **partenaire de connexion** (via les identifiants de certaines institutions bancaires canadiennes, si tu en as déjà). Pour la grande majorité des candidats hors du Canada, le GCKey est l'option la plus simple : choisis un mot de passe robuste et conserve précieusement tes questions de sécurité, la récupération d'accès peut être longue en cas de perte.",
          },
        ],
      },
      {
        heading: "Ce qu'il faut avoir sous la main avant de commencer",
        blocks: [
          { type: "p", text: "Le formulaire ne peut pas être sauvegardé indéfiniment sans être complété correctement : prépare tout à l'avance pour éviter les erreurs de saisie dans la précipitation." },
          {
            type: "ul",
            items: [
              "Passeport valide (numéro, dates de délivrance et d'expiration)",
              "Résultats de test de langue avec numéro de référence (voir le guide dédié)",
              "Rapport d'évaluation des diplômes (EDE) avec numéro de référence, si applicable",
              "Historique complet des emplois des 10 dernières années : employeur, adresse, dates précises, fonctions, et surtout le **code CNP/TEER** (Classification nationale des professions) correspondant à chaque poste",
              "Détails de tout séjour ou étude antérieure au Canada",
              "Détails sur ton époux/conjoint de fait si il/elle t'accompagne (études, langue, expérience)",
              "Coordonnées d'un frère ou d'une sœur résident permanent/citoyen canadien, le cas échéant",
            ],
          },
        ],
      },
      {
        heading: "Remplir le profil sans erreur",
        blocks: [
          {
            type: "ul",
            items: [
              "Le profil te demande d'abord de vérifier ton admissibilité à l'un des trois programmes fédéraux (Travailleurs qualifiés, Expérience canadienne, Métiers spécialisés) ou de confirmer une nomination provinciale.",
              "Sois rigoureux sur les **codes CNP/TEER** : un code mal choisi peut fausser ton admissibilité et ton score. Le simulateur Route 67 ne remplace pas cette vérification : utilise l'outil officiel de recherche de la Classification nationale des professions.",
              "Toute information inexacte ou incohérente avec tes documents peut entraîner un rejet ou, pire, un refus pour fausses déclarations. Remplis avec la plus grande exactitude, sans exagérer ni omettre d'expérience.",
              "Une fois soumis, ton profil génère automatiquement ton score CRS selon la grille officielle, le même calcul que reproduit le simulateur Route 67.",
            ],
          },
        ],
      },
      {
        heading: "Sécuriser ton compte GCKey",
        blocks: [
          {
            type: "ul",
            items: [
              "Utilise un mot de passe unique, non réutilisé ailleurs, et note tes questions de sécurité dans un endroit fiable. La récupération d'un GCKey perdu peut prendre plusieurs semaines par courrier postal si tu perds l'accès à ton email de récupération.",
              "Renseigne une adresse email que tu consultes régulièrement : IRCC communique par ce canal les mises à jour de statut, demandes de documents et convocations biométriques, avec des délais de réponse parfois courts.",
              "Ne partage jamais tes identifiants, même avec un consultant ou un tiers qui propose de \"gérer ton dossier à ta place\". Toutes les actions doivent rester sous ton contrôle direct.",
            ],
          },
        ],
      },
      {
        heading: "Après la soumission",
        blocks: [
          {
            type: "p",
            text: "Ton profil rejoint le **bassin** de candidats Entrée express pour une durée de 12 mois, renouvelable si tu n'as pas encore reçu d'invitation. IRCC organise des tirages réguliers (généraux ou par catégorie) : si ton score dépasse le seuil du tirage, tu reçois une **invitation à présenter une demande (ITA)** et disposes alors de 60 jours pour déposer ton dossier complet de résidence permanente.",
          },
          {
            type: "p",
            text: "Pendant que ton profil est actif dans le bassin, surveille les tirages publiés (voir la page d'accueil de Route 67) pour situer ton score par rapport aux seuils récents, et tiens ta checklist de suivi à jour pour savoir précisément quels documents seront prêts le jour où une invitation arrive.",
          },
        ],
      },
      {
        heading: "Erreurs fréquentes à éviter",
        blocks: [
          {
            type: "ul",
            items: [
              "Laisser expirer un résultat de test de langue ou une EDE pendant que le profil est actif dans le bassin.",
              "Oublier de mettre à jour le profil après un changement de situation (nouvel emploi, nouveau diplôme, mariage). Cela peut changer ton score CRS et donc tes chances d'invitation.",
              "Ne pas vérifier la cohérence entre le profil Entrée express et les documents qui seront demandés après l'ITA : toute divergence peut retarder ou compromettre la demande.",
            ],
          },
        ],
      },
    ],
  },
  en: {
    backLink: "← Back to the full process",
    stepLabel: "Step 3 · Detailed guide",
    title: "Creating your account and Express Entry profile",
    nextStepIntro: "Once your profile is submitted, track your progress:",
    nextStepHref: "/simulateur",
    nextStepLinkText: "Check your score on the Route 67 simulator →",
    sections: [
      {
        heading: "Creating your secure account",
        blocks: [
          {
            type: "p",
            text: "Accessing the official IRCC portal requires a secure account. Two equivalent options exist: a **GCKey** (an ID created directly on the Government of Canada portal) or a **Sign-In Partner** (using the login of certain Canadian banking institutions, if you already have one). For most candidates outside Canada, GCKey is the simplest option: choose a strong password and keep your security questions somewhere safe, recovering access can take a long time if lost.",
          },
        ],
      },
      {
        heading: "What to have on hand before you start",
        blocks: [
          { type: "p", text: "The form can't be saved indefinitely without being properly completed: prepare everything in advance to avoid mistakes made in a rush." },
          {
            type: "ul",
            items: [
              "Valid passport (number, issue and expiry dates)",
              "Language test results with reference number (see the dedicated guide)",
              "Educational Credential Assessment (ECA) report with reference number, if applicable",
              "Complete 10-year work history: employer, address, exact dates, duties, and especially the **NOC/TEER code** (National Occupational Classification) matching each position",
              "Details of any prior stay or study in Canada",
              "Details about your spouse/common-law partner if they're accompanying you (education, language, experience)",
              "Contact details of a permanent resident/Canadian citizen sibling, if applicable",
            ],
          },
        ],
      },
      {
        heading: "Filling out the profile without mistakes",
        blocks: [
          {
            type: "ul",
            items: [
              "The profile first asks you to confirm your eligibility for one of the three federal programs (Federal Skilled Worker, Canadian Experience Class, Federal Skilled Trades) or to confirm a provincial nomination.",
              "Be rigorous with **NOC/TEER codes**: an incorrect code can distort your eligibility and score. The Route 67 simulator doesn't replace this check: use the official National Occupational Classification search tool.",
              "Any information that's inaccurate or inconsistent with your documents can lead to rejection or, worse, a refusal for misrepresentation. Fill it out with the greatest accuracy, without exaggerating or omitting experience.",
              "Once submitted, your profile automatically generates your CRS score based on the official grid, the same calculation the Route 67 simulator reproduces.",
            ],
          },
        ],
      },
      {
        heading: "Securing your GCKey account",
        blocks: [
          {
            type: "ul",
            items: [
              "Use a unique password, not reused elsewhere, and write down your security questions somewhere reliable. Recovering a lost GCKey can take several weeks by mail if you lose access to your recovery email.",
              "Provide an email address you check regularly: IRCC communicates status updates, document requests, and biometrics appointments through this channel, sometimes with short response deadlines.",
              "Never share your credentials, even with a consultant or third party who offers to \"manage your file for you\". All actions must stay under your direct control.",
            ],
          },
        ],
      },
      {
        heading: "After submission",
        blocks: [
          {
            type: "p",
            text: "Your profile joins the Express Entry candidate **pool** for 12 months, renewable if you haven't yet received an invitation. IRCC holds regular draws (general or category-based): if your score is above the draw's threshold, you receive an **Invitation to Apply (ITA)** and then have 60 days to submit your complete permanent residence application.",
          },
          {
            type: "p",
            text: "While your profile is active in the pool, keep an eye on published draws (see the Route 67 homepage) to see where your score stands against recent thresholds, and keep your tracking checklist up to date so you know exactly which documents will be ready the day an invitation arrives.",
          },
        ],
      },
      {
        heading: "Common mistakes to avoid",
        blocks: [
          {
            type: "ul",
            items: [
              "Letting a language test result or ECA expire while the profile is active in the pool.",
              "Forgetting to update the profile after a change in circumstances (new job, new diploma, marriage). This can change your CRS score and therefore your chances of an invitation.",
              "Not checking consistency between the Express Entry profile and the documents that will be requested after the ITA: any discrepancy can delay or jeopardize the application.",
            ],
          },
        ],
      },
    ],
  },
};

export default function CreationCompteBody() {
  const { locale } = useLanguage();
  const content = CONTENT[locale];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/procedure" className="mb-6 inline-block text-sm text-rust underline">{content.backLink}</Link>
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">{content.stepLabel}</p>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">{content.title}</h1>
      <Disclaimer variant="procedure" className="mb-8" />

      <div className="space-y-8 text-sm leading-relaxed text-charcoal/80 sm:text-[15px]">
        <GuideSections sections={content.sections} />
      </div>

      <div className="mt-10 rounded-sm border border-charcoal/10 bg-white p-6 text-sm">
        <p className="mb-3 text-charcoal/70">{content.nextStepIntro}</p>
        <Link href={content.nextStepHref} className="font-semibold text-rust underline">{content.nextStepLinkText}</Link>
      </div>
    </article>
  );
}
