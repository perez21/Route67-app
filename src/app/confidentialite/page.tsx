import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données Route 67 collecte, pourquoi, comment elles sont protégées, et comment nous contacter à ce sujet.",
};

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Informations légales</p>
        <h1 className="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">Politique de confidentialité</h1>

        <div className="space-y-8 text-sm leading-relaxed text-charcoal/80 sm:text-[15px]">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Quelles données nous collectons</h2>
            <p className="mb-3">Selon les fonctionnalités que tu utilises, Route 67 conserve :</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Ton email, ton nom et ton mot de passe (chiffré, jamais lisible en clair) à l&apos;inscription.</li>
              <li>Les réponses de ton simulateur CRS et ta checklist de suivi de procédure, pour te permettre de les reprendre sans tout ressaisir.</li>
              <li>Les sujets et messages que tu publies sur le forum d&apos;entraide.</li>
              <li>Les messages échangés dans le chat direct avec l&apos;équipe, et les demandes de rendez-vous que tu soumets.</li>
              <li>La référence de transaction que tu fournis pour confirmer un don (aucune donnée bancaire complète n&apos;est collectée : uniquement l&apos;identifiant que tu communiques toi-même).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Ce que nous ne faisons jamais</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Nous ne vendons ni ne partageons tes données avec des tiers à des fins commerciales.</li>
              <li>Nous ne demandons jamais tes identifiants gouvernementaux (GCKey, numéro de demande IRCC) : Route 67 ne se connecte à aucun compte officiel.</li>
              <li>Nous n&apos;affichons aucune publicité et ne suivons pas ton activité à des fins publicitaires.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Cookies et mesure d&apos;audience</h2>
            <p>
              Le site utilise un unique cookie de session pour te garder connecté après ton identifiant.
              Nous utilisons aussi Vercel Analytics, un outil de mesure d&apos;audience agrégée qui ne
              dépose pas de cookie de suivi individuel et ne collecte pas de données personnelles
              identifiables : il nous permet seulement de voir quelles pages sont consultées, pas qui
              les consulte.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Où sont stockées tes données</h2>
            <p>
              Toutes les données sont stockées dans une base de données sécurisée, accessible
              uniquement par l&apos;équipe technique du projet dans le cadre du fonctionnement du site
              (support, modération, activation Premium).
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Tes droits</h2>
            <p>
              Tu peux demander à tout moment la suppression de ton compte et des données associées,
              ou la correction d&apos;une information inexacte, en écrivant à l&apos;équipe via la page{" "}
              <a href="/contact" className="underline">Contact</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Une question ?</h2>
            <p>
              Pour toute question sur cette politique ou sur tes données, écris-nous via la page{" "}
              <a href="/contact" className="underline">Contact</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
