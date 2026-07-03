import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Chaque plage ouverte par l'admin (ex. 09:00–12:00 le 14 juillet) est
// découpée en créneaux de 30 minutes, chacun rattaché à cette date précise.
const SLOT_STEP_MINUTES = 30;

// Calcule tous les créneaux à venir à partir des disponibilités datées
// ouvertes par l'admin (AvailabilitySlot). Si PLUSIEURS plages se recoupent
// sur le même horaire exact (plusieurs administrateurs disponibles en même
// temps), la capacité de ce créneau augmente d'autant — deux personnes
// différentes peuvent alors réserver la même heure, chacune "occupant" un
// des administrateurs disponibles. Un créneau explicitement refusé par un
// admin (BlockedSlot) est totalement retiré, pour tout le monde.
export async function GET() {
  const now = new Date();

  const [slots, taken, blocked] = await Promise.all([
    prisma.availabilitySlot.findMany({ where: { active: true, date: { gte: new Date(now.toDateString()) } } }),
    prisma.appointment.findMany({
      where: { status: { in: ["PENDING", "CONFIRMED"] }, slot: { gte: now } },
      select: { slot: true },
    }),
    prisma.blockedSlot.findMany({ where: { datetime: { gte: now } }, select: { datetime: true } }),
  ]);

  const blockedTimes = new Set(blocked.map((b: { datetime: Date }) => b.datetime.toISOString()));

  // Capacité par horaire exact = nombre de plages admin qui le couvrent.
  const capacityByTime = new Map<string, number>();
  for (const slot of slots) {
    const [startH, startM] = slot.startTime.split(":").map(Number);
    const [endH, endM] = slot.endTime.split(":").map(Number);

    const windowStart = new Date(slot.date);
    windowStart.setHours(startH, startM, 0, 0);
    const windowEnd = new Date(slot.date);
    windowEnd.setHours(endH, endM, 0, 0);

    for (let t = new Date(windowStart); t.getTime() < windowEnd.getTime(); t.setMinutes(t.getMinutes() + SLOT_STEP_MINUTES)) {
      if (t.getTime() <= now.getTime()) continue;
      const iso = new Date(t).toISOString();
      if (blockedTimes.has(iso)) continue;
      capacityByTime.set(iso, (capacityByTime.get(iso) ?? 0) + 1);
    }
  }

  const takenCountByTime = new Map<string, number>();
  for (const a of taken) {
    const iso = a.slot.toISOString();
    takenCountByTime.set(iso, (takenCountByTime.get(iso) ?? 0) + 1);
  }

  const all = Array.from(capacityByTime.entries())
    .map(([iso, capacity]) => ({ iso, taken: (takenCountByTime.get(iso) ?? 0) >= capacity }))
    .sort((a, b) => a.iso.localeCompare(b.iso));

  return NextResponse.json({ slots: all.slice(0, 400) });
}
