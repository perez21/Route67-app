import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { generateTotpSecret, getOtpAuthUrl, getQrCodeDataUrl } from "@/lib/twoFactor";

// Génère un nouveau secret TOTP (pas encore activé tant que /enable n'a pas
// vérifié un code valide) et renvoie le QR code à scanner avec Google
// Authenticator, Microsoft Authenticator, Authy, etc.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const secret = generateTotpSecret();
  await prisma.user.update({ where: { id: user.id }, data: { totpSecret: secret, totpEnabled: false } });

  const otpAuthUrl = getOtpAuthUrl(user.email, secret);
  const qrCodeDataUrl = await getQrCodeDataUrl(otpAuthUrl);

  return NextResponse.json({ secret, otpAuthUrl, qrCodeDataUrl });
}
