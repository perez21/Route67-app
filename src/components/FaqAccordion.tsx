"use client";

import { useState, Fragment } from "react";

// Rend cliquables les mentions d'URL ou de "canada.ca" dans une réponse de
// FAQ, sans jamais interpréter le reste comme du HTML (le contenu vient de
// l'admin, mais on reste prudent : seuls les liens sont générés, rien n'est
// injecté tel quel).
function linkifyAnswer(text: string) {
  const pattern = /(https?:\/\/[^\s)]+|\bcanada\.ca\b)/gi;
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    if (!part) return null;
    const isUrl = /^https?:\/\//i.test(part);
    const isCanadaCa = /^canada\.ca$/i.test(part);
    if (isUrl || isCanadaCa) {
      const href = isUrl ? part : "https://www.canada.ca";
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rust underline"
        >
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

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
                <p className="whitespace-pre-wrap">{linkifyAnswer(item.answer)}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
