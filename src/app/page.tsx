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

      {/* À la une — remonté juste sous le hero, avec images, défilement horizontal sur mobile */}
      <NewsCarousel news={news} />

      {/* Derniers tirages */}
      <HomeDraws draws={draws} />

      {/* Procédure Entrée express — bande déroulante */}
      <HomeProcedureTeaser />

      {/* Comment ça marche */}
      <HomeHowItWorks />

      {/* Contact teaser */}
      <HomeContactTeaser />

      {/* Soutenir le projet — don anonyme et avantages Premium */}
      <HomeSupport momo={momo} premiumPrice={premiumPrice} />

      <HomeFooter social={social} />
    </main>
  );
}
