import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

// Suppression d'un sujet — réservée à l'administrateur (ex. sujet en
// doublon ou hors-charte). Les réponses associées sont supprimées en
// cascade (voir onDelete: Cascade dans le schéma Prisma).
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  await prisma.forumTopic.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

const moderateSchema = z.object({ status: z.enum(["APPROVED", "REJECTED"]) });

// Valide ou rejette un sujet proposé par un membre Premium.
export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = moderateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const topic = await prisma.forumTopic.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json({ topic });
}
