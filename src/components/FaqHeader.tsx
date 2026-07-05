"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function FaqHeader() {
  const { t } = useLanguage();
  return (
    <>
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">{t("faq.eyebrow")}</p>
      <h1 className="mb-3 font-display text-2xl font-semibold text-ink sm:text-3xl">FAQ</h1>
      <p className="mb-4 max-w-2xl text-sm text-charcoal/65">{t("faq.intro")}</p>
    </>
  );
}

export function FaqContactCta() {
  const { t } = useLanguage();
  return (
    <div className="mt-8 rounded-sm border border-charcoal/10 bg-white p-6 text-sm">
      <p className="mb-3 text-charcoal/70">{t("faq.notFound")}</p>
      <Link href="/contact" className="inline-block rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-ink">
        {t("faq.contactCta")}
      </Link>
    </div>
  );
}
