import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const slots = await prisma.availabilitySlot.findMany({ orderBy: [{ date: "asc" }, { startTime: "asc" }] });
  return NextResponse.json({ slots });
}

const createSchema = z.object({
  // Date précise (YYYY-MM-DD) — chaque disponibilité correspond à un jour
  // exact, pas à un jour de semaine récurrent.
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  if (parsed.data.startTime >= parsed.data.endTime) {
    return NextResponse.json({ error: "L'heure de fin doit être après l'heure de début." }, { status: 400 });
  }

  const slot = await prisma.availabilitySlot.create({
    data: {
      date: new Date(`${parsed.data.date}T00:00:00`),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
    },
  });
  return NextResponse.json({ slot }, { status: 201 });
}
