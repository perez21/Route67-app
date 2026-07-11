import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { consumeVerificationToken } from "@/lib/tokens";
import { checkRateLimit } from "@/lib/rateLimit";

const schema = z.object({ token: z.string().min(10) });

export async function POST(request: NextRequest) {
  // Limite les tentatives par IP pour ralentir le bourrage de jetons de
  // vérification d'email.
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const allowed = checkRateLimit(`verify-email:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans quelques minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Lien invalide." }, { status: 400 });

  const result = await consumeVerificationToken(parsed.data.token, "EMAIL_VERIFY");
  if (!result) {
    return NextResponse.json({ error: "Ce lien de vérification est invalide ou expiré." }, { status: 400 });
  }

  await prisma.user.update({ where: { id: result.userId }, data: { emailVerifiedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
