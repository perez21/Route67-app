"use client";

import { useEffect, useState } from "react";

type Message = { id: string; sender: "USER" | "TEAM"; content: string; createdAt: string; author?: { name: string; role: string } | null };
type Thread = {
  id: string;
  subject: string;
  resolved: boolean;
  createdAt: string;
  userId: string | null;
  guestName: string | null;
  guestEmail: string | null;
  user: { name: string; email: string; tier: "FREE" | "PREMIUM" } | null;
  lastMessage: string;
  messageCount: number;
};

export default function AdminChatManager({ initialThreads }: { initialThreads: Thread[] }) {
  const [threads, setThreads] = useState(initialThreads);
  const [openId, setOpenId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!openId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/admin/chat/${openId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.thread.messages ?? []);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [openId]);

  async function toggleOpen(id: string) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    setLoadingMessages(true);
    setReplyText("");
    setError(null);
    const res = await fetch(`/api/admin/chat/${id}`);
    setLoadingMessages(false);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.thread.messages ?? []);
    }
  }

  async function toggleResolved(id: string, resolved: boolean) {
    await fetch(`/api/admin/chat/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved }),
    });
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, resolved } : t)));
  }

  async function remove(id: string) {
    if (!window.confirm("Supprimer ce fil de discussion ? Cette action est définitive.")) return;
    await fetch(`/api/admin/chat/${id}`, { method: "DELETE" });
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (openId === id) setOpenId(null);
  }

  async function sendReply(id: string) {
    if (!replyText.trim()) return;
    setSending(true);
    setError(null);

    const res = await fetch(`/api/admin/chat/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyText }),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Impossible d'envoyer la réponse.");
      return;
    }

    const data = await res.json();
    setMessages((prev) => [...prev, data.message]);
    setReplyText("");
  }

  if (threads.length === 0) {
    return <p className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm text-charcoal/55">Aucune discussion pour le moment.</p>;
  }

  return (
    <div className="space-y-3">
      {threads.map((t) => {
        const name = t.user?.name ?? t.guestName ?? "Invité";
        const email = t.user?.email ?? t.guestEmail ?? "—";
        const isOpen = openId === t.id;

        return (
          <div key={t.id} className={`rounded-sm border p-4 ${t.resolved ? "border-charcoal/10 bg-white" : "border-gold/30 bg-gold/5"}`}>
            <button onClick={() => toggleOpen(t.id)} className="flex w-full flex-wrap items-center justify-between gap-2 text-left">
              <div>
                <p className="font-semibold text-ink">
                  {t.subject}
                  {!t.userId && <span className="ml-2 rounded-full bg-charcoal/10 px-2 py-0.5 text-[10px] uppercase text-charcoal/60">Invité</span>}
                  {t.userId && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] uppercase ${
                        t.user?.tier === "PREMIUM" ? "bg-gold/20 text-gold2" : "bg-charcoal/10 text-charcoal/60"
                      }`}
                    >
                      {t.user?.tier === "PREMIUM" ? "Premium" : "Gratuit"}
                    </span>
                  )}
                </p>
                <p className="text-xs text-charcoal/50">
                  {name} · {email} · {t.messageCount} message(s) · dernier : {t.lastMessage.slice(0, 80)}
                </p>
              </div>
              <span className="text-rust">{isOpen ? "▾" : "▸"}</span>
            </button>

            {isOpen && (
              <div className="mt-3 space-y-3 border-t border-charcoal/10 pt-3">
                <div className="flex justify-end gap-2">
                  <button onClick={() => toggleResolved(t.id, !t.resolved)} className="rounded-sm border border-forest/30 px-3 py-1.5 text-xs font-semibold text-forest">
                    {t.resolved ? "Marquer non traité" : "Marquer traité"}
                  </button>
                  <button onClick={() => remove(t.id)} className="rounded-sm border border-rust/30 px-3 py-1.5 text-xs font-semibold text-rust">
                    Supprimer
                  </button>
                </div>

                {loadingMessages ? (
                  <p className="text-sm text-charcoal/50">Chargement…</p>
                ) : (
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-sm bg-parchment2/40 p-3">
                    {messages.map((m) => (
                      <div key={m.id} className={`max-w-[85%] rounded-sm px-3 py-2 text-sm ${m.sender === "TEAM" ? "ml-auto bg-forest/10 text-charcoal" : "bg-white text-charcoal"}`}>
                        <p className="mb-1 font-mono text-[10px] uppercase text-charcoal/40">
                          {m.sender === "TEAM" ? `Équipe${m.author ? ` — ${m.author.name}` : ""}` : name} · {new Date(m.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                        </p>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Répondre à ${name}…`}
                    className="flex-1 rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
                  />
                  <button onClick={() => sendReply(t.id)} disabled={sending} className="rounded-sm bg-forest px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">
                    {sending ? "Envoi…" : "Répondre"}
                  </button>
                </div>
                {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
