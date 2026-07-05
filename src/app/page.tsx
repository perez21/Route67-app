import Link from "next/link";
import Navbar from "@/components/Navbar";
import NewsCarousel from "@/components/NewsCarousel";
import Accordion from "@/components/Accordion";
import Disclaimer from "@/components/Disclaimer";
import { prisma } from "@/lib/db";
import { getSocialLinks } from "@/lib/site";
import { getMomoNumbers } from "@/lib/mailer";
import PremiumCtaButton from "@/components/PremiumCtaButton";
import LocalDateTime from "@/components/LocalDateTime";

export const revalidate = 120; // rafraîchit tirages + actualités toutes les 2 minutes

const EQUIVALENCE_URL =
  "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/documents/evaluer-diplomes-etudes.html";
const OFFICIAL_CALCULATOR_URL = "https://nvimmigration.ca/67-calculator/";

const PROCEDURE_ITEMS = [
  {
    title: "Le test de langue officiel",
    eyebrow: "Étape 1",
    description: "IELTS (International English Language Testing System), CELPIP (Canadian English Language Proficiency Index Program), TEF Canada (Test d'évaluation de français) et TCF Canada (Test de connaissance du français) : lequel choisir, comment convertir ton score en niveau CLB/NCLC (Canadian Language Benchmarks / Niveaux de compétence linguistique canadiens), et l'astuce du bonus bilingue.",
    href: "/procedure/test-de-langue",
  },
  {
    title: "L'équivalence des diplômes (EDE / ECA)",
    eyebrow: "Étape 2",
    description: "EDE : évaluation des diplômes d'études (ECA en anglais, Educational Credential Assessment). Organismes désignés — WES (World Education Services), ICAS (International Credential Assessment Service), IQAS (International Qualifications Assessment Service), ICES (International Credential Evaluation Service), CES (Comparative Education Service) —, documents à fournir, délais et validité de 5 ans.",
    href: "/procedure/equivalence-diplome",
  },
  {
    title: "Créer son compte et son profil Entrée express",
    eyebrow: "Étape 3",
    description: "GCKey (identifiant unique du gouvernement du Canada pour accéder aux services en ligne), documents à préparer, codes CNP/TEER (Classification nationale des professions / Training, Education, Experience and Responsibilities), et ce qu'il se passe une fois le profil soumis.",
    href: "/procedure/creation-compte",
  },
];

async function getDraws() {
  try {
    return await prisma.draw.findMany({ orderBy: { date: "desc" }, take: 5 });
  } catch {
    return [];
  }
}

