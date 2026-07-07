"use client";

import Link from "next/link";
import Accordion from "@/components/Accordion";
import Disclaimer from "@/components/Disclaimer";
import ProcedureWizard from "@/components/ProcedureWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages, GraduationCap, UserPlus } from "lucide-react";

export default function ProcedureBody() {
  const { t } = useLanguage();

  const steps = Array.from({ length: 13 }, (_, i) => ({
    label: t(`procedure.step${i + 1}.label`),
    description: t(`procedure.step${i + 1}.description`),
    duration: t(`procedure.step${i + 1}.duration`),
  }));

  const guides = [
    {
      title: t("procedure.guide1.title"),
      eyebrow: t("procedure.guide1.eyebrow"),
      description: t("procedure.guide1.description"),
      href: "/procedure/test-de-langue",
      icon: <Languages className="h-5 w-5" aria-hidden />,
    },
    {
      title: t("procedure.guide2.title"),
      eyebrow: t("procedure.guide2.eyebrow"),
      description: t("procedure.guide2.description"),
      href: "/procedure/equivalence-diplome",
      icon: <GraduationCap className="h-5 w-5" aria-hidden />,
    },
    {
      title: t("procedure.guide3.title"),
      eyebrow: t("procedure.guide3.eyebrow"),
      description: t("procedure.guide3.description"),
      href: "/procedure/creation-compte",
      icon: <UserPlus className="h-5 w-5" aria-hidden />,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">{t("procedure.eyebrow")}</p>
      <h1 className="mb-3 font-display text-2xl font-semibold text-ink sm:text-3xl">{t("procedure.title")}</h1>
      <p className="mb-4 max-w-2xl text-sm text-charcoal/65">{t("procedure.intro")}</p>
      <Disclaimer className="mb-10" />

      <h2 className="mb-4 font-display text-xl font-semibold text-ink">{t("procedure.timelineTitle")}</h2>
      <div className="mb-12">
        <ProcedureWizard steps={steps} />
      </div>

      <h2 className="mb-4 font-display text-xl font-semibold text-ink">{t("procedure.guidesTitle")}</h2>
      <p className="mb-4 text-sm text-charcoal/60">{t("procedure.guidesSubtitle")}</p>
      <Accordion items={guides} linkText={t("procedure.guideLinkText")} />

      <div className="mt-10 rounded-sm border border-charcoal/10 bg-white p-6 text-sm">
        <p className="mb-2 font-semibold text-ink">{t("procedure.ctaTitle")}</p>
        <p className="mb-4 text-charcoal/65">{t("procedure.ctaBody")}</p>
        <Link href="/register" className="inline-block rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-ink">
          {t("procedure.ctaButton")}
        </Link>
      </div>
    </div>
  );
}
