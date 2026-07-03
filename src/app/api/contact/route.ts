import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { sendEmail, getTeamContact } from "@/lib/mailer";
import { checkRateLimit } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(3000),
});

// Espace Contact public (pas besoin de compte). Si la personne est connectée,
// le message rejoint son fil de discussion persistant avec l'équipe (visible
// ensuite dans /dashboard/chat) au lieu de créer un message isolé — sinon,
// un fil "invité" ponctuel est créé. Dans tous les cas le message est
// enregistré même si l'envoi email échoue ou n'est pas configuré.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const allowed = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Trop de messages envoyés récemment. Réessaie dans un moment." }, { status: 429 });
  }

  const token = request.cookies.get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;

  let thread;
  if (session) {
    // Un seul fil persistant par utilisateur connecté — on le retrouve ou le
    // crée, puis on y ajoute le message (c'est le même fil que /dashboard/chat).
    thread = await prisma.supportThread.findFirst({ where: { userId: session.userId }, orderBy: { createdAt: "desc" } });
    if (!thread) {
      thread = await prisma.supportThread.create({
        data: { userId: session.userId, subject: parsed.data.subject },
      });
    } else if (thread.resolved) {
      thread = await prisma.supportThread.update({ where: { id: thread.id }, data: { resolved: false } });
    }
  } else {
    thread = await prisma.supportThread.create({
      data: { subject: parsed.data.subject, guestName: parsed.data.name, guestEmail: parsed.data.email },
    });
  }

  await prisma.supportMessage.create({
    data: { threadId: thread.id, sender: "USER", content: parsed.data.message },
  });

  const team = getTeamContact();
  const emailResult = await sendEmail({
    to: team.email,
    subject: `[Route 67 · Contact] ${parsed.data.subject}`,
    html: `
      <p><strong>De :</strong> ${parsed.data.name} (${parsed.data.email})</p>
      <p><strong>Sujet :</strong> ${parsed.data.subject}</p>
      <p><strong>Message :</strong></p>
      <p>${parsed.data.message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  return NextResponse.json({ threadId: thread.id, emailSent: emailResult.sent }, { status: 201 });
}
