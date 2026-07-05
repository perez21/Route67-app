import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.draw.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
