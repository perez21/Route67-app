import Link from "next/link";
import Navbar from "@/components/Navbar";
import Accordion from "@/components/Accordion";
import Disclaimer from "@/components/Disclaimer";
import { FULL_PROCESS_STEPS } from "@/lib/checklistSteps";

const STEP_DURATIONS = [
  "1 à 4 semaines de préparation + résultats sous 2 à 4 semaines",
  "4 à 12 semaines selon l'organisme désigné",
  "1 à 2 heures, dès que tu as tes résultats de langue et ton EDE",
  "Immédiat — recalculé à chaque mise à jour de ton profil",
  "Jusqu'à 1 an (durée de validité du profil)",
  "Variable — dépend des tirages et de ton score",
  "60 jours à partir de la réception de l'ITA",
  "Sur convocation, généralement sous 30 jours",
  "1 à 3 semaines pour obtenir un rendez-vous + résultats",
  "2 à 12 semaines selon le pays",
  "Variable — plusieurs semaines à quelques mois",
  "Quelques semaines après la fin des vérifications",
  "Le jour de ton entrée effective au Canada",
];

const GUIDES = [
  {
    title: "Le test de langue officiel",
    eyebrow: "Étape 1",
    description:
      "IELTS, CELPIP, TEF Canada, TCF Canada : quel test choisir, comment le préparer, comment convertir ton résultat en niveau CLB/NCLC, et pourquoi le français peut te rapporter des points supplémentaires.",
    href: "/procedure/test-de-langue",
  },
  {
    title: "L'équivalence des diplômes (EDE / ECA)",
    eyebrow: "Étape 2",
    description:
      "Comment faire reconnaître un diplôme obtenu hors du Canada, quel organisme désigné choisir (WES, ICAS, IQAS, ICES, CES), les délais et les coûts à prévoir.",
    href: "/procedure/equivalence-diplome",
  },
  {
    title: "Créer son compte et son profil Entrée express",
    eyebrow: "Étape 3",
    description:
      "GCKey ou partenaire de connexion, documents à préparer avant de commencer, comment remplir le profil sans erreur, et ce qui se passe une fois le profil soumis.",
    href: "/procedure/creation-compte",
  },
];

export default function ProcedurePage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Guide complet</p>
        <h1 className="mb-3 font-display text-2xl font-semibold text-ink sm:text-3xl">Procédure Entrée express</h1>
        <p className="mb-4 max-w-2xl text-sm text-charcoal/65">
          Toutes les étapes du parcours, du premier test de langue jusqu&apos;à l&apos;obtention du
          statut de résident permanent au Canada — avec, pour chacune, une estimation de délai et un
          guide détaillé quand disponible.
        </p>
        <Disclaimer className="mb-10" />

        <h2 className="mb-4 font-display text-xl font-semibold text-ink">La ligne du temps complète</h2>
        <ol className="mb-12 space-y-0 border-l-2 border-gold/40 pl-6">
          {FULL_PROCESS_STEPS.map((step, i) => (
            <li key={step.label} className="relative pb-8 last:pb-0">
              <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-gold font-mono text-[11px] font-bold text-ink">
                {i + 1}
              </span>
              <h3 className="font-display text-base font-semibold text-ink">{step.label}</h3>
              <p className="mt-1 text-sm text-charcoal/65">{step.description}</p>
              <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wide text-cmr-green">
                Délai indicatif : {STEP_DURATIONS[i]}
              </p>
            </li>
          ))}
        </ol>

        <h2 className="mb-4 font-display text-xl font-semibold text-ink">Guides détaillés</h2>
        <p className="mb-4 text-sm text-charcoal/60">
          Déplie chaque section pour un résumé, puis accède au guide complet.
        </p>
        <Accordion items={GUIDES} />

        <div className="mt-10 rounded-sm border border-charcoal/10 bg-white p-6 text-sm">
          <p className="mb-2 font-semibold text-ink">Envie d&apos;un accompagnement plus personnalisé ?</p>
          <p className="mb-4 text-charcoal/65">
            Le forum d&apos;entraide et les rendez-vous avec l&apos;équipe sont réservés aux membres
            Premium — un soutien qui finance directement le fonctionnement du site.
          </p>
          <Link href="/dashboard#don" className="inline-block rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-ink">
            Découvrir le forfait Premium
          </Link>
        </div>
      </div>
    </main>
  );
}
