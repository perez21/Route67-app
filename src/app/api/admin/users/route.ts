import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

async function requireStaff(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return null;
  return user;
}

export async function GET(request: NextRequest) {
  const staff = await requireStaff(request);
  if (!staff) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      tier: true,
      tierExpiresAt: true,
      warned: true,
      warningReason: true,
      createdAt: true,
      profile: { select: { crsScore: true } },
    },
  });

  return NextResponse.json({ users });
}

const updateSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["USER", "MODERATOR", "ADMIN"]).optional(),
  tier: z.enum(["FREE", "PREMIUM"]).optional(),
  // Avertissement affiché à côté du nom de l'utilisateur dans le forum,
  // pour un comportement inadéquat, sans supprimer le compte.
  warned: z.boolean().optional(),
  warningReason: z.string().trim().max(300).optional(),
  // Réinitialisation du mot de passe d'un autre compte — réservée à un ADMIN
  // (y compris pour changer le mot de passe d'un modérateur).
  newPassword: z
    .string()
    .min(10, "Le mot de passe doit contenir au moins 10 caractères.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
    .optional(),
});

// Un membre de l'équipe (admin ou modérateur) peut ajuster le forfait ou
// l'avertissement d'un utilisateur. Attribuer un rôle reste réservé à un
// ADMIN. Un modérateur ne peut effectuer AUCUNE opération sur un compte
// Administrateur (ni forfait, ni avertissement, ni rôle). Un administrateur
// ne peut pas non plus s'auto-rétrograder ni se retirer son propre forfait
// Premium — ces actions doivent venir d'un autre administrateur.
export async function PATCH(request: NextRequest) {
  const staff = await requireStaff(request);
  if (!staff) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const { userId, newPassword, ...data } = parsed.data;

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, tier: true, tierExpiresAt: true } });
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

  if (target.role === "ADMIN" && staff.role !== "ADMIN") {
    return NextResponse.json({ error: "Un modérateur ne peut effectuer aucune action sur un administrateur." }, { status: 403 });
  }

  if (data.role !== undefined && staff.role !== "ADMIN") {
    return NextResponse.json({ error: "Seul un administrateur peut attribuer un rôle." }, { status: 403 });
  }

  if (newPassword !== undefined && staff.role !== "ADMIN") {
    return NextResponse.json({ error: "Seul un administrateur peut modifier le mot de passe d'un autre compte." }, { status: 403 });
  }

  if (userId === staff.id && staff.role === "ADMIN") {
    if (data.role !== undefined && data.role !== "ADMIN") {
      return NextResponse.json({ error: "Tu ne peux pas retirer ton propre rôle d'administrateur." }, { status: 400 });
    }
    if (data.tier === "FREE") {
      return NextResponse.json({ error: "Tu ne peux pas retirer ton propre forfait Premium." }, { status: 400 });
    }
  }

  const updateData: Record<string, unknown> = { ...data };

  // Un passage manuel en Premium depuis l'admin donne aussi 1 mois de
  // validité (30 jours), avec la même logique de renouvellement que le don
  // en ligne : si un forfait est encore actif, on prolonge à partir de sa
  // date d'expiration existante plutôt que de repartir de zéro. Les comptes
  // Administrateur/Modérateur n'expirent jamais (pas de date posée).
  if (data.tier === "PREMIUM" && target.role === "USER") {
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const base =
      target.tier === "PREMIUM" && target.tierExpiresAt && target.tierExpiresAt.getTime() > Date.now()
        ? target.tierExpiresAt.getTime()
        : Date.now();
    updateData.tierExpiresAt = new Date(base + THIRTY_DAYS);
  } else if (data.tier === "FREE") {
    updateData.tierExpiresAt = null;
  }

  if (newPassword) {
    updateData.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  const user = await prisma.user.update({ where: { id: userId }, data: updateData });

  return NextResponse.json({ user: { ...user, passwordHash: undefined } });
}

// Suppression d'un compte utilisateur. Un modérateur peut supprimer un
// utilisateur ou un autre modérateur, mais jamais un administrateur.
export async function DELETE(request: NextRequest) {
  const staff = await requireStaff(request);
  if (!staff) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Utilisateur manquant." }, { status: 400 });

  if (userId === staff.id) {
    return NextResponse.json({ error: "Tu ne peux pas supprimer ton propre compte ici." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

  if (target.role === "ADMIN" && staff.role !== "ADMIN") {
    return NextResponse.json({ error: "Un modérateur ne peut pas supprimer un administrateur." }, { status: 403 });
  }

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
