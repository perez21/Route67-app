import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { sendEmail, getMomoNumbers, getTeamContact } from "@/lib/mailer";

// MVP : aucune passerelle de paiement Mobile Money automatisée n'est branchée
// ici (voir README). Le flux est volontairement simple et humain, et ne crée
// AUCUNE demande tant que la personne n'a pas rempli et envoyé le formulaire :
// 1) clic sur "Devenir Premium" → affichage des numéros de paiement à l'écran
//    (aucune écriture en base à cette étape) ;
// 2) elle paie de son côté, saisit sa référence de transaction et clique sur
//    "Envoyer ma demande" → c'est CE moment qui crée l'UpgradeRequest ;
// 3) un administrateur vérifie et confirme dans /admin/utilisateurs.
const createSchema = z.object({
  momoOperator: z.enum(["orange_money", "mtn_momo", "paypal"]),
  momoReference: z.string().trim().min(2).max(80),
  momoName: z.string().trim().max(100).optional(),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (user.tier === "PREMIUM") {
    return NextResponse.json({ error: "Tu es déjà Premium — merci pour ton soutien !" }, { status: 409 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const existingPending = await prisma.upgradeRequest.findFirst({
    where: { userId: user.id, status: "PENDING" },
  });
  if (existingPending) {
    return NextResponse.json({ error: "Une demande est déjà en attente de confirmation par l'équipe." }, { status: 409 });
  }

  const upgradeRequest = await prisma.upgradeRequest.create({
    data: {
      userId: user.id,
      requestedTier: "PREMIUM",
      momoOperator: parsed.data.momoOperator,
      momoReference: parsed.data.momoReference,
      momoName: parsed.data.momoName,
    },
  });

  const contact = getTeamContact();
  await sendEmail({
    to: user.email,
    subject: "Route 67 — Ton don est en cours de vérification",
    html: `
      <p>Bonjour ${user.name},</p>
      <p>Merci pour ton don ! Nous avons bien reçu ta demande, avec la référence
      <strong>${parsed.data.momoReference}</strong>.</p>
      <p>Notre équipe vérifie le don et active ton accès Premium (forum + rendez-vous) sous peu.
      Pour toute question, écris-nous à ${contact.email}.</p>
      <p>— L'équipe Route 67</p>
    `,
  });

  return NextResponse.json({ upgradeRequest }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const requests = await prisma.upgradeRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests, momo: getMomoNumbers(), contact: getTeamContact() });
}
