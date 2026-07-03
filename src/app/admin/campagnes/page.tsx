import { prisma } from "@/lib/db";
import AdminCampaignsManager from "@/components/admin/AdminCampaignsManager";

export default async function AdminCampaignsPage() {
  const [campaigns, allCount, premiumCount, freeCount] = await Promise.all([
    prisma.emailCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.user.count(),
    prisma.user.count({ where: { tier: "PREMIUM" } }),
    prisma.user.count({ where: { tier: "FREE" } }),
  ]);

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm text-charcoal/65">
        Envoie un email à tous les utilisateurs (ou à un sous-groupe) pour annoncer un événement —
        par exemple une session live, un changement important, ou une mise à jour des tirages.
      </p>
      <AdminCampaignsManager
        initialCampaigns={campaigns.map((c: { id: string; subject: string; body: string; recipientCount: number; sentCount: number; failedCount: number; sentByName: string; createdAt: Date }) => ({
          id: c.id,
          subject: c.subject,
          body: c.body,
          recipientCount: c.recipientCount,
          sentCount: c.sentCount,
          failedCount: c.failedCount,
          sentByName: c.sentByName,
          createdAt: c.createdAt.toISOString(),
        }))}
        userCounts={{ all: allCount, premium: premiumCount, free: freeCount }}
      />
    </div>
  );
}
