"use client";

import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import { useLanguage } from "@/contexts/LanguageContext";
import { GuideSections, type BilingualGuide } from "@/components/guides/GuideShared";

const EQUIVALENCE_URL =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/documents/evaluer-diplomes-etudes.html";
const EQUIVALENCE_URL_EN =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/education-assessed.html";

const CONTENT: BilingualGuide = {
  fr: {
    backLink: "← Retour à la procédure complète",
    stepLabel: "Étape 2 · Guide détaillé",
    title: "L'équivalence des diplômes (EDE / ECA)",
    nextStepIntro: "Prochaine étape une fois ton EDE en main :",
    nextStepHref: "/procedure/creation-compte",
    nextStepLinkText: "Créer ton profil Entrée express →",
    sections: [
      {
        heading: "Qu'est-ce qu'une EDE",
        blocks: [
          {
            type: "p",
            text: "Une **Évaluation des diplômes d'études (EDE)**, aussi appelée ECA en anglais (Educational Credential Assessment), est un rapport officiel qui confirme qu'un diplôme obtenu hors du Canada est authentique et indique à quel niveau canadien il correspond (par exemple : « équivalent à un baccalauréat canadien de trois ans »). C'est ce rapport, et non ton diplôme original, qui sert à calculer tes points CRS liés aux études, jusqu'à 150 points selon le niveau reconnu.",
          },
        ],
      },
      {
        heading: "Qui doit en obtenir une",
        blocks: [
          {
            type: "p",
            text: "Toute personne ayant étudié hors du Canada et qui souhaite faire valoir ce diplôme dans son profil Entrée express. Exception notable : pour la Catégorie de l'expérience canadienne (CEC) et le Programme des travailleurs de métiers spécialisés, l'EDE n'est pas obligatoire pour être admissible, mais elle reste recommandée pour maximiser ton score CRS, même une évaluation de ton diplôme secondaire peut rapporter des points si tu n'as pas fait d'études postsecondaires.",
          },
        ],
      },
      {
        heading: "Les organismes désignés",
        blocks: [
          { type: "p", text: "IRCC ne réalise pas lui-même les évaluations : il a désigné des organismes indépendants. Pour la grande majorité des professions, tu choisis librement parmi :" },
          {
            type: "ul",
            items: [
              "**WES** (World Education Services), le plus utilisé, souvent le plus rapide.",
              "**ICAS** (International Credential Assessment Service of Canada)",
              "**IQAS** (International Qualifications Assessment Service), propose un service express payant.",
              "**ICES** (International Credential Evaluation Service)",
              "**CES** (Comparative Education Service, Université de Toronto)",
            ],
          },
          {
            type: "p",
            text: "Trois professions réglementées ont un organisme **obligatoire** et non substituable : médecins et spécialistes en médecine clinique/chirurgie (Conseil médical du Canada), pharmaciens ayant besoin d'un permis d'exercice (Bureau des examinateurs en pharmacie du Canada), et architectes (Conseil canadien de certification en architecture).",
          },
        ],
      },
      {
        heading: "Documents à préparer",
        blocks: [
          {
            type: "ul",
            items: [
              "Copie(s) certifiée(s) de ton ou tes diplôme(s)",
              "Relevés de notes officiels de chaque établissement fréquenté",
              "Traduction certifiée si les documents ne sont pas en français ou en anglais",
              "Dans certains cas, une lettre de l'établissement confirmant l'authenticité, si l'organisme le demande",
            ],
          },
          {
            type: "p",
            text: "Chaque organisme a sa propre procédure de soumission (souvent en ligne, avec envoi postal ou électronique sécurisé des relevés directement par ton université). Vérifie les instructions précises sur le site de l'organisme choisi avant d'engager des frais.",
          },
        ],
      },
      {
        heading: "Comment choisir entre WES, ICAS, IQAS, ICES et CES",
        blocks: [
          { type: "p", text: "Les cinq organismes évaluent selon les mêmes principes reconnus par IRCC, mais diffèrent sur des points pratiques qui peuvent orienter ton choix :" },
          {
            type: "ul",
            items: [
              "**WES**, le plus utilisé au monde, dossier généralement soumis en ligne, délai souvent parmi les plus courts ; bon choix par défaut si ton établissement y est déjà référencé.",
              "**IQAS**, propose une option de traitement accéléré payante si tu es pressé par une échéance de dossier.",
              "**ICAS** et **ICES**, alternatives fiables, parfois utiles si ton établissement a déjà un historique de communication avec l'un d'eux.",
              "**CES** (Université de Toronto), délais parfois plus longs, mais reconnu pour les dossiers universitaires complexes (plusieurs diplômes, cursus atypiques).",
            ],
          },
          {
            type: "p",
            text: "Dans tous les cas, vérifie sur le site de l'organisme que ton pays et ton établissement sont bien couverts avant de payer les frais, certains établissements très spécifiques demandent des pièces justificatives supplémentaires.",
          },
        ],
      },
      {
        heading: "Délais, coûts et validité",
        blocks: [
          {
            type: "p",
            text: "Compte généralement **4 à 12 semaines** de traitement selon l'organisme et la période de l'année, avec des options accélérées payantes chez certains d'entre eux. Les frais varient d'un organisme à l'autre et évoluent régulièrement : vérifie le tarif à jour directement sur le site de l'organisme choisi avant de soumettre ta demande. Une fois émise, une EDE reste valide **5 ans** à compter de sa date d'émission : tu peux la réutiliser pour un nouveau profil Entrée express si le précédent a expiré sans invitation.",
          },
          {
            type: "p",
            muted: true,
            text: "Pièges fréquents : relevés de notes envoyés directement par l'université mais parvenus incomplets à l'organisme (vérifie qu'ils couvrent bien toutes les années du cursus), et noms translittérés différemment entre ton passeport et ton diplôme (ajoute une note explicative si c'est ton cas, pour éviter un rejet administratif).",
          },
        ],
      },
      {
        heading: "Utiliser le résultat dans ton profil",
        blocks: [
          {
            type: "p",
            text: "Une fois ton rapport reçu, conserve le document original et le numéro de référence fourni par l'organisme : tu les saisiras dans ton profil Entrée express, et devras être prêt à téléverser une copie numérique si tu reçois une invitation à présenter une demande.",
          },
          { type: "link", href: EQUIVALENCE_URL, text: "Voir la liste officielle des organismes désignés sur canada.ca ↗" },
        ],
      },
    ],
  },
  en: {
    backLink: "← Back to the full process",
    stepLabel: "Step 2 · Detailed guide",
    title: "Educational Credential Assessment (ECA)",
    nextStepIntro: "Next step once you have your ECA:",
    nextStepHref: "/procedure/creation-compte",
    nextStepLinkText: "Create your Express Entry profile →",
    sections: [
      {
        heading: "What is an ECA",
        blocks: [
          {
            type: "p",
            text: "An **Educational Credential Assessment (ECA)** is an official report confirming that a credential earned outside Canada is genuine and indicating its Canadian equivalent level (for example: \"equivalent to a three-year Canadian bachelor's degree\"). This report, not your original diploma, is what's used to calculate your education-related CRS points, up to 150 points depending on the recognized level.",
          },
        ],
      },
      {
        heading: "Who needs one",
        blocks: [
          {
            type: "p",
            text: "Anyone who studied outside Canada and wants that credential counted in their Express Entry profile. Notable exception: for the Canadian Experience Class (CEC) and the Federal Skilled Trades Program, an ECA isn't required for eligibility, but it's still recommended to maximize your CRS score; even an assessment of your secondary school diploma can earn points if you have no postsecondary education.",
          },
        ],
      },
      {
        heading: "Designated organizations",
        blocks: [
          { type: "p", text: "IRCC doesn't perform assessments itself: it has designated independent organizations. For most professions, you can freely choose among:" },
          {
            type: "ul",
            items: [
              "**WES** (World Education Services), the most widely used, often the fastest.",
              "**ICAS** (International Credential Assessment Service of Canada)",
              "**IQAS** (International Qualifications Assessment Service), offers a paid express option.",
              "**ICES** (International Credential Evaluation Service)",
              "**CES** (Comparative Education Service, University of Toronto)",
            ],
          },
          {
            type: "p",
            text: "Three regulated professions have a **mandatory** organization with no substitute: physicians and clinical/surgical specialists (Medical Council of Canada), pharmacists needing a license to practice (Pharmacy Examining Board of Canada), and architects (Canadian Architectural Certification Board).",
          },
        ],
      },
      {
        heading: "Documents to prepare",
        blocks: [
          {
            type: "ul",
            items: [
              "Certified copy/copies of your diploma(s)",
              "Official transcripts from every institution attended",
              "Certified translation if documents aren't in English or French",
              "In some cases, a letter from the institution confirming authenticity, if the organization requires it",
            ],
          },
          {
            type: "p",
            text: "Each organization has its own submission process (often online, with transcripts sent by mail or secure electronic transfer directly from your university). Check the exact instructions on the chosen organization's website before paying any fees.",
          },
        ],
      },
      {
        heading: "How to choose between WES, ICAS, IQAS, ICES, and CES",
        blocks: [
          { type: "p", text: "All five organizations assess credentials using the same principles recognized by IRCC, but differ on practical points that may guide your choice:" },
          {
            type: "ul",
            items: [
              "**WES**, the most widely used worldwide, application usually submitted online, often among the shortest turnaround times; a solid default if your institution is already in their database.",
              "**IQAS**, offers a paid expedited processing option if you're up against a deadline.",
              "**ICAS** and **ICES**, reliable alternatives, sometimes useful if your institution already has a history of communication with one of them.",
              "**CES** (University of Toronto), sometimes longer turnaround, but recognized for complex academic files (multiple degrees, non-standard programs).",
            ],
          },
          {
            type: "p",
            text: "In every case, check on the organization's website that your country and institution are covered before paying any fees; some very specific institutions require extra supporting documents.",
          },
        ],
      },
      {
        heading: "Timelines, costs, and validity",
        blocks: [
          {
            type: "p",
            text: "Generally expect **4 to 12 weeks** of processing depending on the organization and time of year, with paid expedited options at some of them. Fees vary between organizations and change regularly: check the current rate directly on the chosen organization's website before submitting your request. Once issued, an ECA stays valid for **5 years** from its issue date: you can reuse it for a new Express Entry profile if your previous one expired without an invitation.",
          },
          {
            type: "p",
            muted: true,
            text: "Common pitfalls: transcripts sent directly by the university but arriving incomplete at the organization (check that they cover every year of the program), and names transliterated differently between your passport and your diploma (add an explanatory note if this applies to you, to avoid an administrative rejection).",
          },
        ],
      },
      {
        heading: "Using the result in your profile",
        blocks: [
          {
            type: "p",
            text: "Once you receive your report, keep the original document and the reference number provided by the organization: you'll enter them in your Express Entry profile, and should be ready to upload a digital copy if you receive an invitation to apply.",
          },
          { type: "link", href: EQUIVALENCE_URL_EN, text: "See the official list of designated organizations on canada.ca ↗" },
        ],
      },
    ],
  },
};

export default function EquivalenceDiplomeBody() {
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
