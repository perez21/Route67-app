import Navbar from "@/components/Navbar";
import NewsCarousel from "@/components/NewsCarousel";
import { prisma } from "@/lib/db";
import { getSocialLinks, getPremiumPrice } from "@/lib/site";
import { getMomoNumbers } from "@/lib/mailer";
import { HomeHeroText, HomeHeroCtas, HomeHeroExternalNote } from "@/components/home/HomeHero";
import {
  HomeDraws,
  HomeProcedureTeaser,
  HomeHowItWorks,
  HomeContactTeaser,
  HomeSupport,
  HomeFooter,
} from "@/components/home/HomeSections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrée express Canada : tirages, seuils CRS et simulateur",
  description:
    "Suis les derniers tirages Entrée express, calcule ton score CRS et comprends la procédure d'immigration canadienne étape par étape — gratuit, indépendant, à jour.",
};

export const revalidate = 120; // rafraîchit tirages + actualités toutes les 2 minutes

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
  const premiumPrice = getPremiumPrice();

  return (
    <main>
      <Navbar />

      {/* Hero — compact et mobile-first, façon "une" de journal */}
      <header className="relative overflow-hidden bg-ink px-4 py-10 text-parchment sm:px-6 sm:py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <HomeHeroText />

          {/* Une seule ligne, toujours — défilement horizontal plutôt que
              retour à la ligne, quelle que soit la largeur d'écran. */}
          <div className="scrollbar-hide -mx-4 mt-6 flex flex-nowrap gap-3 overflow-x-auto px-4 pb-2 sm:mt-8 sm:gap-4">
            <HomeHeroCtas />
          </div>
          <HomeHeroExternalNote />
        </div>
      </header>

      {/* Derniers tirages — l'info la plus recherchée par les visiteurs venant de Google,
          remontée juste sous le hero pour réduire le taux de rebond */}
      <HomeDraws draws={draws} />

      {/* Comment ça marche — pour les nouveaux visiteurs qui découvrent l'Entrée express,
          avant les articles qui supposent déjà une certaine connaissance du système */}
      <HomeHowItWorks />

      {/* Procédure Entrée express — étape logique suivante une fois le fonctionnement compris */}
      <HomeProcedureTeaser />

      {/* À la une — descendu après les infos essentielles ; les articles servent
          à approfondir plutôt qu'à répondre à une recherche urgente */}
      <NewsCarousel news={news} />

      {/* Contact teaser */}
      <HomeContactTeaser />

      {/* Soutenir le projet — don anonyme et avantages Premium */}
      <HomeSupport momo={momo} premiumPrice={premiumPrice} />

      <HomeFooter social={social} />
    </main>
  );
}
