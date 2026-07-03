import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";
import { LAST_KNOWN_THRESHOLD } from "@/lib/crs";

// Le middleware garantit déjà qu'on arrive ici authentifié, mais on
// revérifie ici : ne jamais faire confiance uniquement au middleware
// pour l'autorisation d'une route sensible.
async function getSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE.name)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { userId: session.userId } });
  return NextResponse.json({ profile, threshold: LAST_KNOWN_THRESHOLD });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  const profile = await prisma.profile.upsert({
    where: { userId: session.userId },
    update: parsed.data,
    create: { userId: session.userId, ...parsed.data },
  });

  return NextResponse.json({ profile });
}
