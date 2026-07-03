"use client";

import { useState } from "react";

type Item = { id: string; label: string; done: boolean; completedAt: string | null };

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function AdminChecklistEditor({ userName, initialItems }: { userName: string; initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function update(id: string, data: Partial<{ done: boolean; completedAt: string | null }>) {
    setPendingId(id);
    const res = await fetch(`/api/admin/checklist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const result = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: result.item.done, completedAt: result.item.completedAt } : i)));
    }
    setPendingId(null);
  }

  const doneCount = items.filter((i) => i.done).length;
  const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div>
      <p className="mb-4 text-sm text-charcoal/60">
        Suivi de <strong className="text-ink">{userName}</strong> — {doneCount}/{items.length} étapes ({pct}%)
      </p>
      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-[11px] uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3 font-medium">Étape</th>
              <th className="px-4 py-3 font-medium">Fait</th>
              <th className="px-4 py-3 font-medium">Date d&apos;exécution</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-charcoal/5">
                <td className="px-4 py-3">{item.label}</td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={item.done}
                    disabled={pendingId === item.id}
                    onChange={(e) => update(item.id, { done: e.target.checked, completedAt: e.target.checked ? (item.completedAt ?? new Date().toISOString()) : null })}
                    className="h-4 w-4 accent-forest"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={toDateInputValue(item.completedAt)}
                    disabled={pendingId === item.id}
                    onChange={(e) => update(item.id, { completedAt: e.target.value || null, done: Boolean(e.target.value) })}
                    className="rounded-sm border border-charcoal/15 px-2 py-1.5 text-xs"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
