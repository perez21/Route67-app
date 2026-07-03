import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// Un utilisateur peut annuler son propre rendez-vous (encore en attente ou
// confirmé) — ça libère le créneau et rouvre sa place au quota hebdomadaire.
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const appointment = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!appointment || appointment.userId !== user.id) {
    return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 404 });
  }

  if (!["PENDING", "CONFIRMED"].includes(appointment.status)) {
    return NextResponse.json({ error: "Ce rendez-vous ne peut plus être annulé." }, { status: 400 });
  }

  const updated = await prisma.appointment.update({ where: { id: params.id }, data: { status: "CANCELLED" } });
  return NextResponse.json({ appointment: updated });
}
