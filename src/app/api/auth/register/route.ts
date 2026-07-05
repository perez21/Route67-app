import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { FULL_PROCESS_STEPS } from "@/lib/checklistSteps";
import { createVerificationToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { getSiteUrl } from "@/lib/site";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Message volontairement générique : on ne confirme jamais qu'un
    // email précis est déjà utilisé, pour limiter l'énumération de comptes.
    return NextResponse.json(
      { error: "Impossible de créer ce compte avec ces informations." },
      { status: 409 }
    );
  }

  // Coût de hachage élevé (12) : compromis raisonnable entre sécurité et latence.
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      acceptedDisclaimerAt: new Date(),
      profile: { create: {} },
      checklistItems: {
        create: FULL_PROCESS_STEPS.map((step, i) => ({ label: step.label, description: step.description, order: i + 1 })),
      },
    },
  });

  const token = await createSessionToken({ userId: user.id, email: user.email });

  // Vérification d'email — n'empêche pas l'utilisation du compte (pas de
  // blocage d'accès), c'est une confirmation envoyée en tâche de fond.
  const verifyToken = await createVerificationToken(user.id, "EMAIL_VERIFY");
  const siteUrl = getSiteUrl();
  await sendEmail({
    to: user.email,
    subject: "Confirme ton email — Route 67",
    html: `
      <p>Bonjour ${user.name},</p>
      <p>Merci de rejoindre Route 67 ! Confirme ton adresse email en cliquant sur ce lien (valide 24h) :</p>
      <p><a href="${siteUrl}/verifier-email?token=${verifyToken}">${siteUrl}/verifier-email?token=${verifyToken}</a></p>
      <p>Si tu n'es pas à l'origine de cette inscription, ignore cet email.</p>
    `,
  });

  const response = NextResponse.json({ id: user.id, name: user.name, email: user.email });
  response.cookies.set(SESSION_COOKIE.name, token, {
    ...SESSION_COOKIE.options,
    maxAge: SESSION_COOKIE.maxAge,
  });
  return response;
}
