import { prisma } from "@/lib/db";
import AdminDrawsManager from "@/components/admin/AdminDrawsManager";

export default async function AdminDrawsPage() {
  const draws = await prisma.draw.findMany({ orderBy: { date: "desc" } });

  return (
    <AdminDrawsManager
      initialDraws={draws.map((d: Awaited<ReturnType<typeof prisma.draw.findMany>>[number]) => ({
        id: d.id,
        number: d.number,
        category: d.category,
        minScore: d.minScore,
        invitations: d.invitations,
        date: d.date.toISOString(),
      }))}
    />
  );
}
