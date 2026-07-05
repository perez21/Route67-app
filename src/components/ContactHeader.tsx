"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function ContactHeader({ loggedIn }: { loggedIn: boolean }) {
  const { t } = useLanguage();
  return (
    <>
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">{t("contact.eyebrow")}</p>
      <h1 className="mb-3 font-display text-2xl font-semibold text-ink sm:text-3xl">{t("contact.title")}</h1>
      <p className="mb-4 max-w-2xl text-sm text-charcoal/65">
        {t("contact.intro")} <Link href="/faq" className="underline">{t("contact.faqLink")}</Link>.
      </p>
      {loggedIn && (
        <p className="mb-4 rounded-sm border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm text-charcoal">
          {t("contact.loggedInPre")}{" "}
          <Link href="/dashboard/chat" className="font-semibold text-rust underline">{t("contact.loggedInChatLink")}</Link>
          {t("contact.loggedInPost")}
        </p>
      )}
    </>
  );
}
