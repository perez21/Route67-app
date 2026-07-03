import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE, SessionPayload } from "@/lib/auth";

export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE.name)?.value;
  return token ? verifySessionToken(token) : null;
}

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "MODERATOR" | "ADMIN";
  tier: "FREE" | "PREMIUM";
  warned: boolean;
};

// Un modérateur a les mêmes privilèges qu'un administrateur pour la gestion
// courante (actualités, forum, rendez-vous, tirages, messages, avertissements,
// forfaits), à l'exception de deux actions réservées à l'ADMIN : attribuer
// des rôles et supprimer un compte administrateur — voir /api/admin/users.
export function isStaff(role: CurrentUser["role"]): boolean {
  return role === "ADMIN" || role === "MODERATOR";
}

// Le forfait Premium se réinitialise après 1 mois (voir tierExpiresAt posé
// à +30 jours lors de la confirmation d'un paiement, dans
// /api/admin/upgrade-requests/[id]). Cette vérification "paresseuse" — faite
// à chaque connexion/consultation plutôt que par une tâche planifiée — évite
// de dépendre d'un cron externe : dès qu'un compte Premium expiré est lu, il
// est automatiquement repassé en Gratuit avant que la donnée soit utilisée.
export async function expirePremiumIfNeeded(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tier: true, tierExpiresAt: true } });
  if (user?.tier === "PREMIUM" && user.tierExpiresAt && user.tierExpiresAt.getTime() < Date.now()) {
    await prisma.user.update({ where: { id: userId }, data: { tier: "FREE", tierExpiresAt: null } });
  }
}

// Revérifie systématiquement le rôle/forfait en base de données plutôt que
// de leur faire confiance depuis le jeton de session, qui ne contient que
// l'identité. Un rôle ADMIN ne doit jamais pouvoir être falsifié côté client.
export async function getCurrentUser(request: NextRequest): Promise<CurrentUser | null> {
  const session = await getSessionFromRequest(request);
  if (!session) return null;

  await expirePremiumIfNeeded(session.userId);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, tier: true, warned: true },
  });

  return user;
}

export function isTierAtLeast(tier: CurrentUser["tier"], min: CurrentUser["tier"]): boolean {
  const order: CurrentUser["tier"][] = ["FREE", "PREMIUM"];
  return order.indexOf(tier) >= order.indexOf(min);
}
