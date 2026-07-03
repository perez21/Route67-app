import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { checklistUpdateSchema } from "@/lib/validation";

async function getSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE.name)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const items = await prisma.checklistItem.findMany({
    where: { userId: session.userId },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ items });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = checklistUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  // On vérifie que l'élément appartient bien à l'utilisateur connecté
  // avant de le modifier, pour empêcher qu'un utilisateur modifie la
  // checklist d'un autre en devinant un identifiant.
  const item = await prisma.checklistItem.findUnique({ where: { id: parsed.data.id } });
  if (!item || item.userId !== session.userId) {
    return NextResponse.json({ error: "Élément introuvable." }, { status: 404 });
  }

  const updated = await prisma.checklistItem.update({
    where: { id: parsed.data.id },
    data: { done: parsed.data.done, completedAt: parsed.data.done ? new Date() : null },
  });

  return NextResponse.json({ item: updated });
}
