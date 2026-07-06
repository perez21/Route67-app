import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

// Convention Next.js App Router : ce fichier génère automatiquement
// /robots.txt. Bloque l'indexation des espaces privés (compte, admin,
// API) — inutile et potentiellement gênant que Google les explore — et
// autorise tout le reste (pages publiques d'information).
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/*",
        "/admin",
        "/admin/*",
        "/forum",
        "/forum/*",
        "/rendez-vous",
        "/api/*",
        "/mot-de-passe-oublie",
        "/reinitialiser-mot-de-passe",
        "/verifier-email",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
