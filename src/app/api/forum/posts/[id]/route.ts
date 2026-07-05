import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

// Suppression (douce) d'un message inadéquat par l'équipe — le message est
// marqué "supprimé" (affiché comme tel sous le nom de l'auteur) plutôt que
// retiré de la base, pour garder une trace de modération.
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const post = await prisma.forumPost.update({ where: { id: params.id }, data: { deleted: true } }).catch(() => null);
  return NextResponse.json({ ok: true, post });
}
