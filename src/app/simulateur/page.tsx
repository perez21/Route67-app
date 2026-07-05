"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import LanguageSkillsSelect from "@/components/simulateur/LanguageSkillsSelect";

const EDUCATION_OPTIONS = [
  { value: "LT_SECONDARY", label: "Études secondaires non complétées" },
  { value: "SECONDARY", label: "Diplôme d'études secondaires" },
  { value: "ONE_YEAR", label: "Diplôme postsecondaire d'un an" },
  { value: "TWO_YEAR", label: "Diplôme postsecondaire de deux ans" },
  { value: "BACHELOR", label: "Baccalauréat (3 ans ou plus)" },
  { value: "TWO_OR_MORE", label: "Deux diplômes ou plus (dont un de 3 ans+)" },
  { value: "MASTER_OR_PROFESSIONAL", label: "Maîtrise ou diplôme professionnel" },
  { value: "DOCTORATE", label: "Doctorat (Ph. D.)" },
];

const FIRST_LANG_OPTIONS = [
  { value: "LT4", label: "Moins que NCLC 4" },
  { value: "L4_5", label: "NCLC 4 ou 5" },
  { value: "L6", label: "NCLC 6" },
  { value: "L7", label: "NCLC 7" },
  { value: "L8", label: "NCLC 8" },
  { value: "L9", label: "NCLC 9" },
  { value: "L10P", label: "NCLC 10 ou plus" },
];

const SECOND_LANG_OPTIONS = [
  { value: "LT4", label: "Moins que NCLC 4" },
  { value: "L5_6", label: "NCLC 5 ou 6" },
  { value: "L7_8", label: "NCLC 7 ou 8" },
  { value: "L9P", label: "NCLC 9 ou plus" },
];

const CDN_WORK_OPTIONS = [0, 1, 2, 3, 4, 5].map((y) => ({ value: String(y), label: y === 0 ? "Aucune" : y === 5 ? "5 ans ou plus" : `${y} an(s)` }));
const FOREIGN_WORK_OPTIONS = [0, 1, 2, 3].map((y) => ({ value: String(y), label: y === 0 ? "Aucune" : y === 3 ? "3 ans ou plus" : `${y} an(s)` }));

const defaultSkills = { speaking: "L9", listening: "L9", reading: "L9", writing: "L9" };
const defaultSecondSkills = { speaking: "LT4", listening: "LT4", reading: "LT4", writing: "LT4" };

type Breakdown = {
  core: { age: number; education: number; firstLanguage: number; secondLanguage: number; canadianWork: number; subtotal: number; cap: number };
  spouse: { subtotal: number; cap: number };
  transferability: { education: number; foreignExperience: number; certificate: number; subtotal: number; cap: number };
  additional: { sibling: number; french: number; canadianStudy: number; provincialNomination: number; subtotal: number; cap: number };
  total: number;
};

