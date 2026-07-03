import { prisma } from "@/lib/db";
import AdminNewsManager from "@/components/admin/AdminNewsManager";

export default async function AdminNewsPage() {
  const news = await prisma.newsItem.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <AdminNewsManager
      initialNews={news.map((n: Awaited<ReturnType<typeof prisma.newsItem.findMany>>[number]) => ({
        id: n.id,
        title: n.title,
        summary: n.summary,
        sourceUrl: n.sourceUrl,
        imageUrl: n.imageUrl,
        aiGenerated: n.aiGenerated,
        publishedAt: n.publishedAt.toISOString(),
      }))}
    />
  );
}
