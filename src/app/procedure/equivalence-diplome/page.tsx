import Link from "next/link";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Équivalence des diplômes (EDE/ECA) pour l'Entrée express",
  description:
    "WES, ICAS, IQAS, ICES, CES : quel organisme choisir pour ton évaluation des diplômes d'études (EDE), documents à fournir, délais et validité de 5 ans.",
};

const EQUIVALENCE_URL =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/documents/evaluer-diplomes-etudes.html";

export default function EquivalenceDiplomePage() {
  return (
    <main>
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link href="/procedure" className="mb-6 inline-block text-sm text-rust underline">← Retour à la procédure complète</Link>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Étape 2 · Guide détaillé</p>
        <h1 className="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">
          L&apos;équivalence des diplômes (EDE / ECA)
        </h1>
        <Disclaimer variant="procedure" className="mb-8" />

        <div className="space-y-8 text-sm leading-relaxed text-charcoal/80 sm:text-[15px]">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Qu&apos;est-ce qu&apos;une EDE</h2>
            <p>
              Une <strong>Évaluation des diplômes d&apos;études (EDE)</strong> — aussi appelée ECA en anglais
              (Educational Credential Assessment) — est un rapport officiel qui confirme qu&apos;un diplôme
              obtenu hors du Canada est authentique et indique à quel niveau canadien il correspond
              (par exemple : « équivalent à un baccalauréat canadien de trois ans »). C&apos;est ce rapport,
              et non ton diplôme original, qui sert à calculer tes points CRS liés aux études — jusqu&apos;à
              150 points selon le niveau reconnu.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Qui doit en obtenir une</h2>
            <p>
              Toute personne ayant étudié hors du Canada et qui souhaite faire valoir ce diplôme dans son
              profil Entrée express. Exception notable : pour la Catégorie de l&apos;expérience canadienne
              (CEC) et le Programme des travailleurs de métiers spécialisés, l&apos;EDE n&apos;est pas obligatoire
              pour être admissible, mais elle reste recommandée pour maximiser ton score CRS — même une
              évaluation de ton diplôme secondaire peut rapporter des points si tu n&apos;as pas fait d&apos;études
              postsecondaires.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Les organismes désignés</h2>
            <p className="mb-3">
              IRCC ne réalise pas lui-même les évaluations : il a désigné des organismes indépendants.
              Pour la grande majorité des professions, tu choisis librement parmi :
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li><strong>WES</strong> (World Education Services) — le plus utilisé, souvent le plus rapide.</li>
              <li><strong>ICAS</strong> (International Credential Assessment Service of Canada)</li>
              <li><strong>IQAS</strong> (International Qualifications Assessment Service) — propose un service express payant.</li>
              <li><strong>ICES</strong> (International Credential Evaluation Service)</li>
              <li><strong>CES</strong> (Comparative Education Service — Université de Toronto)</li>
            </ul>
            <p className="mt-3">
              Trois professions réglementées ont un organisme <strong>obligatoire</strong> et non substituable :
              médecins et spécialistes en médecine clinique/chirurgie (Conseil médical du Canada),
              pharmaciens ayant besoin d&apos;un permis d&apos;exercice (Bureau des examinateurs en pharmacie
              du Canada), et architectes (Conseil canadien de certification en architecture).
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Documents à préparer</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Copie(s) certifiée(s) de ton ou tes diplôme(s)</li>
              <li>Relevés de notes officiels de chaque établissement fréquenté</li>
              <li>Traduction certifiée si les documents ne sont pas en français ou en anglais</li>
              <li>Dans certains cas, une lettre de l&apos;établissement confirmant l&apos;authenticité, si l&apos;organisme le demande</li>
            </ul>
            <p className="mt-3">
              Chaque organisme a sa propre procédure de soumission (souvent en ligne, avec envoi postal
              ou électronique sécurisé des relevés directement par ton université). Vérifie les
              instructions précises sur le site de l&apos;organisme choisi avant d&apos;engager des frais.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Comment choisir entre WES, ICAS, IQAS, ICES et CES</h2>
            <p className="mb-3">
              Les cinq organismes évaluent selon les mêmes principes reconnus par IRCC, mais diffèrent
              sur des points pratiques qui peuvent orienter ton choix :
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>WES</strong> — le plus utilisé au monde, dossier généralement soumis en ligne, délai souvent parmi les plus courts ; bon choix par défaut si ton établissement y est déjà référencé.</li>
              <li><strong>IQAS</strong> — propose une option de traitement accéléré payante si tu es pressé par une échéance de dossier.</li>
              <li><strong>ICAS</strong> et <strong>ICES</strong> — alternatives fiables, parfois utiles si ton établissement a déjà un historique de communication avec l&apos;un d&apos;eux.</li>
              <li><strong>CES</strong> (Université de Toronto) — délais parfois plus longs, mais reconnu pour les dossiers universitaires complexes (plusieurs diplômes, cursus atypiques).</li>
            </ul>
            <p className="mt-3">
              Dans tous les cas, vérifie sur le site de l&apos;organisme que ton pays et ton établissement
              sont bien couverts avant de payer les frais — certains établissements très spécifiques
              demandent des pièces justificatives supplémentaires.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Délais, coûts et validité</h2>
            <p>
              Compte généralement <strong>4 à 12 semaines</strong> de traitement selon l&apos;organisme et la
              période de l&apos;année, avec des options accélérées payantes chez certains d&apos;entre eux. Les
              frais varient d&apos;un organisme à l&apos;autre et évoluent régulièrement — vérifie le tarif à
              jour directement sur le site de l&apos;organisme choisi avant de soumettre ta demande. Une fois
              émise, une EDE reste valide <strong>5 ans</strong> à compter de sa date d&apos;émission : tu peux
              la réutiliser pour un nouveau profil Entrée express si le précédent a expiré sans invitation.
            </p>
            <p className="mt-3 text-sm text-charcoal/60">
              Pièges fréquents : relevés de notes envoyés directement par l&apos;université mais parvenus
              incomplets à l&apos;organisme (vérifie qu&apos;ils couvrent bien toutes les années du cursus),
              et noms translittérés différemment entre ton passeport et ton diplôme (ajoute une note
              explicative si c&apos;est ton cas, pour éviter un rejet administratif).
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Utiliser le résultat dans ton profil</h2>
            <p>
              Une fois ton rapport reçu, conserve le document original et le numéro de référence fourni
              par l&apos;organisme : tu les saisiras dans ton profil Entrée express, et devras être prêt à
              téléverser une copie numérique si tu reçois une invitation à présenter une demande.
            </p>
            <a href={EQUIVALENCE_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-rust underline">
              Voir la liste officielle des organismes désignés sur canada.ca ↗
            </a>
          </section>
        </div>

        <div className="mt-10 rounded-sm border border-charcoal/10 bg-white p-6 text-sm">
          <p className="mb-3 text-charcoal/70">Prochaine étape une fois ton EDE en main :</p>
          <Link href="/procedure/creation-compte" className="font-semibold text-rust underline">Créer ton profil Entrée express →</Link>
        </div>
      </article>
    </main>
  );
}
