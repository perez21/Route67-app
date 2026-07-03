import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

export function generateTotpSecret(): string {
  return generateSecret();
}

export function getOtpAuthUrl(email: string, secret: string): string {
  return generateURI({ issuer: "Route 67", label: email, secret });
}

export async function getQrCodeDataUrl(otpAuthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpAuthUrl);
}

export async function verifyTotpToken(token: string, secret: string): Promise<boolean> {
  try {
    // epochTolerance de 30s : tolère un léger décalage d'horloge entre le
    // téléphone de la personne et le serveur.
    const result = await verify({ token, secret, epochTolerance: 30 });
    return result.valid;
  } catch {
    return false;
  }
}
