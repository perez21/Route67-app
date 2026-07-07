import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/dictionary";

// Contenu long-format (guides détaillés Procédure) : gardé en JSX riche
// (gras, listes, liens externes) plutôt que dans le dictionnaire de
// traduction plat, pour ne pas perdre la mise en forme. Chaque guide
// fournit une version "fr" et une version "en" de cette structure.
export type GuideBlock =
  | { type: "p"; text: string; muted?: boolean }
  | { type: "ul"; items: string[] }
  | { type: "link"; href: string; text: string };

export type GuideSection = {
  heading: string;
  blocks: GuideBlock[];
};

export type GuideContent = {
  backLink: string;
  stepLabel: string;
  title: string;
  sections: GuideSection[];
  nextStepIntro: string;
  nextStepHref: string;
  nextStepLinkText: string;
};

export type BilingualGuide = Record<Locale, GuideContent>;

// Convertit une syntaxe légère **gras** et [texte](url) en <strong> / <a>,
// pour permettre du texte enrichi (sigles en gras, liens en ligne) à partir
// d'une chaîne simple stockée dans la structure de contenu.
export function renderRich(text: string): ReactNode {
  const tokenPattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenPattern);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="font-semibold text-rust underline">
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function GuideSections({ sections }: { sections: GuideSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink">{section.heading}</h2>
          {section.blocks.map((block, i) => {
            if (block.type === "p") {
              return (
                <p key={i} className={`mt-3 first:mt-0 ${block.muted ? "text-sm text-charcoal/60" : ""}`}>
                  {renderRich(block.text)}
                </p>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="mt-3 list-disc space-y-1.5 pl-5 first:mt-0">
                  {block.items.map((item, j) => (
                    <li key={j}>{renderRich(item)}</li>
                  ))}
                </ul>
              );
            }
            return (
              <a
                key={i}
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-semibold text-rust underline"
              >
                {block.text}
              </a>
            );
          })}
        </section>
      ))}
    </>
  );
}
