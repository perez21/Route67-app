"use client";

import { useState } from "react";

type Item = { id: string; question: string; answer: string; order: number };

export default function AdminFaqManager({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    const data = await res.json();
    setItems((prev) => [...prev, data.item]);
    setQuestion("");
    setAnswer("");
  }

  async function remove(id: string) {
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="space-y-3 rounded-sm border border-charcoal/10 bg-white p-5">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          required
          className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Réponse"
          rows={4}
          required
          className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
        />
        {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">
          {loading ? "Ajout…" : "Ajouter à la FAQ"}
        </button>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 rounded-sm border border-charcoal/10 bg-white p-4">
            <div>
              <p className="font-semibold text-ink">{item.question}</p>
              <p className="text-sm text-charcoal/60">{item.answer}</p>
            </div>
            <button onClick={() => remove(item.id)} className="flex-shrink-0 text-xs font-semibold text-rust">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
