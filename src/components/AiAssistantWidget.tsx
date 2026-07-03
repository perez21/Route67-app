"use client";

import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AiAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Bonjour 👋 Je suis l'assistant Route 67. Pose-moi une question sur l'Entrée express, le score CRS, les documents à préparer ou les délais — je réponds en quelques secondes.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;
    setError(null);
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/ai/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "L'assistant est momentanément indisponible.");
      return;
    }

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <div className="mb-3 flex h-[440px] w-[320px] flex-col overflow-hidden rounded-sm border border-charcoal/15 bg-white shadow-xl sm:w-[360px]">
          <div className="flex items-center justify-between bg-ink px-4 py-3 text-parchment">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cmr-green animate-pulseSoft" />
              <span className="font-display text-sm font-semibold">Assistant Route 67</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer l'assistant" className="text-parchment/60">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-sm px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user" ? "ml-auto bg-gold/15 text-charcoal" : "bg-parchment2 text-charcoal"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && <div className="text-xs text-charcoal/45">L&apos;assistant écrit…</div>}
            {error && <div className="rounded-sm bg-rust/10 px-3 py-2 text-xs text-rust">{error}</div>}
          </div>

          <div className="flex gap-2 border-t border-charcoal/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Pose ta question…"
              className="flex-1 rounded-sm border border-charcoal/15 px-3 py-2 text-sm"
            />
            <button
              onClick={send}
              disabled={loading}
              className="rounded-sm bg-gold px-3 py-2 text-sm font-semibold text-ink disabled:opacity-60"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-parchment shadow-lg"
      >
        <span className="h-2 w-2 rounded-full bg-cmr-yellow" />
        {open ? "Fermer" : "Assistant IA"}
      </button>
    </div>
  );
}
