import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Route publique : alimente le bandeau d'actualités animé de la page
// d'accueil. Pas de session requise.
export async function GET() {
  const news = await prisma.newsItem.findMany({
    orderBy: { publishedAt: "desc" },
    take: 12,
  });
  return NextResponse.json({ news });
}
