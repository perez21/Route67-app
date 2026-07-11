import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isTierAtLeast } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const appointments = await prisma.appointment.findMany({
    where: { userId: user.id },
    orderBy: { slot: "desc" },
  });

  return NextResponse.json({ appointments });
}

const createSchema = z.object({
  // Créneau ISO choisi par l'utilisateur parmi les disponibilités publiées
  // (voir GET /api/appointments/availability).
  slot: z.string().datetime(),
  note: z.string().trim().max(500).optional(),
});

// Réservé aux comptes Premium : c'est l'avantage phare de ce forfait,
// un contact direct et planifié avec un administrateur/conseiller.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (!isTierAtLeast(user.tier, "PREMIUM")) {
    return NextResponse.json(
      { error: "La prise de rendez-vous est réservée au forfait Premium." },
      { status: 403 }
    );
  }

  if (user.warned) {
    return NextResponse.json(
      { error: "Ton compte a reçu un avertissement : tu ne peux plus prendre rendez-vous avec l'équipe. Contacte-nous pour en savoir plus." },
      { status: 403 }
    );
  }

  // Limite les tentatives de réservation répétées par compte (au-delà de la
  // règle métier "1 rendez-vous/semaine" plus bas, qui protège la base mais
  // n'empêche pas un client de marteler l'endpoint).
  const allowed = checkRateLimit(`appointments:${user.id}`, 15, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives de réservation récentes. Réessaie dans un moment." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const slotDate = new Date(parsed.data.slot);
  if (slotDate.getTime() < Date.now()) {
    return NextResponse.json({ error: "Ce créneau est déjà passé." }, { status: 400 });
  }

  // Maximum 1 rendez-vous actif par semaine civile (lundi → dimanche) par
  // utilisateur, pour garder un accès équitable à l'équipe entre tous les
  // membres Premium.
  const dayOfWeek = slotDate.getDay(); // 0 = dimanche
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(slotDate);
  weekStart.setDate(weekStart.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const countThisWeek = await prisma.appointment.count({
    where: {
      userId: user.id,
      status: { in: ["PENDING", "CONFIRMED"] },
      slot: { gte: weekStart, lt: weekEnd },
    },
  });
  if (countThisWeek >= 1) {
    return NextResponse.json(
      { error: "Tu as déjà un rendez-vous cette semaine-là — un seul est autorisé par semaine. Choisis une autre semaine." },
      { status: 409 }
    );
  }

  // Créneau explicitement retiré après un refus admin — plus proposé à personne.
  const isBlocked = await prisma.blockedSlot.findUnique({ where: { datetime: slotDate } });
  if (isBlocked) {
    return NextResponse.json({ error: "Ce créneau n'est plus disponible. Choisis-en un autre." }, { status: 409 });
  }

  // Capacité de ce créneau exact = nombre de plages de disponibilité admin
  // qui le couvrent (plusieurs administrateurs peuvent être libres en même
  // temps) ; on autorise la réservation tant que le nombre de rendez-vous
  // déjà actifs à cette heure n'a pas atteint cette capacité.
  const dateOnly = new Date(slotDate);
  dateOnly.setHours(0, 0, 0, 0);
  const availableWindows = await prisma.availabilitySlot.findMany({ where: { active: true, date: dateOnly } });
  const hhmm = slotDate.toTimeString().slice(0, 5);
  const capacity = availableWindows.filter((w: { startTime: string; endTime: string }) => hhmm >= w.startTime && hhmm < w.endTime).length;

  if (capacity === 0) {
    return NextResponse.json({ error: "Ce créneau n'est plus ouvert. Choisis-en un autre." }, { status: 409 });
  }

  const activeCount = await prisma.appointment.count({
    where: { slot: slotDate, status: { in: ["PENDING", "CONFIRMED"] } },
  });
  if (activeCount >= capacity) {
    return NextResponse.json({ error: "Ce créneau vient d'être pris. Choisis-en un autre." }, { status: 409 });
  }

  const appointment = await prisma.appointment.create({
    data: { slot: slotDate, note: parsed.data.note, userId: user.id },
  });

  return NextResponse.json({ appointment }, { status: 201 });
}
