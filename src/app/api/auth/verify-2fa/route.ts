import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPendingTwoFactorToken, createSessionToken, SESSION_COOKIE, PENDING_2FA_COOKIE } from "@/lib/auth";
import { verifyTotpToken } from "@/lib/twoFactor";
import { checkRateLimit } from "@/lib/rateLimit";

const schema = z.object({ code: z.string().trim().min(6).max(6) });

export async function POST(request: NextRequest) {
  const pendingToken = request.cookies.get(PENDING_2FA_COOKIE.name)?.value;
  const pending = pendingToken ? await verifyPendingTwoFactorToken(pendingToken) : null;
  if (!pending) {
    return NextResponse.json({ error: "Session de vérification expirée, reconnecte-toi." }, { status: 401 });
  }

  const allowed = checkRateLimit(`2fa:${pending.userId}`, 8, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Trop de tentatives. Réessaie dans quelques minutes." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Code invalide." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: pending.userId } });
  if (!user || !user.totpEnabled || !user.totpSecret) {
    return NextResponse.json({ error: "Configuration 2FA introuvable." }, { status: 400 });
  }

  const valid = await verifyTotpToken(parsed.data.code, user.totpSecret);
  if (!valid) {
    return NextResponse.json({ error: "Code incorrect ou expiré." }, { status: 401 });
  }

  const token = await createSessionToken({ userId: user.id, email: user.email });
  const response = NextResponse.json({ id: user.id, name: user.name, email: user.email });
  response.cookies.set(SESSION_COOKIE.name, token, { ...SESSION_COOKIE.options, maxAge: SESSION_COOKIE.maxAge });
  response.cookies.delete(PENDING_2FA_COOKIE.name);
  return response;
}
