import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";
import { createVerificationToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { getSiteUrl } from "@/lib/site";

// Même limite de sécurité que les campagnes email (voir
// src/app/api/admin/campaigns/route.ts) : un envoi direct et séquentiel
// convient pour un MVP, mais reste borné pour éviter un dépassement de
// délai de la fonction serverless sur un très grand nombre de comptes.
const MAX_RECIPIENTS = 500;

// Ne renvoie pas un nouveau lien à quelqu'un qui en a déjà reçu un très
// récemment (ex. someone qui vient de s'inscrire il y a 10 minutes) —
// évite de spammer une boîte mail si l'admin relance l'action plusieurs
// fois par erreur.
const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000; // 3 jours

// Renvoi en masse du lien de vérification d'email à tous les comptes dont
// l'email n'est pas encore vérifié. Action manuelle déclenchée par un
// admin/modérateur depuis /admin/utilisateurs, avec confirmation côté
// interface avant l'appel.
export async function POST(request: NextRequest) {
  const staff = await getCurrentUser(request);
  if (!staff || !isStaff(staff.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const unverifiedUsers = await prisma.user.findMany({
    where: { emailVerifiedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      verificationTokens: {
        where: { type: "EMAIL_VERIFY" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  if (unverifiedUsers.length === 0) {
    return NextResponse.json({ error: "Aucun email non vérifié pour le moment." }, { status: 400 });
  }
  if (unverifiedUsers.length > MAX_RECIPIENTS) {
    return NextResponse.json(
      { error: `Trop de destinataires (${unverifiedUsers.length}) pour un envoi direct — limite actuelle : ${MAX_RECIPIENTS}.` },
      { status: 400 }
    );
  }

  const siteUrl = getSiteUrl();
  let sentCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const user of unverifiedUsers) {
    const lastSentAt = user.verificationTokens[0]?.createdAt ?? null;
    if (lastSentAt && Date.now() - lastSentAt.getTime() < COOLDOWN_MS) {
      skippedCount += 1;
      continue;
    }

    const verifyToken = await createVerificationToken(user.id, "EMAIL_VERIFY");
    const result = await sendEmail({
      to: user.email,
      subject: "Confirme ton email — Route 67",
      html: `
        <p>Bonjour ${user.name},</p>
        <p>Nous n'avons pas encore reçu la confirmation de ton adresse email. Clique sur ce
        lien pour la confirmer (valide 24h) :</p>
        <p><a href="${siteUrl}/verifier-email?token=${verifyToken}">${siteUrl}/verifier-email?token=${verifyToken}</a></p>
        <p>Si tu as déjà confirmé ton email ou si tu n'es pas à l'origine de cette inscription, ignore cet email.</p>
      `,
    });

    if (result.sent) sentCount += 1;
    else failedCount += 1;
  }

  return NextResponse.json({ sentCount, skippedCount, failedCount, total: unverifiedUsers.length });
}
