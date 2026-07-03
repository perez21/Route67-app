import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminChecklistEditor from "@/components/admin/AdminChecklistEditor";

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const viewer = session ? await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } }) : null;

  const user = await prisma.user.findUnique({ where: { id: params.id }, select: { id: true, name: true, email: true, tier: true, role: true } });
  if (!user) notFound();

  // Un modérateur ne peut consulter ni modifier le suivi d'un administrateur.
  if (user.role === "ADMIN" && viewer?.role !== "ADMIN") redirect("/admin/utilisateurs");

  const items = await prisma.checklistItem.findMany({ where: { userId: params.id }, orderBy: { order: "asc" } });

  return (
    <div>
      <Link href="/admin/utilisateurs" className="mb-6 inline-block text-sm text-rust underline">← Retour aux utilisateurs</Link>
      <h2 className="mb-1 font-display text-xl font-semibold text-ink">{user.name}</h2>
      <p className="mb-6 text-sm text-charcoal/50">{user.email} · {user.tier === "PREMIUM" ? "Premium" : "Gratuit"}</p>

      <AdminChecklistEditor
        userName={user.name}
        initialItems={items.map((i: { id: string; label: string; done: boolean; completedAt: Date | null }) => ({
          id: i.id,
          label: i.label,
          done: i.done,
          completedAt: i.completedAt ? i.completedAt.toISOString() : null,
        }))}
      />
    </div>
  );
}
