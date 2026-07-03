import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createVerificationToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { checkRateLimit } from "@/lib/rateLimit";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

// Réponse volontairement identique que l'email existe ou non, pour ne pas
// permettre l'énumération de comptes.
const genericResponse = NextResponse.json({
  message: "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.",
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Email invalide." }, { status: 400 });

  const allowed = checkRateLimit(`forgot-password:${parsed.data.email}`, 5, 15 * 60 * 1000);
  if (!allowed) return genericResponse; // même réponse, pas d'indice sur le rate limit

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return genericResponse;

  const token = await createVerificationToken(user.id, "PASSWORD_RESET");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  await sendEmail({
    to: user.email,
    subject: "Réinitialise ton mot de passe — Route 67",
    html: `
      <p>Bonjour ${user.name},</p>
      <p>Tu as demandé à réinitialiser ton mot de passe. Ce lien est valide 1 heure :</p>
      <p><a href="${siteUrl}/reinitialiser-mot-de-passe?token=${token}">${siteUrl}/reinitialiser-mot-de-passe?token=${token}</a></p>
      <p>Si tu n'es pas à l'origine de cette demande, ignore simplement cet email.</p>
    `,
  });

  return genericResponse;
}
