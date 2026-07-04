import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";
import { sendEmail } from "@/lib/mailer";

const replySchema = z.object({ content: z.string().trim().min(1).max(3000) });

// Réponse de l'équipe à un fil — le message reste visible dans
// /dashboard/chat si la personne est connectée (userId renseigné), ET un
// email est envoyé à son adresse (compte ou invité) dans tous les cas.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentUser(request);
  if (!admin || !isStaff(admin.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = replySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Réponse invalide." }, { status: 400 });

  const thread = await prisma.supportThread.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!thread) return NextResponse.json({ error: "Fil introuvable." }, { status: 404 });

  const message = await prisma.supportMessage.create({
    data: { threadId: thread.id, sender: "TEAM", content: parsed.data.content, authorId: admin.id },
    include: { author: { select: { name: true, role: true } } },
  });

  const recipientEmail = thread.user?.email ?? thread.guestEmail;
  const recipientName = thread.user?.name ?? thread.guestName ?? "";
  let emailSent = false;
  if (recipientEmail) {
    const result = await sendEmail({
      to: recipientEmail,
      subject: `Re : ${thread.subject} — Route 67`,
      html: `
        <p>Bonjour ${recipientName},</p>
        <p>Voici la réponse de l'équipe Route 67 :</p>
        <blockquote style="border-left:3px solid #C89B3C;padding-left:12px;margin-left:0;">${parsed.data.content.replace(/\n/g, "<br/>")}</blockquote>
        ${thread.userId ? `<p style="color:#888;font-size:12px;">Retrouve toute la discussion dans ton espace Route 67 (Chat avec l'équipe).</p>` : ""}
      `,
    });
    emailSent = result.sent;
  }

  return NextResponse.json({ message, emailSent });
}
