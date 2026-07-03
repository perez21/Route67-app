import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Route publique : n'importe qui peut consulter les tirages, pas besoin
// de session. Triée par date de publication (createdAt) plutôt que par date
// du tirage, pour que le fil de notifications reste chronologiquement
// cohérent avec les actualités et le forum.
export async function GET() {
  const draws = await prisma.draw.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return NextResponse.json({ draws });
}
