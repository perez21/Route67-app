import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { consumeVerificationToken } from "@/lib/tokens";
import { checkRateLimit } from "@/lib/rateLimit";

const passwordSchema = z
  .string()
  .min(10, "Le mot de passe doit contenir au moins 10 caractères.")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.");

const schema = z.object({ token: z.string().min(10), password: passwordSchema });

export async function POST(request: NextRequest) {
  // Limite les tentatives par IP pour ralentir le bourrage de jetons de
  // réinitialisation (tentatives de deviner un token valide).
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const allowed = checkRateLimit(`reset-password:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans quelques minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const result = await consumeVerificationToken(parsed.data.token, "PASSWORD_RESET");
  if (!result) {
    return NextResponse.json({ error: "Ce lien de réinitialisation est invalide ou expiré." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({ where: { id: result.userId }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
