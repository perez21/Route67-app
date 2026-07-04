"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Message = { id: string; sender: "USER" | "TEAM"; content: string; createdAt: string };
type Thread = { id: string; subject: string; resolved: boolean; messages: Message[] } | null;

const POLL_INTERVAL_MS = 3000; // actualisation quasi instantanée par sondage léger

export default function ChatWithTeam() {
  const [thread, setThread] = useState<Thread>(null);
  const [loadingThread, setLoadingThread] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(0);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/chat");
    if (res.ok) {
      const data = await res.json();
      setThread(data.thread);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoadingThread(false));
    // Sondage régulier pour que les réponses de l'équipe apparaissent sans
    // que la personne ait besoin de recharger la page (pas de WebSocket ici,
    // mais l'effet est quasi instantané à cet intervalle court).
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    const count = thread?.messages.length ?? 0;
    if (count !== messageCountRef.current) {
      messageCountRef.current = count;
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [thread]);

  async function send() {
    if (!content.trim()) return;
    setError(null);
    setSending(true);
    const toSend = content;
    setContent("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: toSend }),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Impossible d'envoyer ce message.");
      setContent(toSend);
      return;
    }

    await refresh();
  }

  if (loadingThread) {
    return <p className="text-sm text-charcoal/50">Chargement de la discussion…</p>;
  }

  return (
    <div className="space-y-4">
      <div ref={scrollRef} className="max-h-[480px] space-y-3 overflow-y-auto rounded-sm border border-charcoal/10 bg-parchment2/30 p-4">
        {!thread || thread.messages.length === 0 ? (
          <p className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm text-charcoal/55">
            Aucun message pour le moment — écris à l&apos;équipe ci-dessous, on te répond
            personnellement.
          </p>
        ) : (
          thread.messages.map((m) => (
            <div key={m.id} className={`max-w-[85%] rounded-sm px-3.5 py-2.5 text-sm leading-relaxed ${
              m.sender === "USER" ? "ml-auto bg-gold/15 text-charcoal" : "bg-white text-charcoal"
            }`}>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-charcoal/40">
                {m.sender === "USER" ? "Toi" : "Équipe Route 67"} ·{" "}
                {new Date(m.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écris ton message…"
          className="flex-1 rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
        />
        <button onClick={send} disabled={sending} className="rounded-sm bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60">
          {sending ? "Envoi…" : "Envoyer"}
        </button>
      </div>
      {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
      <p className="text-xs text-charcoal/45">
        Une réponse de l&apos;équipe t&apos;arrive aussi par email, en plus de rester ici.
      </p>
    </div>
  );
}
