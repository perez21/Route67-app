import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const thread = await prisma.supportThread.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true, role: true } } } },
    },
  });
  if (!thread) return NextResponse.json({ error: "Fil introuvable." }, { status: 404 });

  return NextResponse.json({ thread });
}

const updateSchema = z.object({ resolved: z.boolean() });

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const thread = await prisma.supportThread.update({ where: { id: params.id }, data: { resolved: parsed.data.resolved } });
  return NextResponse.json({ thread });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.supportThread.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
