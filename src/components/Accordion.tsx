"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

type AccordionItem = {
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
  icon?: ReactNode;
};

export default function Accordion({ items, linkText = "Lire le guide détaillé →" }: { items: AccordionItem[]; linkText?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-charcoal/10 rounded-sm border border-charcoal/10 bg-white">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <div className="flex items-start gap-3">
                {item.icon && (
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-rust">
                    {item.icon}
                  </span>
                )}
                <div>
                  {item.eyebrow && <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-rust">{item.eyebrow}</p>}
                  <span className="font-display text-base font-semibold text-ink sm:text-lg">{item.title}</span>
                </div>
              </div>
              <span className={`flex-shrink-0 font-mono text-lg text-charcoal/40 transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-charcoal/70">
                <p className="mb-3 leading-relaxed">{item.description}</p>
                <Link href={item.href} className="inline-flex items-center gap-1 font-semibold text-rust underline">
                  {linkText}
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
