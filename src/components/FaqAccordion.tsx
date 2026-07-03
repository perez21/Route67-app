"use client";

import { useState } from "react";

export default function FaqAccordion({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) {
    return <p className="rounded-sm border border-charcoal/10 bg-white p-6 text-sm text-charcoal/55">Aucune question pour le moment.</p>;
  }

  return (
    <div className="divide-y divide-charcoal/10 rounded-sm border border-charcoal/10 bg-white">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-display text-base font-semibold text-ink">{item.question}</span>
              <span className={`flex-shrink-0 font-mono text-lg text-charcoal/40 transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-charcoal/70">
                <p className="whitespace-pre-wrap">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
