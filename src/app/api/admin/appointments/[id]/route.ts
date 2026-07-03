import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const updateSchema = z.object({
  status: z.enum(["CONFIRMED", "DECLINED", "CANCELLED"]),
  adminNote: z.string().trim().max(500).optional(),
  // Lien de visio (Google Meet, WhatsApp, Zoom...) communiqué à la personne
  // une fois le rendez-vous confirmé.
  meetingLink: z.string().trim().max(500).optional(),
});

// La confirmation, le refus ou l'annulation d'un rendez-vous est réservée à
// un ADMIN — un modérateur peut voir les demandes mais pas les traiter.
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  // Quand l'équipe refuse ou annule un rendez-vous, un petit message
  // d'excuse s'affiche automatiquement pour la personne si l'admin n'en a
  // pas rédigé un lui-même — pour ne jamais laisser un refus sans explication.
  const data = { ...parsed.data };
  if (!data.adminNote && (data.status === "DECLINED" || data.status === "CANCELLED")) {
    data.adminNote =
      data.status === "DECLINED"
        ? "Désolé, ce créneau ne convient finalement pas à l'équipe. Merci de choisir un autre horaire — nous serons ravis d'échanger avec toi."
        : "Désolé, nous devons annuler ce rendez-vous. Merci de choisir un autre horaire — nous serons ravis d'échanger avec toi.";
  }

  const existing = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 404 });

  const appointment = await prisma.appointment.update({ where: { id: params.id }, data });

  // Un refus signifie que l'admin n'est finalement pas libre à cette heure
  // précise : on retire ce créneau exact des disponibilités pour tout le
  // monde, plutôt que de le laisser réapparaître comme disponible.
  if (data.status === "DECLINED") {
    await prisma.blockedSlot.upsert({
      where: { datetime: existing.slot },
      update: {},
      create: { datetime: existing.slot },
    });
  }

  return NextResponse.json({ appointment });
}
