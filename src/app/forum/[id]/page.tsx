import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { expirePremiumIfNeeded, isStaff } from "@/lib/session";
import Navbar from "@/components/Navbar";
import ForumThread from "@/components/forum/ForumThread";
import AiAssistantWidget from "@/components/AiAssistantWidget";
import Disclaimer from "@/components/Disclaimer";

export default async function TopicPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const token = (await cookies()).get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  await expirePremiumIfNeeded(session.userId);
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true, tier: true, warned: true } });
  if (!user) redirect("/login");

  const isAdmin = isStaff(user.role);
  // Le forum est désormais accessible à tout membre inscrit et connecté —
  // ce n'est plus un avantage réservé aux membres Premium.

  const topic = await prisma.forumTopic.findUnique({
    where: { id: params.id },
    include: { createdBy: { select: { name: true, warned: true } } },
  });
  if (!topic) notFound();

  // Un sujet en attente ou rejeté n'est visible que par son auteur et l'équipe.
  const isOwner = topic.createdById === session.userId;
  if (topic.status !== "APPROVED" && !isAdmin && !isOwner) redirect("/forum");

  const posts = await prisma.forumPost.findMany({
    where: { topicId: params.id },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, role: true, warned: true } } },
  });

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Link href="/forum" className="mb-6 inline-block text-sm text-rust underline">← Retour au forum</Link>

        <Disclaimer variant="compact" className="mb-4" />

        <h1 className="mb-1 font-display text-2xl font-semibold text-ink">{topic.title}</h1>
        {topic.description && <p className="mb-4 text-sm text-charcoal/65">{topic.description}</p>}

        {topic.status === "PENDING" && (
          <div className="mb-6 rounded-sm border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm text-charcoal">
            Ce sujet est en attente de validation par l&apos;équipe — il n&apos;est visible que par toi.
          </div>
        )}
        {topic.status === "REJECTED" && (
          <div className="mb-6 rounded-sm border border-rust/30 bg-rust/5 px-4 py-2.5 text-sm text-rust">
            Ce sujet n&apos;a pas été validé par l&apos;équipe.
          </div>
        )}

        <p className="mb-6 font-mono text-[11px] text-charcoal/40">
          Ouvert par {topic.createdBy.name}
          {topic.createdBy.warned && <span className="ml-1.5 text-rust">⚠</span>}
        </p>

        <ForumThread
          topicId={topic.id}
          canParticipate={topic.status === "APPROVED" && !(user.warned && !isAdmin)}
          isAdmin={isAdmin}
          initialPosts={posts.map((p: { id: string; content: string; createdAt: Date; parentId: string | null; deleted: boolean; user: { name: string; role: string; warned: boolean } }) => ({
            id: p.id,
            content: p.content,
            createdAt: p.createdAt.toISOString(),
            parentId: p.parentId,
            deleted: p.deleted,
            user: p.user,
          }))}
        />
      </div>
      <AiAssistantWidget />
    </main>
  );
}
