import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const posts = await prisma.forumPost.findMany({
    where: { topicId: params.id },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, role: true, warned: true } } },
  });

  const topic = await prisma.forumTopic.findUnique({ where: { id: params.id } });
  if (!topic) return NextResponse.json({ error: "Sujet introuvable." }, { status: 404 });

  return NextResponse.json({ topic, posts });
}

const createPostSchema = z.object({
  content: z.string().trim().min(1).max(3000),
  // Si renseigné, ce message est une réponse imbriquée à un autre message du
  // même sujet (un seul niveau de profondeur, voir ForumThread côté client).
  parentId: z.string().min(1).optional(),
});

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (user.warned && !isStaff(user.role)) {
    return NextResponse.json(
      { error: "Ton compte a reçu un avertissement : tu ne peux plus écrire sur le forum. Contacte l'équipe pour en savoir plus." },
      { status: 403 }
    );
  }

  // Limite la publication de messages par compte pour freiner le spam.
  const allowed = checkRateLimit(`forum-post:${user.id}`, 20, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de messages envoyés récemment. Réessaie dans un moment." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Message invalide." }, { status: 400 });
  }

  const topic = await prisma.forumTopic.findUnique({ where: { id: params.id } });
  if (!topic) return NextResponse.json({ error: "Sujet introuvable." }, { status: 404 });

  // On ne peut répondre qu'à un sujet déjà validé par l'équipe — un sujet
  // proposé par un membre Premium reste en lecture seule tant qu'il est en
  // attente de validation.
  if (topic.status !== "APPROVED" && !isStaff(user.role)) {
    return NextResponse.json({ error: "Ce sujet est en attente de validation par l'équipe." }, { status: 403 });
  }

  if (parsed.data.parentId) {
    const parent = await prisma.forumPost.findUnique({ where: { id: parsed.data.parentId } });
    if (!parent || parent.topicId !== params.id) {
      return NextResponse.json({ error: "Message parent introuvable." }, { status: 404 });
    }
  }

  const post = await prisma.forumPost.create({
    data: { content: parsed.data.content, topicId: params.id, userId: user.id, parentId: parsed.data.parentId },
    include: { user: { select: { name: true, role: true, warned: true } } },
  });

  return NextResponse.json({ post }, { status: 201 });
}
