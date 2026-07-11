import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";

// Le forum (lecture et participation) est accessible à tout membre inscrit
// et connecté — ce n'est plus un avantage réservé aux membres Premium.
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  // Un membre non-admin voit les sujets approuvés + ses propres sujets encore
  // en attente de validation (pour suivre où en est sa proposition). Un admin
  // voit tout, y compris les sujets en attente des autres membres.
  const topics = await prisma.forumTopic.findMany({
    where:
      isStaff(user.role)
        ? undefined
        : { OR: [{ status: "APPROVED" }, { status: "PENDING", createdById: user.id }] },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    include: {
      createdBy: { select: { name: true, warned: true } },
      _count: { select: { posts: true } },
    },
  });

  return NextResponse.json({ topics, canParticipate: true });
}

const createTopicSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().max(2000).optional(),
  pinned: z.boolean().optional(),
});

// Un administrateur crée un sujet directement visible. Tout autre membre
// connecté peut aussi proposer un sujet, mais il reste en attente (PENDING)
// tant qu'un admin ne l'a pas validé dans /admin/forum — le forum reste
// encadré sans être réservé aux seuls admins.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (user.warned && !isStaff(user.role)) {
    return NextResponse.json(
      { error: "Ton compte a reçu un avertissement : tu ne peux plus publier sur le forum. Contacte l'équipe pour en savoir plus." },
      { status: 403 }
    );
  }

  // Limite la création de sujets par compte pour freiner le spam.
  const allowed = checkRateLimit(`forum-topic:${user.id}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de sujets créés récemment. Réessaie dans un moment." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createTopicSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const isAdmin = isStaff(user.role);
  const topic = await prisma.forumTopic.create({
    data: {
      ...parsed.data,
      createdById: user.id,
      status: isAdmin ? "APPROVED" : "PENDING",
      pinned: isAdmin ? parsed.data.pinned ?? false : false,
    },
  });

  return NextResponse.json({ topic, pendingApproval: !isAdmin }, { status: 201 });
}
