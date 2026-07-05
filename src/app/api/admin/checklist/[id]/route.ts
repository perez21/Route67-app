import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

const updateSchema = z.object({
  done: z.boolean().optional(),
  // Date au format "YYYY-MM-DD" (input type="date"), ou null pour effacer.
  completedAt: z.string().nullable().optional(),
});

// Permet à un administrateur de corriger la date d'exécution d'une étape du
// suivi d'un utilisateur (ex. étape réalisée avant l'inscription sur Route 67,
// ou erreur de saisie) — utile en support, sans passer par la base directement.
export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const admin = await getCurrentUser(request);
  if (!admin || !isStaff(admin.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const item = await prisma.checklistItem.findUnique({ where: { id: params.id }, select: { userId: true } });
  if (!item) return NextResponse.json({ error: "Étape introuvable." }, { status: 404 });

  const owner = await prisma.user.findUnique({ where: { id: item.userId }, select: { role: true } });
  if (owner?.role === "ADMIN" && admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Un modérateur ne peut pas modifier le suivi d'un administrateur." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const data: { done?: boolean; completedAt?: Date | null } = {};
  if (parsed.data.done !== undefined) data.done = parsed.data.done;
  if (parsed.data.completedAt !== undefined) {
    data.completedAt = parsed.data.completedAt ? new Date(parsed.data.completedAt) : null;
  }

  const updated = await prisma.checklistItem.update({ where: { id: params.id }, data });
  return NextResponse.json({ item: updated });
}
