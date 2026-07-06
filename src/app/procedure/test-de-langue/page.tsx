import Link from "next/link";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test de langue IELTS, CELPIP, TEF : comment choisir et convertir en CLB/NCLC",
  description:
    "IELTS, CELPIP, TEF Canada, TCF Canada : quel test choisir, comment convertir ton score en niveau CLB/NCLC, et l'astuce du bonus bilingue pour ton score CRS.",
};

export default function TestDeLanguePage() {
  return (
    <main>
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link href="/procedure" className="mb-6 inline-block text-sm text-rust underline">← Retour à la procédure complète</Link>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Étape 1 · Guide détaillé</p>
        <h1 className="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Le test de langue officiel : tout comprendre
        </h1>
        <Disclaimer variant="procedure" className="mb-8" />

        <div className="space-y-8 text-sm leading-relaxed text-charcoal/80 sm:text-[15px]">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Pourquoi ce test est obligatoire</h2>
            <p>
              Pour Entrée express, la compétence linguistique n&apos;est pas déclarative : elle doit être
              prouvée par un test standardisé passé auprès d&apos;un organisme reconnu par IRCC. Ce résultat
              sert à deux choses à la fois : vérifier ton admissibilité de base à un programme (le
              Programme des travailleurs qualifiés fédéral exige par exemple un NCLC/CLB 7 minimum dans
              les 4 compétences), et calculer une part importante de ton score CRS — jusqu&apos;à 34 points
              par compétence pour ta première langue officielle, et jusqu&apos;à 50 points de bonus si tu es
              bilingue français/anglais à un bon niveau.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Quel test choisir</h2>
            <p className="mb-3">Quatre tests sont reconnus par IRCC pour Entrée express :</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>IELTS General Training</strong> (anglais) — le plus répandu internationalement, testé dans la plupart des grandes villes.</li>
              <li><strong>CELPIP General</strong> (anglais) — entièrement conçu pour l&apos;immigration canadienne, disponible en version test-center ou surveillé à distance.</li>
              <li><strong>TEF Canada</strong> (français) — proposé par la Chambre de commerce et d&apos;industrie de Paris (CCIP), très présent en Afrique francophone via les Alliances françaises et instituts partenaires.</li>
              <li><strong>TCF Canada</strong> (français) — proposé par France Éducation International, également largement accessible en Afrique centrale.</li>
            </ul>
            <p className="mt-3">
              Pour les candidats francophones du Cameroun, le français est souvent la langue la plus
              rentable à présenter en première langue officielle : viser un bon score en français puis,
              si possible, ajouter un test d&apos;anglais en deuxième langue peut significativement augmenter
              le score CRS grâce au bonus de bilinguisme.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Comprendre l&apos;échelle CLB / NCLC</h2>
            <p>
              Les résultats bruts de chaque test (bandes IELTS, points CELPIP, notes TEF/TCF) sont
              convertis vers une échelle commune : le <strong>CLB</strong> (Canadian Language Benchmarks)
              pour l&apos;anglais, et le <strong>NCLC</strong> (Niveaux de compétence linguistique canadiens)
              pour le français — les deux échelles vont de 1 à 12 et représentent exactement le même
              niveau de maîtrise. C&apos;est ce niveau CLB/NCLC, et non ton score brut, qui détermine tes
              points CRS. Chaque test publie son propre tableau de conversion officiel : consulte-le
              avant de réserver pour savoir quel score viser. En repère général, le seuil NCLC/CLB 7
              correspond approximativement à un niveau B2 du cadre européen (CECR) — une maîtrise
              intermédiaire supérieure, suffisante pour la plupart des échanges professionnels courants.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Réserver et se préparer</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Réserve 4 à 6 semaines à l&apos;avance : les créneaux se remplissent vite dans les grandes villes.</li>
              <li>Les résultats arrivent généralement 1 à 4 semaines après la date du test selon l&apos;examen choisi.</li>
              <li>Un résultat de test est valide <strong>2 ans</strong> à la date de soumission de ton profil ou de ta demande — vérifie qu&apos;il sera encore valide au moment prévu de ton dossier.</li>
              <li>Entraîne-toi avec les épreuves blanches officielles de chaque test : le format (questions à choix multiples, expression écrite chronométrée, entretien oral) diffère significativement d&apos;un test à l&apos;autre.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Format et durée de chaque test</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>IELTS General Training</strong> : environ 2h45 (compréhension écrite, écoute, expression écrite en centre d&apos;examen ; épreuve orale en entretien individuel avec un examinateur, le même jour ou à une date proche).</li>
              <li><strong>CELPIP General</strong> : environ 3 heures, entièrement sur ordinateur, épreuve orale enregistrée face à un micro (pas d&apos;entretien humain) — les résultats arrivent souvent plus vite que l&apos;IELTS.</li>
              <li><strong>TEF Canada</strong> : modulable (tu peux choisir de passer seulement certaines épreuves), compréhension et expression sur environ 3h au total selon les modules choisis.</li>
              <li><strong>TCF Canada</strong> : environ 3 heures, avec une épreuve d&apos;expression orale en visioconférence ou en présentiel selon le centre.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Où passer le test au Cameroun</h2>
            <p className="mb-3">
              Le Cameroun dispose de centres agréés pour les principaux tests reconnus par IRCC,
              répartis dans plusieurs villes. Passe toujours par le site officiel du centre pour
              t&apos;inscrire — méfie-toi des intermédiaires non officiels qui proposent de "garantir"
              une place moyennant des frais supplémentaires.
            </p>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <strong>IELTS</strong> (anglais) — centres <strong>British Council</strong> à Yaoundé et
                Douala (test sur papier ou sur ordinateur).{" "}
                <a href="https://www.britishcouncil.cm" target="_blank" rel="noopener noreferrer" className="font-semibold text-rust underline">britishcouncil.cm ↗</a>
              </li>
              <li>
                <strong>TCF Canada et TEF Canada</strong> (français) — l&apos;<strong>Institut français du
                Cameroun (IFC)</strong> est le seul organisme officiel habilité pour ces certifications,
                avec des sessions à Yaoundé (avenue du Président Ahmadou Ahidjo) et Douala (boulevard
                de la Liberté). Inscription exclusivement en ligne via la plateforme TLS-Contact dédiée
                de l&apos;IFC.{" "}
                <a href="https://www.ifcameroun.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-rust underline">ifcameroun.com ↗</a>
                {" "}·{" "}
                <a href="https://ifc-polelangue.tlscontact.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-rust underline">ifc-polelangue.tlscontact.com ↗</a> (inscriptions)
              </li>
              <li>
                <strong>TCF Canada et TEF Canada</strong> hors de Yaoundé/Douala — l&apos;<strong>Alliance
                française de Garoua</strong> propose aussi ces certifications, avec des annexes à
                Ngaoundéré et Maroua ; utile pour les candidats du Nord et de l&apos;Extrême-Nord.{" "}
                <a href="https://www.alliancefrancaisegaroua.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-rust underline">alliancefrancaisegaroua.org ↗</a>
              </li>
              <li>
                <strong>CELPIP</strong> : peu ou pas de centre agréé au Cameroun à ce jour — vérifie la
                disponibilité d&apos;une session sur le site officiel de CELPIP avant de choisir ce test.
              </li>
            </ul>
            <p className="mt-3">
              Les places partent vite avant chaque tirage majeur, surtout à Yaoundé et Douala : réserve
              dès l&apos;ouverture des inscriptions plutôt qu&apos;au dernier moment, et prévois si possible
              une marge d&apos;un à deux mois avant l&apos;échéance qui t&apos;intéresse.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Erreurs fréquentes à éviter</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Confondre les versions <em>General</em> (pour l&apos;immigration) et <em>Academic</em> (pour les études universitaires) de l&apos;IELTS — seule la version General Training est acceptée pour Entrée express.</li>
              <li>Attendre la dernière minute : entre la réservation, le passage du test et la réception des résultats, compte 4 à 8 semaines de marge.</li>
              <li>Négliger une seule des 4 compétences (expression/compréhension orale et écrite) : le calcul CRS est fait compétence par compétence, un score faible dans une seule catégorie peut faire perdre beaucoup de points, notamment pour le bonus de bilinguisme qui exige un seuil dans les 4 compétences à la fois.</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 rounded-sm border border-charcoal/10 bg-white p-6 text-sm">
          <p className="mb-3 text-charcoal/70">Prochaine étape une fois ton résultat en main :</p>
          <Link href="/procedure/equivalence-diplome" className="font-semibold text-rust underline">Faire évaluer tes diplômes (EDE) →</Link>
        </div>
      </article>
    </main>
  );
}
