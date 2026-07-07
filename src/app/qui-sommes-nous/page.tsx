import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import { Compass, Target, BookOpen, Users, Handshake } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qui sommes-nous",
  description:
    "Route 67 : pourquoi ce projet existe, d'où vient l'information publiée, qui s'en occupe, et notre position sur les partenariats.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">À propos</p>
        <h1 className="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">Qui sommes-nous</h1>
        <Disclaimer className="mb-8" />

        <div className="space-y-8 text-sm leading-relaxed text-charcoal/80 sm:text-[15px]">
          <section>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold text-ink"><Compass className="h-5 w-5 text-rust" aria-hidden />Pourquoi Route 67 existe</h2>
            <p>
              {/* TODO : remplace ce paragraphe par ta propre histoire (déclic personnel, frustration
                  rencontrée pendant ta propre démarche, besoin identifié dans la communauté, etc.) */}
              Route 67 est né d&apos;un constat simple : l&apos;information officielle sur l&apos;Entrée
              express existe, mais elle est dispersée entre plusieurs sites gouvernementaux, souvent
              technique, et difficile à suivre au jour le jour pour qui prépare son dossier seul. Nous
              avons voulu un endroit unique, gratuit, où suivre les tirages, comprendre chaque étape et
              poser ses questions sans barrière de langage ni de coût.
            </p>
          </section>

          <section>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold text-ink"><Target className="h-5 w-5 text-rust" aria-hidden />Notre mission</h2>
            <p>
              Rendre l&apos;information officielle d&apos;IRCC plus accessible : la vulgariser, la tenir
              à jour, et créer un espace d&apos;entraide entre personnes qui vivent la même démarche.
              Route 67 ne remplace ni un consultant en immigration agréé, ni un avocat : notre rôle
              s&apos;arrête là où commence le conseil juridique individualisé.
            </p>
          </section>

          <section>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold text-ink"><BookOpen className="h-5 w-5 text-rust" aria-hidden />D&apos;où vient l&apos;information publiée</h2>
            <p>
              {/* TODO : précise ta méthode réelle si elle diffère (veille manuelle, alertes IRCC,
                  outils spécifiques, fréquence de vérification...) */}
              Chaque contenu du site (tirages, seuils CRS, étapes de la procédure, actualités) est
              vulgarisé à partir des sources officielles publiques d&apos;IRCC et du gouvernement du
              Canada, vérifiées régulièrement pour rester à jour. Nous citons ou renvoyons vers ces
              sources officielles chaque fois que c&apos;est pertinent, pour que tu puisses toujours
              vérifier par toi-même.
            </p>
          </section>

          <section>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold text-ink"><Users className="h-5 w-5 text-rust" aria-hidden />Qui s&apos;en occupe</h2>
            <p>
              {/* TODO : remplace par les vraies informations de l'équipe. Si vous êtes une seule
                  personne pour l'instant, ce n'est pas un problème à cacher : la transparence renforce
                  la confiance plus qu'un flou. */}
              Verdier Fofack. Analyste systèmes d'information, j'ai pendant plusieurs années travaillé dans les projets de déveleppement web, support technique informatique avant de me lancer dans l'enseignement des TICs. Aujourd'hui résidant au Canada, je suis déterminé à centraliser la bonne information afin d'éviter aux autres de commettre les erreurs que j'ai commise en faisant ma procédure. Nous (l'équipe et moi) ne sommes pas des consultants en immigration
              agréés (voir l&apos;encadré ci-dessus) : notre valeur ajoutée est de rendre l&apos;information
              claire, à jour et gratuite, pas de remplacer un accompagnement réglementé.
            </p>
          </section>

          <section>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold text-ink"><Handshake className="h-5 w-5 text-rust" aria-hidden />Partenariats et sponsors</h2>
            <p>
              {/* TODO : ajuste selon ta position réelle */}
              Route 67 est aujourd&apos;hui financé uniquement par les dons volontaires de sa communauté
              (voir la section « Soutenir le projet » sur la page d&apos;accueil). Nous sommes ouverts à
              des collaborations avec des organisations sérieuses et alignées avec notre mission
              d&apos;accessibilité de l&apos;information, à condition qu&apos;elles ne compromettent pas
              l&apos;indépendance ou la gratuité du contenu proposé aux utilisateurs. Pour toute proposition
              de partenariat, écris-nous via la page Contact.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