async function getNews() {
  try {
    return await prisma.newsItem.findMany({ orderBy: { publishedAt: "desc" }, take: 10 });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [draws, news] = await Promise.all([getDraws(), getNews()]);
  const social = getSocialLinks();
  const momo = getMomoNumbers();

  return (
    <main>
      <Navbar />

      {/* Hero — compact et mobile-first, façon "une" de journal */}
      <header className="relative overflow-hidden bg-ink px-4 py-10 text-parchment sm:px-6 sm:py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="max-w-3xl animate-fadeUp font-display text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
            La plateforme qui ouvre la porte{" "}
            <span className="text-gold2">du VISA.</span>{" "}
            <span aria-hidden className="inline-block align-middle text-3xl sm:text-4xl md:text-6xl">🇨🇦</span>
          </h1>
          <p className="mt-4 max-w-xl animate-fadeUp text-base text-parchment/80 sm:mt-6 sm:text-lg" style={{ animationDelay: "0.1s" }}>
            Route67 est une source indépendante d&apos;information sur l&apos;immigration au Canada via
            le système Entrée Express. Nous ne sommes pas affiliés au gouvernement canadien (IRCC)
            et nous relayons des informations, analyses et actualités à titre informatif uniquement.
          </p>

          {/* Une seule ligne, toujours — défilement horizontal plutôt que
              retour à la ligne, quelle que soit la largeur d'écran. */}
          <div className="scrollbar-hide -mx-4 mt-6 flex flex-nowrap gap-3 overflow-x-auto px-4 pb-2 sm:mt-8 sm:gap-4">
            <Link href="/simulateur" className="flex-shrink-0 rounded-sm bg-gold px-5 py-3 text-sm font-semibold text-ink sm:px-6">
              Calculer mon score CRS
            </Link>
            <a
              href={OFFICIAL_CALCULATOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-sm bg-cmr-green px-5 py-3 text-sm font-semibold text-white sm:px-6"
            >
              Admissibilité Entrée Express ↗
            </a>
            <a
              href={EQUIVALENCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-sm border border-parchment/30 px-5 py-3 text-sm font-semibold sm:px-6"
            >
              Équivalence des diplômes ↗
            </a>
          </div>
          <p className="mt-3 max-w-xl text-[11px] text-parchment/45">
            L&apos;admissibilité Entrée Express et la page d&apos;équivalence des diplômes ouvrent sur
            des sites externes indépendants de Route 67.
          </p>
        </div>
      </header>

      {/* À la une — remonté juste sous le hero, avec images, défilement horizontal sur mobile */}
      <NewsCarousel news={news} />

      {/* Derniers tirages */}
      <section id="tirages" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h2 className="mb-4 font-display text-xl font-bold text-ink sm:text-2xl">Derniers tirages Entrée express</h2>
        <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-ink">
          {draws.length === 0 ? (
            <p className="px-5 py-8 text-sm text-parchment/60">
              Aucun tirage enregistré pour le moment. Lance <code>npm run prisma:seed</code> pour
              charger des données de démonstration.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] font-mono text-sm text-parchment">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-parchment/45">
                    <th className="px-5 pb-2 pt-4 font-medium">Tirage</th>
                    <th className="px-5 pb-2 pt-4 font-medium">Catégorie</th>
                    <th className="px-5 pb-2 pt-4 font-medium">Score min.</th>
                    <th className="px-5 pb-2 pt-4 font-medium">Invitations</th>
                    <th className="px-5 pb-2 pt-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {draws.map((draw: Awaited<ReturnType<typeof getDraws>>[number]) => (
                    <tr key={draw.id} className="border-t border-parchment/10">
                      <td className="px-5 py-3 font-semibold text-gold2">#{draw.number}</td>
                      <td className="px-5 py-3">{draw.category}</td>
                      <td className="px-5 py-3">{draw.minScore}</td>
                      <td className="px-5 py-3">{draw.invitations.toLocaleString("fr-FR")}</td>
                      <td className="px-5 py-3">
                        <LocalDateTime iso={draw.date.toISOString()} options={{ day: "numeric", month: "long", year: "numeric" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Procédure Entrée express — bande déroulante */}
      <section id="procedure" className="bg-white px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 font-mono text-xs uppercase tracking-widest text-rust">Guide complet</p>
              <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">Procédure Entrée express</h2>
            </div>
            <Link href="/procedure" className="text-sm font-semibold text-rust underline">Voir la ligne du temps complète →</Link>
          </div>
          <Accordion items={PROCEDURE_ITEMS} />
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">Comment fonctionne l&apos;Entrée express</h2>
          <p className="mt-2 max-w-md text-sm text-charcoal/65">
            Le système à points en quatre grandes phases, expliqué sans jargon administratif.
          </p>
        </div>
        <div className="grid gap-6 border-t border-charcoal/10 pt-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
          {[
            { title: "Profil en ligne", text: "Test de langue, équivalence de diplôme, puis création du profil sur le système d'IRCC pour obtenir un score CRS." },
            { title: "Entrée dans le bassin", text: "Ton profil rejoint le bassin des candidats, en attente d'une invitation à un tirage." },
            { title: "Invitation à présenter une demande (ITA)", text: "Si ton score dépasse le seuil du tirage, tu reçois une invitation à déposer une demande complète." },
            { title: "Dépôt et vérifications", text: "60 jours pour soumettre le dossier, puis biométrie, examen médical, certificat de police et vérifications de sécurité." },
          ].map((step, i) => (
            <div key={step.title}>
              <div className="mb-2 font-mono text-xs font-semibold text-gold">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mb-1.5 font-display text-base font-semibold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-charcoal/70">{step.text}</p>
            </div>
          ))}
        </div>
        <Link href="/procedure" className="mt-6 inline-block text-sm font-semibold text-rust underline">
          Voir toutes les étapes jusqu&apos;au visa →
        </Link>
      </section>

      {/* Contact teaser */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="rounded-sm border border-charcoal/10 bg-white p-6 sm:p-8">
          <h2 className="mb-2 font-display text-xl font-bold text-ink">Une question ? Écris-nous directement.</h2>
          <p className="mb-5 max-w-xl text-sm text-charcoal/65">
            Que tu sois déjà inscrit ou juste en train de te renseigner, l&apos;équipe Route 67 répond
            personnellement à chaque message. Consulte aussi notre <Link href="/faq" className="underline">FAQ</Link>.
          </p>
          <Link href="/contact" className="inline-block rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-ink">
            Contacter l&apos;équipe
          </Link>
        </div>
      </section>

      {/* Soutenir le projet — don anonyme (à gauche, informatif, sans bouton)
          et avantages Premium (à droite, avec appel à l'action) */}
      <section id="tarifs" className="bg-parchment2/50 px-4 py-10 sm:px-6 sm:py-14 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">Soutenir le projet</h2>
            <p className="mt-2 max-w-xl text-sm text-charcoal/65">
              Route 67 reste gratuit et utile à tous. Le site vit grâce aux dons de celles et ceux
              qui veulent nous aider à continuer : ils couvrent l&apos;hébergement, la maintenance
              pour rester à jour en temps réel, et un peu de quoi faire vivre l&apos;équipe qui s&apos;en
              occupe.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Don anonyme — purement informatif, sans bouton : le don garde
                un caractère anonyme, il ne déclenche aucune action ici. */}
            <div className="rounded-sm border border-charcoal/10 bg-white p-6 sm:p-8">
              <span className="mb-4 inline-block w-fit rounded-full bg-gold px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink">
                Don anonyme
              </span>
              <h3 className="mb-4 font-display text-xl font-semibold text-ink">Comment contribuer</h3>
              <ul className="mb-5 space-y-2 text-sm text-charcoal/75">
                <li className="border-t border-charcoal/10 pt-2">Orange Money : <strong>{momo.orange}</strong></li>
                <li className="border-t border-charcoal/10 pt-2">MTN MoMo : <strong>{momo.mtn}</strong></li>
                <li className="border-t border-charcoal/10 pt-2">Nom Mobile Money : <strong>{momo.accountName}</strong></li>
                {momo.paypal && (
                  <li className="border-t border-charcoal/10 pt-2">
                    PayPal : <span className="font-semibold">{momo.paypal}</span>
                  </li>
                )}
              </ul>
              <p className="text-xs text-charcoal/50">
                Un don n&apos;est pas un paiement pour un service individualisé : c&apos;est un soutien
                volontaire et anonyme au projet. Si vous trouvez notre action utile et souhaitez nous
                encourager, vous pouvez faire un don d&apos;un montant de votre choix via les contacts
                ci-dessus.
              </p>
            </div>

            {/* Avantages Premium — avec appel à l'action */}
            <div className="flex flex-col rounded-sm bg-ink p-6 text-parchment sm:p-8">
              <span className="mb-4 inline-block w-fit rounded-full bg-cmr-yellow px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink">
                Avantages Premium
              </span>
              <h3 className="mb-4 font-display text-xl font-semibold">Ce que je reçois en devenant utilisateur prémium</h3>
              <ul className="mb-6 flex-grow space-y-2 text-sm">
                <li className="border-t border-parchment/15 pt-2">Rencontre virtuelle avec l&apos;équipe</li>
                <li className="border-t border-parchment/15 pt-2">Chat direct avec l&apos;équipe</li>
                <li className="border-t border-parchment/15 pt-2">Assistant IA disponible 24h/24</li>
                <li className="border-t border-parchment/15 pt-2">Valable 1 mois</li>
              </ul>
              <PremiumCtaButton />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0E1A30] px-4 py-10 text-xs leading-relaxed text-parchment/55 sm:px-6 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2"><strong className="text-parchment">Route 67</strong> : plateforme d&apos;information et d&apos;entraide indépendante sur l&apos;Entrée express canadienne.</p>
          <p>
            Route 67 n&apos;est pas un cabinet ni un agent d&apos;immigration agréé et ne fournit pas de
            conseils juridiques individualisés. Notre seul projet est de rendre l&apos;information
            officielle plus accessible. Les informations publiées sont vulgarisées à partir des
            sources officielles d&apos;IRCC à titre informatif. Pour un accompagnement personnalisé et
            réglementé, contacte un consultant agréé (CRCIC : Collège des consultants en
            immigration et en citoyenneté) ou un avocat membre d&apos;un barreau.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-parchment/10 pt-5">
            <p>
              <Link href="/contact" className="underline">Nous contacter</Link> ·{" "}
              <Link href="/procedure" className="underline">Procédure complète</Link>
            </p>
            {(social.facebook || social.instagram || social.linkedin || social.tiktok || social.whatsapp) && (
              <div className="flex gap-4">
                {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="underline">Facebook</a>}
                {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="underline">Instagram</a>}
                {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="underline">LinkedIn</a>}
                {social.tiktok && <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="underline">TikTok</a>}
                {social.whatsapp && <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a>}
              </div>
            )}
          </div>
          <p className="mt-4 text-parchment/35">© {new Date().getFullYear()} Route 67. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}
