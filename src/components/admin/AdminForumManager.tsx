"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Topic = { id: string; title: string; pinned: boolean; status: string; postCount: number; createdByName: string };

export default function AdminForumManager({ initialTopics }: { initialTopics: Topic[] }) {
  const router = useRouter();
  const [topics, setTopics] = useState(initialTopics);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function remove(id: string) {
    await fetch(`/api/forum/topics/${id}`, { method: "DELETE" });
    setTopics((prev) => prev.filter((t) => t.id !== id));
    router.refresh();
  }

  async function moderate(id: string, status: "APPROVED" | "REJECTED") {
    setPendingId(id);
    await fetch(`/api/forum/topics/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    setPendingId(null);
    router.refresh();
  }

  const pending = topics.filter((t) => t.status === "PENDING");
  const rest = topics.filter((t) => t.status !== "PENDING");

  return (
    <div className="space-y-8">
      {pending.length > 0 && (
        <div>
          <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-rust">
            Sujets proposés en attente ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-gold/30 bg-gold/5 p-4">
                <div>
                  <Link href={`/forum/${t.id}`} className="font-semibold text-ink hover:underline">{t.title}</Link>
                  <p className="text-xs text-charcoal/50">Proposé par {t.createdByName}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moderate(t.id, "APPROVED")}
                    disabled={pendingId === t.id}
                    className="rounded-sm bg-forest px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => moderate(t.id, "REJECTED")}
                    disabled={pendingId === t.id}
                    className="rounded-sm border border-rust/30 px-3 py-1.5 text-xs font-semibold text-rust disabled:opacity-60"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">Tous les sujets</h3>
        <div className="space-y-3">
          {rest.length === 0 ? (
            <p className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm text-charcoal/55">Aucun sujet pour le moment.</p>
          ) : (
            rest.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-sm border border-charcoal/10 bg-white p-4">
                <div>
                  <Link href={`/forum/${t.id}`} className="font-semibold text-ink hover:underline">{t.title}</Link>
                  <p className="text-xs text-charcoal/50">
                    {t.postCount} réponse(s) · ouvert par {t.createdByName}
                    {t.status === "REJECTED" && <span className="ml-2 text-rust">· rejeté</span>}
                  </p>
                </div>
                <button onClick={() => remove(t.id)} className="text-xs font-semibold text-rust">Supprimer</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
