import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { verifyTotpToken } from "@/lib/twoFactor";

const schema = z.object({ code: z.string().trim().min(6).max(6) });

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Code invalide." }, { status: 400 });

  const full = await prisma.user.findUnique({ where: { id: user.id } });
  if (!full?.totpSecret || !full.totpEnabled) {
    return NextResponse.json({ error: "La 2FA n'est pas active." }, { status: 400 });
  }

  if (!(await verifyTotpToken(parsed.data.code, full.totpSecret))) {
    return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { totpEnabled: false, totpSecret: null } });
  return NextResponse.json({ ok: true });
}
