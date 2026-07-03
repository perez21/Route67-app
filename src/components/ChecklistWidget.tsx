"use client";

import { useState } from "react";

type Item = { id: string; label: string; description: string | null; done: boolean; completedAt: string | Date | null };

export default function ChecklistWidget({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function toggle(item: Item) {
    setPendingId(item.id);
    const nextDone = !item.done;
    const nextDate = nextDone ? new Date().toISOString() : null;
    // Mise à jour optimiste de l'affichage, corrigée si l'appel échoue.
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, done: nextDone, completedAt: nextDate } : i)));

    const res = await fetch("/api/checklist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, done: nextDone }),
    });

    if (!res.ok) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, done: item.done, completedAt: item.completedAt } : i)));
    }
    setPendingId(null);
  }

  const doneCount = items.filter((i) => i.done).length;
  const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[11px] text-charcoal/45">{doneCount} / {items.length} étapes complétées</p>
        <p className="font-mono text-[11px] font-semibold text-forest">{pct}%</p>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-parchment2">
        <div className="h-full bg-gradient-to-r from-forest to-cmr-green transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="divide-y divide-charcoal/10">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 py-2.5 text-sm">
            <button
              onClick={() => toggle(item)}
              disabled={pendingId === item.id}
              aria-pressed={item.done}
              aria-label={item.done ? `Marquer "${item.label}" comme à faire` : `Marquer "${item.label}" comme fait`}
              className={`mt-0.5 h-[18px] w-[18px] flex-shrink-0 rounded-[3px] border-2 ${
                item.done ? "border-forest bg-forest" : "border-charcoal/20"
              }`}
            />
            <div className="min-w-0 flex-1">
              <span className={item.done ? "text-charcoal/40 line-through" : "text-charcoal"}>{item.label}</span>
              {item.description && !item.done && (
                <p className="mt-0.5 text-xs text-charcoal/45">{item.description}</p>
              )}
              {item.done && item.completedAt && (
                <p className="mt-0.5 font-mono text-[11px] text-forest/70">
                  ✓ le {new Date(item.completedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
