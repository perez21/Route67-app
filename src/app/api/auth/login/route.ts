import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { createSessionToken, createPendingTwoFactorToken, SESSION_COOKIE, PENDING_2FA_COOKIE } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  // Limite les tentatives par email pour ralentir le bourrage d'identifiants.
  const allowed = checkRateLimit(`login:${email}`, 8, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans quelques minutes." },
      { status: 429 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Message d'erreur volontairement identique dans les deux cas
  // (email inconnu vs mot de passe incorrect) pour ne pas révéler
  // si un compte existe avec cet email.
  const genericError = NextResponse.json(
    { error: "Email ou mot de passe incorrect." },
    { status: 401 }
  );

  if (!user) return genericError;

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) return genericError;

  // Comptes avec double authentification activée (Administrateur / Modérateur
  // uniquement en pratique) : le mot de passe seul ne suffit pas, on pose un
  // jeton temporaire de 5 minutes et on demande le code TOTP.
  if (user.totpEnabled) {
    const pendingToken = await createPendingTwoFactorToken({ userId: user.id, email: user.email });
    const response = NextResponse.json({ requires2FA: true });
    response.cookies.set(PENDING_2FA_COOKIE.name, pendingToken, {
      ...PENDING_2FA_COOKIE.options,
      maxAge: PENDING_2FA_COOKIE.maxAge,
    });
    return response;
  }

  const token = await createSessionToken({ userId: user.id, email: user.email });

  const response = NextResponse.json({ id: user.id, name: user.name, email: user.email });
  response.cookies.set(SESSION_COOKIE.name, token, {
    ...SESSION_COOKIE.options,
    maxAge: SESSION_COOKIE.maxAge,
  });
  return response;
}
