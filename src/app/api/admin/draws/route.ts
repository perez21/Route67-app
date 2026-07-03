import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

const createSchema = z.object({
  number: z.number().int().positive(),
  category: z.string().trim().min(2).max(120),
  minScore: z.number().int().min(0).max(1200),
  invitations: z.number().int().min(0),
  date: z.string().datetime(),
});

// Permet à un administrateur de publier un nouveau tirage Entrée express
// dès l'annonce d'IRCC, sans passer par un script de seed manuel.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const draw = await prisma.draw.upsert({
    where: { number: parsed.data.number },
    update: { ...parsed.data, date: new Date(parsed.data.date) },
    create: { ...parsed.data, date: new Date(parsed.data.date) },
  });

  return NextResponse.json({ draw }, { status: 201 });
}
