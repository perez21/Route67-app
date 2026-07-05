import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import UpgradeRequestsList from "@/components/admin/UpgradeRequestsList";

const ROLE_ORDER: Record<string, number> = { ADMIN: 0, MODERATOR: 1, USER: 2 };

export default async function AdminUsersPage() {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const viewer = session ? await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } }) : null;
  const viewerIsAdmin = viewer?.role === "ADMIN";
  const viewerId = session?.userId ?? "";

  const [users, upgradeRequests] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, tier: true, tierExpiresAt: true, warned: true, emailVerifiedAt: true, profile: { select: { crsScore: true } } },
    }),
    prisma.upgradeRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  // Admins en tête, puis modérateurs, puis utilisateurs — chaque groupe trié
  // par ordre alphabétique du nom.
  const sortedUsers = [...users].sort((a, b) => {
    const roleDiff = (ROLE_ORDER[a.role] ?? 3) - (ROLE_ORDER[b.role] ?? 3);
    if (roleDiff !== 0) return roleDiff;
    return a.name.localeCompare(b.name, "fr");
  });

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
          Demandes de forfait en attente ({upgradeRequests.length})
        </h2>
        <UpgradeRequestsList
          requests={upgradeRequests.map((r: { id: string; requestedTier: string; momoOperator: string | null; momoReference: string | null; momoName: string | null; createdAt: Date; user: { name: string; email: string } }) => ({
            id: r.id,
            requestedTier: r.requestedTier,
            momoOperator: r.momoOperator,
            momoReference: r.momoReference,
            momoName: r.momoName,
            createdAt: r.createdAt.toISOString(),
            user: r.user,
          }))}
        />
      </section>

      <section>
        <h2 className="mb-1 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
          Tous les utilisateurs ({sortedUsers.length}) — admins, puis modérateurs, puis utilisateurs (A→Z)
        </h2>
        <p className="mb-4 text-xs text-charcoal/50">
          {sortedUsers.filter((u) => u.emailVerifiedAt !== null).length} email(s) vérifié(s) ·{" "}
          {sortedUsers.filter((u) => u.emailVerifiedAt === null).length} non vérifié(s)
        </p>
        <AdminUsersTable
          viewerIsAdmin={viewerIsAdmin}
          viewerId={viewerId}
          users={sortedUsers.map((u: { id: string; name: string; email: string; role: "USER" | "MODERATOR" | "ADMIN"; tier: "FREE" | "PREMIUM"; tierExpiresAt: Date | null; warned: boolean; emailVerifiedAt: Date | null; profile: { crsScore: number } | null }) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            tier: u.tier,
            tierExpiresAt: u.tierExpiresAt ? u.tierExpiresAt.toISOString() : null,
            warned: u.warned,
            emailVerified: u.emailVerifiedAt !== null,
            crsScore: u.profile?.crsScore ?? null,
          }))}
        />
      </section>
    </div>
  );
}
