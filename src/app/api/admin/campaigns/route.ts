import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";
import { sendEmail, personalizeTemplate } from "@/lib/mailer";

// Limite de sécurité pour un MVP sans file d'attente dédiée : au-delà, une
// vraie plateforme d'envoi en masse (ou une tâche de fond) est recommandée
// pour éviter un dépassement de délai de la fonction serverless.
const MAX_RECIPIENTS_PER_CAMPAIGN = 500;

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const campaigns = await prisma.emailCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
  return NextResponse.json({ campaigns });
}

const createSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  // Peut contenir le gabarit {{name}}, remplacé par le prénom de chaque
  // destinataire (voir personalizeTemplate dans src/lib/mailer.ts).
  body: z.string().trim().min(10).max(5000),
  // "all" (tous), "premium" (Premium uniquement) ou "free" (Gratuit uniquement).
  audience: z.enum(["all", "premium", "free"]).default("all"),
});

// Campagne d'emailing simple : un admin/modérateur rédige un message (avec
// {{name}} en gabarit optionnel) et l'envoie à tout ou partie des
// utilisateurs ayant un email en base — pensé pour annoncer un événement
// ponctuel, pas pour un usage marketing récurrent à fort volume.
export async function POST(request: NextRequest) {
  const staff = await getCurrentUser(request);
  if (!staff || !isStaff(staff.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const where =
    parsed.data.audience === "premium" ? { tier: "PREMIUM" as const } : parsed.data.audience === "free" ? { tier: "FREE" as const } : {};

  const recipients = await prisma.user.findMany({ where, select: { name: true, email: true } });

  if (recipients.length === 0) {
    return NextResponse.json({ error: "Aucun destinataire pour cette audience." }, { status: 400 });
  }
  if (recipients.length > MAX_RECIPIENTS_PER_CAMPAIGN) {
    return NextResponse.json(
      { error: `Trop de destinataires (${recipients.length}) pour un envoi direct — limite actuelle : ${MAX_RECIPIENTS_PER_CAMPAIGN}. Voir le README pour une solution de montée en charge.` },
      { status: 400 }
    );
  }

  // Envoi séquentiel volontairement simple : chaque email est personnalisé
  // (nom + prénom) avant envoi via le même service que le reste du site
  // (src/lib/mailer.ts, Resend) — rien de nouveau à configurer.
  let sentCount = 0;
  let failedCount = 0;
  for (const recipient of recipients) {
    const personalizedBody = personalizeTemplate(parsed.data.body, recipient.name);
    const result = await sendEmail({
      to: recipient.email,
      subject: personalizeTemplate(parsed.data.subject, recipient.name),
      html: `<p>${personalizedBody.replace(/\n/g, "<br/>")}</p>`,
    });
    if (result.sent) sentCount += 1;
    else failedCount += 1;
  }

  const campaign = await prisma.emailCampaign.create({
    data: {
      subject: parsed.data.subject,
      body: parsed.data.body,
      recipientCount: recipients.length,
      sentCount,
      failedCount,
      sentByName: staff.name,
    },
  });

  return NextResponse.json({ campaign }, { status: 201 });
}
