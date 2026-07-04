"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EXPRESS_ENTRY_CATEGORIES } from "@/lib/expressEntryCategories";

type Draw = { id: string; number: number; category: string; minScore: number; invitations: number; date: string };

export default function AdminDrawsManager({ initialDraws }: { initialDraws: Draw[] }) {
  const router = useRouter();
  const [draws, setDraws] = useState(initialDraws);
  const [form, setForm] = useState({ number: "", category: "", minScore: "", invitations: "", date: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/draws", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: Number(form.number),
        category: form.category,
        minScore: Number(form.minScore),
        invitations: Number(form.invitations),
        date: new Date(form.date).toISOString(),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    const data = await res.json();
    setDraws((prev) => [data.draw, ...prev.filter((d) => d.number !== data.draw.number)]);
    setForm({ number: "", category: "", minScore: "", invitations: "", date: "" });
  }

  async function remove(id: string) {
    await fetch(`/api/admin/draws/${id}`, { method: "DELETE" });
    setDraws((prev) => prev.filter((d) => d.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="grid gap-3 rounded-sm border border-charcoal/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
        <input placeholder="N° tirage" required value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15" />
        <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15">
          <option value="" disabled>Catégorie…</option>
          {EXPRESS_ENTRY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Score min." required type="number" value={form.minScore} onChange={(e) => setForm({ ...form, minScore: e.target.value })} className="rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15" />
        <input placeholder="Invitations" required type="number" value={form.invitations} onChange={(e) => setForm({ ...form, invitations: e.target.value })} className="rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15" />
        <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15" />
        <button type="submit" disabled={loading} className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60 sm:col-span-2 lg:col-span-5">
          {loading ? "Publication…" : "Publier ce tirage"}
        </button>
      </form>
      {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}

      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-[11px] uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3">Tirage</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Score min.</th>
              <th className="px-4 py-3">Invitations</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {draws.map((d) => (
              <tr key={d.id} className="border-b border-charcoal/5">
                <td className="px-4 py-3 font-semibold text-gold">#{d.number}</td>
                <td className="px-4 py-3">{d.category}</td>
                <td className="px-4 py-3">{d.minScore}</td>
                <td className="px-4 py-3">{d.invitations}</td>
                <td className="px-4 py-3">{new Date(d.date).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(d.id)} className="text-xs font-semibold text-rust">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
