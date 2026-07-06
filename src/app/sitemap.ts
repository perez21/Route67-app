import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";

// Convention Next.js App Router : génère automatiquement /sitemap.xml.
// Liste toutes les pages publiques et indexables du site, plus les
// actualités publiées (contenu qui change régulièrement, donc le plus
// utile à signaler explicitement aux moteurs de recherche).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/procedure`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/procedure/test-de-langue`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/procedure/equivalence-diplome`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/procedure/creation-compte`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/simulateur`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/register`, changeFrequency: "yearly", priority: 0.6 },
  ];

  let newsPages: MetadataRoute.Sitemap = [];
  try {
    const news = await prisma.newsItem.findMany({
      select: { id: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 200,
    });
    newsPages = news.map((n) => ({
      url: `${siteUrl}/actualites/${n.id}`,
      lastModified: n.publishedAt,
      changeFrequency: "never" as const,
      priority: 0.6,
    }));
  } catch {
    // Si la base est momentanément indisponible, le sitemap reste valide
    // avec seulement les pages statiques plutôt que de faire échouer toute
    // la génération.
  }

  return [...staticPages, ...newsPages];
}
