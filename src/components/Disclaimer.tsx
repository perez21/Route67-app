"use client";

import { Fragment } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Variant = "default" | "compact" | "dark";

// Rend cliquables les mentions "canada.ca" (ou toute URL complète) dans le
// texte, sans jamais interpréter le reste comme du HTML.
function linkify(text: string) {
  const pattern = /(https?:\/\/[^\s)]+|\bcanada\.ca\b)/gi;
  return text.split(pattern).map((part, i) => {
    if (!part) return null;
    const isUrl = /^https?:\/\//i.test(part);
    const isCanadaCa = /^canada\.ca$/i.test(part);
    if (isUrl || isCanadaCa) {
      return (
        <a
          key={i}
          href={isUrl ? part : "https://www.canada.ca"}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

// Palette "info" bleue — standard d'interface actuel pour une note
// contextuelle neutre (le jaune/orange est généralement réservé aux
// avertissements actifs), avec un bon contraste texte/fond.
export default function Disclaimer({
  variant = "default",
  className = "",
}: {
  variant?: Variant | "procedure";
  className?: string;
}) {
  const { t } = useLanguage();
  const key = `disclaimer.${variant}`;
  const hasTranslation = variant === "default" || variant === "compact" || variant === "procedure";
  const text = hasTranslation ? t(key) : t("disclaimer.default");

  if (variant === "compact") {
    return <p className={`text-xs text-blue-900/70 ${className}`}>ℹ️ {linkify(text)}</p>;
  }

  return (
    <div className={`rounded-sm border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-900 ${className}`}>
      <strong className="text-blue-950">{t("disclaimer.label")}</strong>
      {linkify(text)}
    </div>
  );
}
