import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

const updateSchema = z.object({ approve: z.boolean() });

// Confirme (ou rejette) une demande de passage à un forfait payant après
// vérification manuelle de la référence Mobile Money par l'admin. En cas
// d'approbation, le forfait de l'utilisateur est mis à jour immédiatement
// et une expiration à 30 jours est posée (renouvellement mensuel).
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentUser(request);
  if (!admin || !isStaff(admin.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const upgradeRequest = await prisma.upgradeRequest.findUnique({ where: { id: params.id } });
  if (!upgradeRequest) return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });

  const status = parsed.data.approve ? "APPROVED" : "REJECTED";

  let tierExpiresAt: Date | null = null;
  if (parsed.data.approve) {
    const targetUser = await prisma.user.findUnique({ where: { id: upgradeRequest.userId }, select: { tier: true, tierExpiresAt: true } });
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    // Renouvellement : si le forfait Premium est encore actif, on prolonge à
    // partir de sa date d'expiration existante plutôt que de repartir de
    // zéro à partir d'aujourd'hui — la personne ne perd aucun jour payé.
    const base =
      targetUser?.tier === "PREMIUM" && targetUser.tierExpiresAt && targetUser.tierExpiresAt.getTime() > Date.now()
        ? targetUser.tierExpiresAt.getTime()
        : Date.now();
    tierExpiresAt = new Date(base + THIRTY_DAYS);
  }

  const [updated] = await prisma.$transaction([
    prisma.upgradeRequest.update({ where: { id: params.id }, data: { status, reviewedAt: new Date() } }),
    ...(parsed.data.approve
      ? [
          prisma.user.update({
            where: { id: upgradeRequest.userId },
            data: { tier: upgradeRequest.requestedTier, tierExpiresAt },
          }),
        ]
      : []),
  ]);

  return NextResponse.json({ upgradeRequest: updated });
}
