import { prisma } from "@/lib/db";
import NewTopicForm from "@/components/forum/NewTopicForm";
import AdminForumManager from "@/components/admin/AdminForumManager";

export default async function AdminForumPage() {
  const topics = await prisma.forumTopic.findMany({
    orderBy: [{ status: "asc" }, { pinned: "desc" }, { createdAt: "desc" }],
    include: { createdBy: { select: { name: true } }, _count: { select: { posts: true } } },
  });

  return (
    <div className="space-y-6">
      <NewTopicForm isAdmin />
      <AdminForumManager
        initialTopics={topics.map((t: { id: string; title: string; pinned: boolean; status: string; createdBy: { name: string }; _count: { posts: number } }) => ({
          id: t.id,
          title: t.title,
          pinned: t.pinned,
          status: t.status,
          postCount: t._count.posts,
          createdByName: t.createdBy.name,
        }))}
      />
    </div>
  );
}
