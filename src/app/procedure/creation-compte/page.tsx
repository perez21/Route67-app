import Link from "next/link";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";

export default function CreationComptePage() {
  return (
    <main>
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link href="/procedure" className="mb-6 inline-block text-sm text-rust underline">← Retour à la procédure complète</Link>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Étape 3 · Guide détaillé</p>
        <h1 className="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Créer son compte et son profil Entrée express
        </h1>
        <Disclaimer variant="procedure" className="mb-8" />

        <div className="space-y-8 text-sm leading-relaxed text-charcoal/80 sm:text-[15px]">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Créer ton compte sécurisé</h2>
            <p>
              L&apos;accès au portail officiel d&apos;IRCC nécessite un compte sécurisé. Deux options
              équivalentes existent : un <strong>GCKey</strong> (identifiant créé directement sur le
              portail du gouvernement du Canada) ou un <strong>partenaire de connexion</strong> (via les
              identifiants de certaines institutions bancaires canadiennes, si tu en as déjà). Pour la
              grande majorité des candidats hors du Canada, le GCKey est l&apos;option la plus simple :
              choisis un mot de passe robuste et conserve précieusement tes questions de sécurité, la
              récupération d&apos;accès peut être longue en cas de perte.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Ce qu&apos;il faut avoir sous la main avant de commencer</h2>
            <p className="mb-3">
              Le formulaire ne peut pas être sauvegardé indéfiniment sans être complété correctement :
              prépare tout à l&apos;avance pour éviter les erreurs de saisie dans la précipitation.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Passeport valide (numéro, dates de délivrance et d&apos;expiration)</li>
              <li>Résultats de test de langue avec numéro de référence (voir le guide dédié)</li>
              <li>Rapport d&apos;évaluation des diplômes (EDE) avec numéro de référence, si applicable</li>
              <li>Historique complet des emplois des 10 dernières années : employeur, adresse, dates précises, fonctions, et surtout le <strong>code CNP/TEER</strong> (Classification nationale des professions) correspondant à chaque poste</li>
              <li>Détails de tout séjour ou étude antérieure au Canada</li>
              <li>Détails sur ton époux/conjoint de fait si il/elle t&apos;accompagne (études, langue, expérience)</li>
              <li>Coordonnées d&apos;un frère ou d&apos;une sœur résident permanent/citoyen canadien, le cas échéant</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Remplir le profil sans erreur</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Le profil te demande d&apos;abord de vérifier ton admissibilité à l&apos;un des trois programmes fédéraux (Travailleurs qualifiés, Expérience canadienne, Métiers spécialisés) ou de confirmer une nomination provinciale.</li>
              <li>Sois rigoureux sur les <strong>codes CNP/TEER</strong> : un code mal choisi peut fausser ton admissibilité et ton score. Le simulateur Route 67 ne remplace pas cette vérification — utilise l&apos;outil officiel de recherche de la Classification nationale des professions.</li>
              <li>Toute information inexacte ou incohérente avec tes documents peut entraîner un rejet ou, pire, un refus pour fausses déclarations — remplis avec la plus grande exactitude, sans exagérer ni omettre d&apos;expérience.</li>
              <li>Une fois soumis, ton profil génère automatiquement ton score CRS selon la grille officielle — le même calcul que reproduit le simulateur Route 67.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Sécuriser ton compte GCKey</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Utilise un mot de passe unique, non réutilisé ailleurs, et note tes questions de sécurité dans un endroit fiable — la récupération d&apos;un GCKey perdu peut prendre plusieurs semaines par courrier postal si tu perds l&apos;accès à ton email de récupération.</li>
              <li>Renseigne une adresse email que tu consultes régulièrement : IRCC communique par ce canal les mises à jour de statut, demandes de documents et convocations biométriques, avec des délais de réponse parfois courts.</li>
              <li>Ne partage jamais tes identifiants, même avec un consultant ou un tiers qui propose de "gérer ton dossier à ta place" — toutes les actions doivent rester sous ton contrôle direct.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Après la soumission</h2>
            <p>
              Ton profil rejoint le <strong>bassin</strong> de candidats Entrée express pour une durée de
              12 mois, renouvelable si tu n&apos;as pas encore reçu d&apos;invitation. IRCC organise des
              tirages réguliers (généraux ou par catégorie) : si ton score dépasse le seuil du tirage,
              tu reçois une <strong>invitation à présenter une demande (ITA)</strong> et disposes alors de
              60 jours pour déposer ton dossier complet de résidence permanente.
            </p>
            <p className="mt-3">
              Pendant que ton profil est actif dans le bassin, surveille les tirages publiés (voir la
              page d&apos;accueil de Route 67) pour situer ton score par rapport aux seuils récents, et
              tiens ta checklist de suivi à jour pour savoir précisément quels documents seront prêts
              le jour où une invitation arrive.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Erreurs fréquentes à éviter</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Laisser expirer un résultat de test de langue ou une EDE pendant que le profil est actif dans le bassin.</li>
              <li>Oublier de mettre à jour le profil après un changement de situation (nouvel emploi, nouveau diplôme, mariage) — cela peut changer ton score CRS et donc tes chances d&apos;invitation.</li>
              <li>Ne pas vérifier la cohérence entre le profil Entrée express et les documents qui seront demandés après l&apos;ITA : toute divergence peut retarder ou compromettre la demande.</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 rounded-sm border border-charcoal/10 bg-white p-6 text-sm">
          <p className="mb-3 text-charcoal/70">Une fois ton profil soumis, suis ton avancement :</p>
          <Link href="/simulateur" className="font-semibold text-rust underline">Vérifier ton score sur le simulateur Route 67 →</Link>
        </div>
      </article>
    </main>
  );
}
