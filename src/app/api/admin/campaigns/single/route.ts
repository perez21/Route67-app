import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";
import { sendEmail, personalizeTemplate } from "@/lib/mailer";

const singleSchema = z.object({
  // Nom optionnel, utilisé uniquement pour remplacer {{name}} dans le
  // gabarit — contrairement aux campagnes de masse, le destinataire n'a pas
  // forcément de compte en base (on envoie à une adresse libre).
  name: z.string().trim().max(120).optional(),
  to: z.string().trim().email("Adresse email invalide."),
  subject: z.string().trim().min(3).max(200),
  body: z.string().trim().min(10).max(5000),
});

// Envoi ponctuel à une seule adresse — pensé pour répondre individuellement
// à quelqu'un (ex. suite à un message de contact) sans passer par le flux
// de campagne de masse ci-dessus. Journalisé dans la même table
// EmailCampaign (recipientCount = 1) pour apparaître dans l'historique.
export async function POST(request: NextRequest) {
  const staff = await getCurrentUser(request);
  if (!staff || !isStaff(staff.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = singleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const displayName = parsed.data.name?.trim() || parsed.data.to;
  const personalizedBody = personalizeTemplate(parsed.data.body, displayName);
  const personalizedSubject = personalizeTemplate(parsed.data.subject, displayName);

  const result = await sendEmail({
    to: parsed.data.to,
    subject: personalizedSubject,
    html: `<p>${personalizedBody.replace(/\n/g, "<br/>")}</p>`,
  });

  if (!result.sent) {
    return NextResponse.json(
      { error: "L'envoi a échoué. Vérifie l'adresse ou réessaie plus tard." },
      { status: 502 }
    );
  }

  const campaign = await prisma.emailCampaign.create({
    data: {
      subject: `${parsed.data.subject} (à ${parsed.data.to})`,
      body: parsed.data.body,
      recipientCount: 1,
      sentCount: 1,
      failedCount: 0,
      sentByName: staff.name,
    },
  });

  return NextResponse.json({ campaign }, { status: 201 });
}
