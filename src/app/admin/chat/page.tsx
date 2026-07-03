import { prisma } from "@/lib/db";
import AdminChatManager from "@/components/admin/AdminChatManager";

export default async function AdminChatPage() {
  const threads = await prisma.supportThread.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: true } },
    },
  });

  return (
    <AdminChatManager
      initialThreads={threads.map((t: {
        id: string;
        subject: string;
        resolved: boolean;
        createdAt: Date;
        userId: string | null;
        guestName: string | null;
        guestEmail: string | null;
        user: { name: string; email: string } | null;
        messages: { content: string }[];
        _count: { messages: number };
      }) => ({
        id: t.id,
        subject: t.subject,
        resolved: t.resolved,
        createdAt: t.createdAt.toISOString(),
        userId: t.userId,
        guestName: t.guestName,
        guestEmail: t.guestEmail,
        user: t.user,
        lastMessage: t.messages[0]?.content ?? "",
        messageCount: t._count.messages,
      }))}
    />
  );
}