export default function SimulateurPage() {
  const [hasSpouse, setHasSpouse] = useState(false);
  const [age, setAge] = useState(29);
  const [education, setEducation] = useState("BACHELOR");
  const [firstLanguageIsFrench, setFirstLanguageIsFrench] = useState(false);
  const [firstLanguage, setFirstLanguage] = useState(defaultSkills);
  const [secondLanguageTested, setSecondLanguageTested] = useState(false);
  const [secondLanguage, setSecondLanguage] = useState(defaultSecondSkills);
  const [canadianWorkExperienceYears, setCanadianWorkExperienceYears] = useState(0);
  const [foreignWorkExperienceYears, setForeignWorkExperienceYears] = useState(3);
  const [hasCertificateOfQualification, setHasCertificateOfQualification] = useState(false);
  const [spouseEducation, setSpouseEducation] = useState("BACHELOR");
  const [spouseLanguage, setSpouseLanguage] = useState(defaultSkills);
  const [spouseCanadianWorkExperienceYears, setSpouseCanadianWorkExperienceYears] = useState(0);
  const [hasSiblingInCanada, setHasSiblingInCanada] = useState(false);
  const [canadianStudy, setCanadianStudy] = useState("NONE");
  const [hasProvincialNomination, setHasProvincialNomination] = useState(false);

  const [result, setResult] = useState<{
    score: number;
    maxScore: number;
    threshold: number;
    saved: boolean;
    breakdown: Breakdown;
    eligibility: { eligible: boolean; reasons: string[] };
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hasSpouse,
        age,
        education,
        firstLanguage,
        firstLanguageIsFrench,
        secondLanguageTested,
        secondLanguage: secondLanguageTested ? secondLanguage : undefined,
        canadianWorkExperienceYears,
        foreignWorkExperienceYears,
        hasCertificateOfQualification,
        spouse: hasSpouse
          ? { education: spouseEducation, firstLanguage: spouseLanguage, canadianWorkExperienceYears: spouseCanadianWorkExperienceYears }
          : undefined,
        hasSiblingInCanada,
        canadianStudy,
        hasProvincialNomination,
      }),
    });

    setLoading(false);
    if (res.ok) setResult(await res.json());
  }

  const pct = result ? Math.min(100, (result.score / result.maxScore) * 100) : 0;

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Grille officielle SCG / CRS</p>
        <h1 className="mb-3 font-display text-2xl font-semibold text-ink sm:text-3xl">Simulateur de score CRS complet</h1>
        <p className="mb-4 max-w-2xl text-sm text-charcoal/65">
          Calqué sur la grille officielle du Système de classement global d&apos;IRCC (capital
          humain, facteurs du conjoint, transférabilité des compétences, points supplémentaires).
          La même grille que reproduit l&apos;outil Canadavisa.
        </p>
        <Disclaimer className="mb-8" />

        <div className="grid gap-7 lg:grid-cols-[1fr_340px]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Situation familiale */}
            <section className="rounded-md border border-charcoal/10 bg-white p-5 shadow-sm sm:p-6">
              <label className="flex items-center justify-between text-sm font-semibold text-ink">
                <span>Inclure un époux ou conjoint(e) de fait qui t&apos;accompagne</span>
                <input type="checkbox" checked={hasSpouse} onChange={(e) => setHasSpouse(e.target.checked)} className="h-5 w-5 accent-forest" />
              </label>
              <p className="mt-1 text-xs text-charcoal/50">
                Coche seulement si ton époux/conjoint t&apos;accompagne au Canada et n&apos;est pas
                déjà citoyen/résident permanent canadien.
              </p>
            </section>

            {/* A. Capital humain */}
            <section className="space-y-5 rounded-md border border-charcoal/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">A : Capital humain (toi)</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Âge</label>
                  <input type="number" min={16} max={90} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15" />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Niveau d&apos;études le plus élevé</label>
                  <select value={education} onChange={(e) => setEducation(e.target.value)} className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15">
                    {EDUCATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <label className="flex items-center justify-between rounded-sm border border-charcoal/15 bg-white px-3.5 py-3 text-sm transition-colors hover:border-charcoal/30 has-[:focus]:border-rust has-[:focus]:ring-2 has-[:focus]:ring-rust/15">
                <span>Ma première langue officielle déclarée est le français</span>
                <input type="checkbox" checked={firstLanguageIsFrench} onChange={(e) => setFirstLanguageIsFrench(e.target.checked)} className="h-5 w-5 accent-forest" />
              </label>

              <LanguageSkillsSelect
                label={`Première langue officielle (${firstLanguageIsFrench ? "français — NCLC" : "anglais — CLB"})`}
                value={firstLanguage}
                onChange={(v) => setFirstLanguage(v as typeof firstLanguage)}
                options={FIRST_LANG_OPTIONS}
              />

              <label className="flex items-center justify-between rounded-sm border border-charcoal/15 bg-white px-3.5 py-3 text-sm transition-colors hover:border-charcoal/30 has-[:focus]:border-rust has-[:focus]:ring-2 has-[:focus]:ring-rust/15">
                <span>J&apos;ai aussi passé un test dans ma deuxième langue officielle</span>
                <input type="checkbox" checked={secondLanguageTested} onChange={(e) => setSecondLanguageTested(e.target.checked)} className="h-5 w-5 accent-forest" />
              </label>
              {secondLanguageTested && (
                <LanguageSkillsSelect
                  label={`Deuxième langue officielle (${firstLanguageIsFrench ? "anglais" : "français"})`}
                  value={secondLanguage}
                  onChange={(v) => setSecondLanguage(v as typeof secondLanguage)}
                  options={SECOND_LANG_OPTIONS}
                />
              )}

              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Expérience de travail au Canada</label>
                <select value={canadianWorkExperienceYears} onChange={(e) => setCanadianWorkExperienceYears(Number(e.target.value))} className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15 sm:w-64">
                  {CDN_WORK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </section>

            {/* B. Conjoint */}
            {hasSpouse && (
              <section className="space-y-5 rounded-md border border-charcoal/10 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-display text-lg font-semibold text-ink">B — Facteurs du conjoint</h2>
                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Études du conjoint</label>
                  <select value={spouseEducation} onChange={(e) => setSpouseEducation(e.target.value)} className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15">
                    {EDUCATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <LanguageSkillsSelect label="Langue officielle du conjoint" value={spouseLanguage} onChange={(v) => setSpouseLanguage(v as typeof spouseLanguage)} options={FIRST_LANG_OPTIONS} />
                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Expérience de travail au Canada du conjoint</label>
                  <select value={spouseCanadianWorkExperienceYears} onChange={(e) => setSpouseCanadianWorkExperienceYears(Number(e.target.value))} className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15 sm:w-64">
                    {CDN_WORK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </section>
            )}

            {/* C. Transférabilité */}
            <section className="space-y-5 rounded-md border border-charcoal/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">C : Transférabilité des compétences</h2>
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Expérience de travail à l&apos;étranger</label>
                <select value={foreignWorkExperienceYears} onChange={(e) => setForeignWorkExperienceYears(Number(e.target.value))} className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15 sm:w-64">
                  {FOREIGN_WORK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <label className="flex items-center justify-between rounded-sm border border-charcoal/15 bg-white px-3.5 py-3 text-sm transition-colors hover:border-charcoal/30 has-[:focus]:border-rust has-[:focus]:ring-2 has-[:focus]:ring-rust/15">
                <span>J&apos;ai un certificat de compétence (métier spécialisé)</span>
                <input type="checkbox" checked={hasCertificateOfQualification} onChange={(e) => setHasCertificateOfQualification(e.target.checked)} className="h-5 w-5 accent-forest" />
              </label>
            </section>

            {/* D. Points supplémentaires */}
            <section className="space-y-5 rounded-md border border-charcoal/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">D : Points supplémentaires</h2>
              <label className="flex items-center justify-between rounded-sm border border-charcoal/15 bg-white px-3.5 py-3 text-sm transition-colors hover:border-charcoal/30 has-[:focus]:border-rust has-[:focus]:ring-2 has-[:focus]:ring-rust/15">
                <span>Frère ou sœur (18 ans+) citoyen/résident permanent au Canada</span>
                <input type="checkbox" checked={hasSiblingInCanada} onChange={(e) => setHasSiblingInCanada(e.target.checked)} className="h-5 w-5 accent-forest" />
              </label>
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Études postsecondaires effectuées au Canada</label>
                <select value={canadianStudy} onChange={(e) => setCanadianStudy(e.target.value)} className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15">
                  <option value="NONE">Aucune</option>
                  <option value="ONE_OR_TWO_YEARS">Diplôme d&apos;un ou deux ans</option>
                  <option value="THREE_YEARS_PLUS">Diplôme de trois ans ou plus</option>
                </select>
              </div>
              <label className="flex items-center justify-between rounded-sm border border-charcoal/15 bg-white px-3.5 py-3 text-sm transition-colors hover:border-charcoal/30 has-[:focus]:border-rust has-[:focus]:ring-2 has-[:focus]:ring-rust/15">
                <span>J&apos;ai une désignation de candidat provincial (PCP)</span>
                <input type="checkbox" checked={hasProvincialNomination} onChange={(e) => setHasProvincialNomination(e.target.checked)} className="h-5 w-5 accent-forest" />
              </label>
            </section>

            <button type="submit" disabled={loading} className="w-full rounded-sm bg-gold py-3.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60">
              {loading ? "Calcul en cours…" : "Calculer mon score CRS"}
            </button>
          </form>

          <div className="h-fit space-y-4 rounded-sm bg-ink p-6 text-parchment lg:sticky lg:top-6">
            <p className="font-mono text-xs uppercase tracking-widest text-gold2">Score estimé</p>
            <div>
              <span className="font-mono text-5xl font-semibold">{result ? result.score : 0}</span>
              <span className="ml-1.5 text-sm opacity-50">/ {result?.maxScore ?? 1200}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-parchment/15">
              <div className="h-full bg-gold2 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs leading-relaxed opacity-70">
              {!result
                ? "Remplis le formulaire pour voir ton score estimé face au dernier seuil publié."
                : result.score //>= result.threshold
            </p>

            {result && !result.eligibility.eligible && (
              <div className="rounded-sm border border-rust/40 bg-rust/10 p-3 text-xs leading-relaxed text-rust">
                <p className="mb-1 font-semibold">⚠ Admissibilité non confirmée</p>
                <ul className="list-disc space-y-1 pl-4">
                  {result.eligibility.reasons.map((r) => <li key={r}>{r}</li>)}
                </ul>
                <p className="mt-2 text-rust/80">
                  Signal indicatif basé sur des critères plancher courants — pas une évaluation
                  légale complète. Vérifie ton admissibilité exacte sur ton compte Entrée express
                  officiel.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-2 border-t border-parchment/15 pt-4 font-mono text-xs">
                <div className="flex justify-between"><span className="opacity-60">A — Capital humain</span><span>{result.breakdown.core.subtotal} / {result.breakdown.core.cap}</span></div>
                <div className="flex justify-between"><span className="opacity-60">B — Conjoint</span><span>{result.breakdown.spouse.subtotal} / {result.breakdown.spouse.cap}</span></div>
                <div className="flex justify-between"><span className="opacity-60">C — Transférabilité</span><span>{result.breakdown.transferability.subtotal} / {result.breakdown.transferability.cap}</span></div>
                <div className="flex justify-between"><span className="opacity-60">D — Points suppl.</span><span>{result.breakdown.additional.subtotal} / {result.breakdown.additional.cap}</span></div>
              </div>
            )}

            {result?.saved && (
              <p className="border-t border-parchment/15 pt-3 text-xs text-gold2">
                Score enregistré sur ton tableau de bord.
              </p>
            )}
            <p className="border-t border-parchment/15 pt-3 text-[11px] opacity-50">
              Outil informatif calqué sur la grille officielle IRCC et ne remplace pas le calcul
              fait sur ton compte Entrée express officiel.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
