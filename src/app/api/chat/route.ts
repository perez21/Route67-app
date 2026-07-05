import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff, isTierAtLeast } from "@/lib/session";
import { sendEmail, getTeamContact } from "@/lib/mailer";
import { checkRateLimit } from "@/lib/rateLimit";
import { chatEmailNotificationsEnabled } from "@/lib/site";

function canUseChat(user: { role: "USER" | "MODERATOR" | "ADMIN"; tier: "FREE" | "PREMIUM" }) {
  return isStaff(user.role) || isTierAtLeast(user.tier, "PREMIUM");
}

// Un utilisateur connecté a un seul fil de discussion persistant avec
// l'équipe (chat direct) — réservé aux membres Premium (et à l'équipe).
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (!canUseChat(user)) {
    return NextResponse.json({ error: "Le chat direct est réservé aux membres Premium." }, { status: 403 });
  }

  const thread = await prisma.supportThread.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json({ thread });
}

const sendSchema = z.object({ content: z.string().trim().min(1).max(3000) });

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (!canUseChat(user)) {
    return NextResponse.json({ error: "Le chat direct est réservé aux membres Premium." }, { status: 403 });
  }

  const allowed = checkRateLimit(`chat:${user.id}`, 30, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Trop de messages envoyés récemment. Réessaie dans un moment." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Message invalide." }, { status: 400 });

  let thread = await prisma.supportThread.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  const isNewThread = !thread;
  if (!thread) {
    thread = await prisma.supportThread.create({ data: { userId: user.id, subject: "Discussion avec l'équipe" } });
  } else if (thread.resolved) {
    // Un nouveau message de la personne rouvre automatiquement le fil côté
    // équipe — un fil "traité" ne doit pas rester marqué comme tel si la
    // conversation reprend.
    thread = await prisma.supportThread.update({ where: { id: thread.id }, data: { resolved: false } });
  }

  const message = await prisma.supportMessage.create({
    data: { threadId: thread.id, sender: "USER", content: parsed.data.content },
  });

  // Notifie l'équipe uniquement à l'ouverture du fil, pour ne pas spammer
  // une boîte mail à chaque message d'une conversation déjà suivie.
  if (isNewThread && chatEmailNotificationsEnabled()) {
    const team = getTeamContact();
    await sendEmail({
      to: team.email,
      subject: `[Route 67 · Chat] Nouveau message de ${user.name}`,
      html: `<p>${user.name} (${user.email}) a démarré une discussion :</p><p>${parsed.data.content.replace(/\n/g, "<br/>")}</p>`,
    });
  }

  return NextResponse.json({ thread, message }, { status: 201 });
}
