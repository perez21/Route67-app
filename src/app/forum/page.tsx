import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isTierAtLeast, expirePremiumIfNeeded, isStaff } from "@/lib/session";
import Navbar from "@/components/Navbar";
import NewTopicForm from "@/components/forum/NewTopicForm";
import AiAssistantWidget from "@/components/AiAssistantWidget";
import Disclaimer from "@/components/Disclaimer";

export default async function ForumPage() {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  await expirePremiumIfNeeded(session.userId);
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true, tier: true, warned: true } });
  if (!user) redirect("/login");

  const isAdmin = isStaff(user.role);
  const hasAccess = isAdmin || isTierAtLeast(user.tier, "PREMIUM");

  // Le forum (lecture ET participation) est réservé aux membres Premium —
  // c'est l'un des avantages concrets du soutien financier au projet.
  if (!hasAccess) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Entraide entre candidats</p>
          <h1 className="mb-4 font-display text-3xl font-semibold text-ink">Forum Route 67</h1>
          <div className="mx-auto max-w-md rounded-sm border border-gold/30 bg-gold/10 p-6 text-sm text-charcoal">
            Le forum d&apos;entraide est réservé aux membres <strong>Premium</strong>, le forfait qui
            soutient financièrement Route 67 (hébergement, maintenance, temps de l&apos;équipe).
            <Link href="/dashboard#don" className="mt-4 block rounded-sm bg-gold px-5 py-2.5 font-semibold text-ink">
              Devenir Premium
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Membre non-admin : sujets approuvés + ses propres sujets en attente ou
  // rejetés (pour qu'il suive le statut de sa proposition). Admin : tout.
  const topics = await prisma.forumTopic.findMany({
    where: isAdmin ? undefined : { OR: [{ status: "APPROVED" }, { status: { in: ["PENDING", "REJECTED"] }, createdById: session.userId }] },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    include: { createdBy: { select: { name: true, warned: true } }, _count: { select: { posts: true } } },
  });

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Entraide entre candidats · Premium</p>
            <h1 className="font-display text-3xl font-semibold text-ink">Forum Route 67</h1>
          </div>
          {!isAdmin && user.warned ? (
            <span className="rounded-sm bg-rust/10 px-3 py-2 text-xs font-semibold text-rust">
              ⚠ Ton compte a reçu un avertissement — tu ne peux plus publier sur le forum.
            </span>
          ) : (
            <NewTopicForm isAdmin={isAdmin} />
          )}
        </div>
        <Disclaimer variant="compact" className="mb-6" />

        <div className="space-y-3">
          {topics.length === 0 ? (
            <p className="rounded-sm border border-charcoal/10 bg-white p-6 text-sm text-charcoal/55">
              Aucun sujet pour le moment.
            </p>
          ) : (
            topics.map((topic: { id: string; title: string; description: string | null; pinned: boolean; status: string; createdBy: { name: string; warned: boolean }; _count: { posts: number } }) => (
              <Link
                key={topic.id}
                href={`/forum/${topic.id}`}
                className="flex items-center justify-between rounded-sm border border-charcoal/10 bg-white p-5"
              >
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {topic.pinned && <span className="rounded-full bg-cmr-yellow/25 px-2 py-0.5 text-[10px] font-semibold uppercase text-cmr-greenDeep">Épinglé</span>}
                    {topic.status === "PENDING" && <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-gold">En attente de validation</span>}
                    {topic.status === "REJECTED" && <span className="rounded-full bg-rust/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-rust">Rejeté</span>}
                    <h2 className="font-display text-lg font-semibold text-ink">{topic.title}</h2>
                  </div>
                  {topic.description && <p className="text-sm text-charcoal/60">{topic.description}</p>}
                  <p className="mt-1.5 font-mono text-[11px] text-charcoal/40">
                    Ouvert par {topic.createdBy.name}
                    {topic.createdBy.warned && <span className="ml-1.5 text-rust">⚠</span>} · {topic._count.posts} réponse(s)
                  </p>
                </div>
                <span className="text-rust">→</span>
              </Link>
            ))
          )}
        </div>
      </div>
      <AiAssistantWidget />
    </main>
  );
}
