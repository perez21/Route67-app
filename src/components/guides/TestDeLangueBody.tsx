"use client";

import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import { useLanguage } from "@/contexts/LanguageContext";
import { GuideSections, type BilingualGuide } from "@/components/guides/GuideShared";

const CONTENT: BilingualGuide = {
  fr: {
    backLink: "← Retour à la procédure complète",
    stepLabel: "Étape 1 · Guide détaillé",
    title: "Le test de langue officiel : tout comprendre",
    nextStepIntro: "Prochaine étape une fois ton résultat en main :",
    nextStepHref: "/procedure/equivalence-diplome",
    nextStepLinkText: "Faire évaluer tes diplômes (EDE) →",
    sections: [
      {
        heading: "Pourquoi ce test est obligatoire",
        blocks: [
          {
            type: "p",
            text: "Pour Entrée express, la compétence linguistique n'est pas déclarative : elle doit être prouvée par un test standardisé passé auprès d'un organisme reconnu par IRCC. Ce résultat sert à deux choses à la fois : vérifier ton admissibilité de base à un programme (le Programme des travailleurs qualifiés fédéral exige par exemple un NCLC/CLB 7 minimum dans les 4 compétences), et calculer une part importante de ton score CRS, jusqu'à 34 points par compétence pour ta première langue officielle, et jusqu'à 50 points de bonus si tu es bilingue français/anglais à un bon niveau.",
          },
        ],
      },
      {
        heading: "Quel test choisir",
        blocks: [
          { type: "p", text: "Quatre tests sont reconnus par IRCC pour Entrée express :" },
          {
            type: "ul",
            items: [
              "**IELTS General Training** (anglais), le plus répandu internationalement, testé dans la plupart des grandes villes.",
              "**CELPIP General** (anglais), entièrement conçu pour l'immigration canadienne, disponible en version test-center ou surveillé à distance.",
              "**TEF Canada** (français), proposé par la Chambre de commerce et d'industrie de Paris (CCIP), très présent en Afrique francophone via les Alliances françaises et instituts partenaires.",
              "**TCF Canada** (français), proposé par France Éducation International, également largement accessible en Afrique centrale.",
            ],
          },
          {
            type: "p",
            text: "Pour les candidats francophones du Cameroun, le français est souvent la langue la plus rentable à présenter en première langue officielle : viser un bon score en français puis, si possible, ajouter un test d'anglais en deuxième langue peut significativement augmenter le score CRS grâce au bonus de bilinguisme.",
          },
        ],
      },
      {
        heading: "Comprendre l'échelle CLB / NCLC",
        blocks: [
          {
            type: "p",
            text: "Les résultats bruts de chaque test (bandes IELTS, points CELPIP, notes TEF/TCF) sont convertis vers une échelle commune : le **CLB** (Canadian Language Benchmarks) pour l'anglais, et le **NCLC** (Niveaux de compétence linguistique canadiens) pour le français, les deux échelles vont de 1 à 12 et représentent exactement le même niveau de maîtrise. C'est ce niveau CLB/NCLC, et non ton score brut, qui détermine tes points CRS. Chaque test publie son propre tableau de conversion officiel : consulte-le avant de réserver pour savoir quel score viser. En repère général, le seuil NCLC/CLB 7 correspond approximativement à un niveau B2 du cadre européen (CECR), une maîtrise intermédiaire supérieure, suffisante pour la plupart des échanges professionnels courants.",
          },
        ],
      },
      {
        heading: "Réserver et se préparer",
        blocks: [
          {
            type: "ul",
            items: [
              "Réserve 4 à 6 semaines à l'avance : les créneaux se remplissent vite dans les grandes villes.",
              "Les résultats arrivent généralement 1 à 4 semaines après la date du test selon l'examen choisi.",
              "Un résultat de test est valide **2 ans** à la date de soumission de ton profil ou de ta demande. Vérifie qu'il sera encore valide au moment prévu de ton dossier.",
              "Entraîne-toi avec les épreuves blanches officielles de chaque test : le format (questions à choix multiples, expression écrite chronométrée, entretien oral) diffère significativement d'un test à l'autre.",
            ],
          },
        ],
      },
      {
        heading: "Format et durée de chaque test",
        blocks: [
          {
            type: "ul",
            items: [
              "**IELTS General Training** : environ 2h45 (compréhension écrite, écoute, expression écrite en centre d'examen ; épreuve orale en entretien individuel avec un examinateur, le même jour ou à une date proche).",
              "**CELPIP General** : environ 3 heures, entièrement sur ordinateur, épreuve orale enregistrée face à un micro (pas d'entretien humain), les résultats arrivent souvent plus vite que l'IELTS.",
              "**TEF Canada** : modulable (tu peux choisir de passer seulement certaines épreuves), compréhension et expression sur environ 3h au total selon les modules choisis.",
              "**TCF Canada** : environ 3 heures, avec une épreuve d'expression orale en visioconférence ou en présentiel selon le centre.",
            ],
          },
        ],
      },
      {
        heading: "Où passer le test au Cameroun",
        blocks: [
          {
            type: "p",
            text: "Le Cameroun dispose de centres agréés pour les principaux tests reconnus par IRCC, répartis dans plusieurs villes. Passe toujours par le site officiel du centre pour t'inscrire : méfie-toi des intermédiaires non officiels qui proposent de \"garantir\" une place moyennant des frais supplémentaires.",
          },
          {
            type: "ul",
            items: [
              "**IELTS** (anglais), centres **British Council** à Yaoundé et Douala (test sur papier ou sur ordinateur). [britishcouncil.cm ↗](https://www.britishcouncil.cm)",
              "**TCF Canada et TEF Canada** (français), l'**Institut français du Cameroun (IFC)** est le seul organisme officiel habilité pour ces certifications, avec des sessions à Yaoundé (avenue du Président Ahmadou Ahidjo) et Douala (boulevard de la Liberté). Inscription exclusivement en ligne via la plateforme TLS-Contact dédiée de l'IFC. [ifcameroun.com ↗](https://www.ifcameroun.com) · [ifc-polelangue.tlscontact.com ↗](https://ifc-polelangue.tlscontact.com) (inscriptions)",
              "**TCF Canada et TEF Canada** hors de Yaoundé/Douala, l'**Alliance française de Garoua** propose aussi ces certifications, avec des annexes à Ngaoundéré et Maroua ; utile pour les candidats du Nord et de l'Extrême-Nord. [alliancefrancaisegaroua.org ↗](https://www.alliancefrancaisegaroua.org)",
              "**CELPIP** : peu ou pas de centre agréé au Cameroun à ce jour : vérifie la disponibilité d'une session sur le site officiel de CELPIP avant de choisir ce test.",
            ],
          },
          {
            type: "p",
            text: "Les places partent vite avant chaque tirage majeur, surtout à Yaoundé et Douala : réserve dès l'ouverture des inscriptions plutôt qu'au dernier moment, et prévois si possible une marge d'un à deux mois avant l'échéance qui t'intéresse.",
          },
        ],
      },
      {
        heading: "Erreurs fréquentes à éviter",
        blocks: [
          {
            type: "ul",
            items: [
              "Confondre les versions **General** (pour l'immigration) et **Academic** (pour les études universitaires) de l'IELTS, seule la version General Training est acceptée pour Entrée express.",
              "Attendre la dernière minute : entre la réservation, le passage du test et la réception des résultats, compte 4 à 8 semaines de marge.",
              "Négliger une seule des 4 compétences (expression/compréhension orale et écrite) : le calcul CRS est fait compétence par compétence, un score faible dans une seule catégorie peut faire perdre beaucoup de points, notamment pour le bonus de bilinguisme qui exige un seuil dans les 4 compétences à la fois.",
            ],
          },
        ],
      },
    ],
  },
  en: {
    backLink: "← Back to the full process",
    stepLabel: "Step 1 · Detailed guide",
    title: "The official language test: understanding it all",
    nextStepIntro: "Next step once you have your result:",
    nextStepHref: "/procedure/equivalence-diplome",
    nextStepLinkText: "Get your credentials assessed (ECA) →",
    sections: [
      {
        heading: "Why this test is mandatory",
        blocks: [
          {
            type: "p",
            text: "For Express Entry, language ability isn't self-declared: it must be proven with a standardized test taken through an organization recognized by IRCC. This result serves two purposes at once: verifying your basic eligibility for a program (the Federal Skilled Worker Program, for instance, requires a minimum CLB 7 across all 4 skills), and calculating a significant part of your CRS score, up to 34 points per skill for your first official language, and up to 50 bonus points if you're bilingual in French/English at a good level.",
          },
        ],
      },
      {
        heading: "Which test to choose",
        blocks: [
          { type: "p", text: "Four tests are recognized by IRCC for Express Entry:" },
          {
            type: "ul",
            items: [
              "**IELTS General Training** (English), the most widely recognized internationally, offered in most major cities.",
              "**CELPIP General** (English), designed specifically for Canadian immigration, available as an in-person or remotely proctored test.",
              "**TEF Canada** (French), offered by the Paris Chamber of Commerce and Industry (CCIP), widely available across French-speaking Africa through Alliances françaises and partner institutes.",
              "**TCF Canada** (French), offered by France Éducation International, also widely accessible across Central Africa.",
            ],
          },
          {
            type: "p",
            text: "For French-speaking candidates from Cameroon, French is often the most cost-effective language to present as your first official language: aiming for a strong French score and, if possible, adding an English test as your second language can significantly boost your CRS score thanks to the bilingual bonus.",
          },
        ],
      },
      {
        heading: "Understanding the CLB / NCLC scale",
        blocks: [
          {
            type: "p",
            text: "Each test's raw results (IELTS bands, CELPIP points, TEF/TCF scores) are converted to a common scale: the **CLB** (Canadian Language Benchmarks) for English, and the **NCLC** for French; both scales run from 1 to 12 and represent exactly the same proficiency level. It's this CLB/NCLC level, not your raw score, that determines your CRS points. Each test publishes its own official conversion chart: check it before booking to know what score to aim for. As a general reference, the CLB/NCLC 7 threshold corresponds roughly to a B2 level on the European framework (CEFR), an upper-intermediate proficiency, sufficient for most everyday professional exchanges.",
          },
        ],
      },
      {
        heading: "Booking and preparing",
        blocks: [
          {
            type: "ul",
            items: [
              "Book 4 to 6 weeks ahead: slots fill up quickly in major cities.",
              "Results usually arrive 1 to 4 weeks after the test date depending on the exam chosen.",
              "A test result is valid for **2 years** from the date your profile or application is submitted. Check it will still be valid by the time your file is expected to be processed.",
              "Practice with each test's official sample exams: the format (multiple choice, timed writing, oral interview) differs significantly between tests.",
            ],
          },
        ],
      },
      {
        heading: "Format and duration of each test",
        blocks: [
          {
            type: "ul",
            items: [
              "**IELTS General Training**: about 2h45 (reading, listening, writing at a test center; speaking in a one-on-one interview with an examiner, same day or a nearby date).",
              "**CELPIP General**: about 3 hours, entirely computer-based, speaking recorded into a microphone (no human interviewer), results often arrive faster than IELTS.",
              "**TEF Canada**: modular (you can choose to take only certain sections), reading/listening/writing/speaking totaling about 3 hours depending on the modules chosen.",
              "**TCF Canada**: about 3 hours, with a speaking section done by video call or in person depending on the center.",
            ],
          },
        ],
      },
      {
        heading: "Where to take the test in Cameroon",
        blocks: [
          {
            type: "p",
            text: "Cameroon has approved centers for the main IRCC-recognized tests, spread across several cities. Always register through the center's official website: be wary of unofficial intermediaries offering to \"guarantee\" a spot for extra fees.",
          },
          {
            type: "ul",
            items: [
              "**IELTS** (English), **British Council** centers in Yaoundé and Douala (paper-based or computer-based test). [britishcouncil.cm ↗](https://www.britishcouncil.cm)",
              "**TCF Canada and TEF Canada** (French), the **Institut français du Cameroun (IFC)** is the only official body authorized for these certifications, with sessions in Yaoundé (Avenue du Président Ahmadou Ahidjo) and Douala (Boulevard de la Liberté). Registration only online via the IFC's dedicated TLS-Contact platform. [ifcameroun.com ↗](https://www.ifcameroun.com) · [ifc-polelangue.tlscontact.com ↗](https://ifc-polelangue.tlscontact.com) (registration)",
              "**TCF Canada and TEF Canada** outside Yaoundé/Douala, the **Alliance française de Garoua** also offers these certifications, with annexes in Ngaoundéré and Maroua; useful for candidates from the North and Far North regions. [alliancefrancaisegaroua.org ↗](https://www.alliancefrancaisegaroua.org)",
              "**CELPIP**: few or no approved centers in Cameroon so far: check session availability on the official CELPIP website before choosing this test.",
            ],
          },
          {
            type: "p",
            text: "Spots fill up fast before every major draw, especially in Yaoundé and Douala: book as soon as registration opens rather than at the last minute, and if possible allow a one-to-two-month buffer before the deadline you're targeting.",
          },
        ],
      },
      {
        heading: "Common mistakes to avoid",
        blocks: [
          {
            type: "ul",
            items: [
              "Confusing the **General** (for immigration) and **Academic** (for university studies) versions of IELTS; only the General Training version is accepted for Express Entry.",
              "Waiting until the last minute: between booking, taking the test, and receiving results, allow a 4-to-8-week buffer.",
              "Neglecting even one of the 4 skills (speaking/listening/reading/writing): CRS is calculated skill by skill, and a weak score in just one category can cost you a lot of points, especially for the bilingual bonus, which requires a threshold across all 4 skills at once.",
            ],
          },
        ],
      },
    ],
  },
};

export default function TestDeLangueBody() {
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
