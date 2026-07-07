"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = { label: string; description: string; duration: string };

// Formulaire par étapes pour la ligne du temps de la procédure : affiche une
// seule étape à la fois avec une progression horizontale cliquable, plutôt
// que la longue liste verticale d'origine. Reste entièrement navigable au
// clavier et sans JavaScript côté contenu (chaque étape reste un texte
// normal, seule la navigation est interactive).
export default function ProcedureWizard({ steps }: { steps: Step[] }) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const total = steps.length;
  const step = steps[current];

  function goTo(index: number) {
    setCurrent(Math.max(0, Math.min(total - 1, index)));
  }

  return (
    <div className="rounded-md border border-charcoal/10 bg-white p-5 shadow-sm sm:p-8">
      {/* Barre de progression horizontale, cliquable pour sauter directement
          à une étape déjà vue. Défile horizontalement sur mobile plutôt que
          de se replier sur plusieurs lignes. */}
      <div className="scrollbar-hide -mx-1 mb-6 flex items-center gap-1 overflow-x-auto px-1 pb-2">
        {steps.map((s, i) => {
          const isDone = i < current;
          const isCurrent = i === current;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => goTo(i)}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`${t("procedure.stepOfTotal").replace("{current}", String(i + 1)).replace("{total}", String(total))} : ${s.label}`}
              title={s.label}
              className="group flex flex-shrink-0 items-center"
            >
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-colors ${
                  isCurrent
                    ? "bg-gold text-ink"
                    : isDone
                      ? "bg-forest text-white"
                      : "bg-parchment2 text-charcoal/50 group-hover:bg-parchment2/70"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
              </span>
              {i < total - 1 && (
                <span className={`h-[2px] w-5 flex-shrink-0 sm:w-8 ${isDone ? "bg-forest" : "bg-charcoal/10"}`} />
              )}
            </button>
          );
        })}
      </div>

      <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-rust">
        {t("procedure.stepOfTotal").replace("{current}", String(current + 1)).replace("{total}", String(total))}
      </p>
      <h3 className="mb-3 font-display text-lg font-semibold text-ink sm:text-xl">{step.label}</h3>
      <p className="mb-4 text-sm leading-relaxed text-charcoal/70">{step.description}</p>
      <p className="mb-6 inline-block rounded-sm bg-cmr-green/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-cmr-green">
        {t("procedure.durationLabel")} {step.duration}
      </p>

      <div className="flex items-center justify-between gap-3 border-t border-charcoal/10 pt-5">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="inline-flex items-center gap-1.5 rounded-sm border border-charcoal/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-parchment2/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {t("procedure.previous")}
        </button>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className="inline-flex items-center gap-1.5 rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("procedure.next")}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
