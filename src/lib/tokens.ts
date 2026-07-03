import crypto from "crypto";
import { prisma } from "@/lib/db";

const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1h

export async function createVerificationToken(
  userId: string,
  type: "EMAIL_VERIFY" | "PASSWORD_RESET"
): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const ttl = type === "EMAIL_VERIFY" ? EMAIL_VERIFY_TTL_MS : PASSWORD_RESET_TTL_MS;

  // Invalide les jetons précédents du même type pour cet utilisateur, pour
  // qu'un seul lien à la fois soit valide (évite la confusion si plusieurs
  // emails sont redemandés).
  await prisma.verificationToken.updateMany({
    where: { userId, type, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.verificationToken.create({
    data: { token, type, userId, expiresAt: new Date(Date.now() + ttl) },
  });

  return token;
}

export async function consumeVerificationToken(
  token: string,
  type: "EMAIL_VERIFY" | "PASSWORD_RESET"
): Promise<{ userId: string } | null> {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.type !== type || record.usedAt || record.expiresAt.getTime() < Date.now()) {
    return null;
  }

  await prisma.verificationToken.update({ where: { token }, data: { usedAt: new Date() } });
  return { userId: record.userId };
}
