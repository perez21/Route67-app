import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { verifyTotpToken } from "@/lib/twoFactor";
import { checkRateLimit } from "@/lib/rateLimit";

const schema = z.object({ code: z.string().trim().min(6).max(6) });

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  // Limite les tentatives par compte pour empêcher le bourrage du code TOTP
  // à 6 chiffres (même logique que /auth/verify-2fa).
  const allowed = checkRateLimit(`2fa-enable:${user.id}`, 8, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans quelques minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Code invalide." }, { status: 400 });

  const full = await prisma.user.findUnique({ where: { id: user.id } });
  if (!full?.totpSecret) {
    return NextResponse.json({ error: "Lance d'abord la configuration (QR code)." }, { status: 400 });
  }

  if (!(await verifyTotpToken(parsed.data.code, full.totpSecret))) {
    return NextResponse.json({ error: "Code incorrect. Vérifie l'heure de ton téléphone et réessaie." }, { status: 401 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { totpEnabled: true } });
  return NextResponse.json({ ok: true });
}
