"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import Accordion from "@/components/Accordion";
import PremiumCtaButton from "@/components/PremiumCtaButton";
import LocalDateTime from "@/components/LocalDateTime";

type Draw = {
  id: string;
  number: number;
  category: string;
  minScore: number;
  invitations: number;
  date: Date;
};

type Momo = {
  orange: string;
  mtn: string;
  accountName: string;
  paypal?: string;
};

type Social = {
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  whatsapp: string;
};

// Tout le corps de la page d'accueil sous le hero et le carrousel
// d'actualités (ceux-là restent gérés côté serveur dans page.tsx). Extrait
// en composant client car HomePage est un composant serveur (appels Prisma
// directs) et useLanguage() n'est utilisable que côté client.
export function HomeDraws({ draws }: { draws: Draw[] }) {
  const { t } = useLanguage();
  return (
    <section id="tirages" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="mb-4 font-display text-xl font-bold text-ink sm:text-2xl">{t("home.tirages.title")}</h2>
      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-ink">
        {draws.length === 0 ? (
          <p className="px-5 py-8 text-sm text-parchment/60">{t("home.tirages.empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] font-mono text-sm text-parchment">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-parchment/45">
                  <th className="px-5 pb-2 pt-4 font-medium">{t("home.tirages.col.tirage")}</th>
                  <th className="px-5 pb-2 pt-4 font-medium">{t("home.tirages.col.categorie")}</th>
                  <th className="px-5 pb-2 pt-4 font-medium">{t("home.tirages.col.score")}</th>
                  <th className="px-5 pb-2 pt-4 font-medium">{t("home.tirages.col.invitations")}</th>
                  <th className="px-5 pb-2 pt-4 font-medium">{t("home.tirages.col.date")}</th>
                </tr>
              </thead>
              <tbody>
                {draws.map((draw) => (
                  <tr key={draw.id} className="border-t border-parchment/10">
                    <td className="px-5 py-3 font-semibold text-gold2">#{draw.number}</td>
                    <td className="px-5 py-3">{draw.category}</td>
                    <td className="px-5 py-3">{draw.minScore}</td>
                    <td className="px-5 py-3">{draw.invitations.toLocaleString("fr-FR")}</td>
                    <td className="px-5 py-3">
                      <LocalDateTime iso={draw.date.toISOString()} options={{ day: "numeric", month: "long", year: "numeric" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export function HomeProcedureTeaser() {
  const { t } = useLanguage();
  const items = [
    { title: t("home.procedureTeaser.step1.title"), eyebrow: t("home.procedureTeaser.step1.eyebrow"), description: t("home.procedureTeaser.step1.description"), href: "/procedure/test-de-langue" },
    { title: t("home.procedureTeaser.step2.title"), eyebrow: t("home.procedureTeaser.step2.eyebrow"), description: t("home.procedureTeaser.step2.description"), href: "/procedure/equivalence-diplome" },
    { title: t("home.procedureTeaser.step3.title"), eyebrow: t("home.procedureTeaser.step3.eyebrow"), description: t("home.procedureTeaser.step3.description"), href: "/procedure/creation-compte" },
  ];
  return (
    <section id="procedure" className="bg-white px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-rust">{t("home.procedureTeaser.eyebrow")}</p>
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t("home.procedureTeaser.title")}</h2>
          </div>
          <Link href="/procedure" className="text-sm font-semibold text-rust underline">{t("home.procedureTeaser.link")}</Link>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  );
}

export function HomeHowItWorks() {
  const { t } = useLanguage();
  const steps = [
    { title: t("home.howItWorks.step1.title"), text: t("home.howItWorks.step1.text") },
    { title: t("home.howItWorks.step2.title"), text: t("home.howItWorks.step2.text") },
    { title: t("home.howItWorks.step3.title"), text: t("home.howItWorks.step3.text") },
    { title: t("home.howItWorks.step4.title"), text: t("home.howItWorks.step4.text") },
  ];
  return (
    <section id="comment-ca-marche" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 md:px-10">
      <div className="mb-8">
        <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t("home.howItWorks.title")}</h2>
        <p className="mt-2 max-w-md text-sm text-charcoal/65">{t("home.howItWorks.subtitle")}</p>
      </div>
      <div className="grid gap-6 border-t border-charcoal/10 pt-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title}>
            <div className="mb-2 font-mono text-xs font-semibold text-gold">{String(i + 1).padStart(2, "0")}</div>
            <h3 className="mb-1.5 font-display text-base font-semibold text-ink">{step.title}</h3>
            <p className="text-sm leading-relaxed text-charcoal/70">{step.text}</p>
          </div>
        ))}
      </div>
      <Link href="/procedure" className="mt-6 inline-block text-sm font-semibold text-rust underline">
        {t("home.howItWorks.link")}
      </Link>
    </section>
  );
}

export function HomeContactTeaser() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 md:px-10">
      <div className="rounded-sm border border-charcoal/10 bg-white p-6 sm:p-8">
        <h2 className="mb-2 font-display text-xl font-bold text-ink">{t("home.contactTeaser.title")}</h2>
        <p className="mb-5 max-w-xl text-sm text-charcoal/65">
          {t("home.contactTeaser.description")} <Link href="/faq" className="underline">{t("home.contactTeaser.faqLink")}</Link>.
        </p>
        <Link href="/contact" className="inline-block rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-ink">
          {t("home.contactTeaser.cta")}
        </Link>
      </div>
    </section>
  );
}

export function HomeSupport({ momo }: { momo: Momo }) {
  const { t } = useLanguage();
  return (
    <section id="tarifs" className="bg-parchment2/50 px-4 py-10 sm:px-6 sm:py-14 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{t("home.support.title")}</h2>
          <p className="mt-2 max-w-xl text-sm text-charcoal/65">{t("home.support.description")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-charcoal/10 bg-white p-6 sm:p-8">
            <span className="mb-4 inline-block w-fit rounded-full bg-gold px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink">
              {t("home.support.donBadge")}
            </span>
            <h3 className="mb-4 font-display text-xl font-semibold text-ink">{t("home.support.donTitle")}</h3>
            <ul className="mb-5 space-y-2 text-sm text-charcoal/75">
              <li className="border-t border-charcoal/10 pt-2">— {t("home.support.donOrange")} : <strong>{momo.orange}</strong></li>
              <li className="border-t border-charcoal/10 pt-2">— {t("home.support.donMtn")} : <strong>{momo.mtn}</strong></li>
              <li className="border-t border-charcoal/10 pt-2">— {t("home.support.donAccountName")} : <strong>{momo.accountName}</strong></li>
              {momo.paypal && (
                <li className="border-t border-charcoal/10 pt-2">
                  — {t("home.support.donPaypal")} : <span className="font-semibold">{momo.paypal}</span>
                </li>
              )}
            </ul>
            <p className="text-xs text-charcoal/50">{t("home.support.donDisclaimer")}</p>
          </div>

          <div className="flex flex-col rounded-sm bg-ink p-6 text-parchment sm:p-8">
            <span className="mb-4 inline-block w-fit rounded-full bg-cmr-yellow px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink">
              {t("home.support.premiumBadge")}
            </span>
            <h3 className="mb-4 font-display text-xl font-semibold">{t("home.support.premiumTitle")}</h3>
            <ul className="mb-6 flex-grow space-y-2 text-sm">
              <li className="border-t border-parchment/15 pt-2">— {t("home.support.premiumItem1")}</li>
              <li className="border-t border-parchment/15 pt-2">— {t("home.support.premiumItem2")}</li>
              <li className="border-t border-parchment/15 pt-2">— {t("home.support.premiumItem3")}</li>
              <li className="border-t border-parchment/15 pt-2">— {t("home.support.premiumItem4")}</li>
            </ul>
            <PremiumCtaButton />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeFooter({ social }: { social: Social }) {
  const { t } = useLanguage();
  const hasSocial = social.facebook || social.instagram || social.linkedin || social.tiktok || social.whatsapp;
  return (
    <footer className="bg-[#0E1A30] px-4 py-10 text-xs leading-relaxed text-parchment/55 sm:px-6 md:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2"><strong className="text-parchment">Route 67</strong> — {t("footer.tagline")}</p>
        <p>{t("footer.disclaimer")}</p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-parchment/10 pt-5">
          <p>
            <Link href="/contact" className="underline">{t("footer.contact")}</Link> ·{" "}
            <Link href="/procedure" className="underline">{t("footer.procedure")}</Link>
          </p>
          {hasSocial && (
            <div className="flex gap-4">
              {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="underline">Facebook</a>}
              {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="underline">Instagram</a>}
              {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="underline">LinkedIn</a>}
              {social.tiktok && <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="underline">TikTok</a>}
              {social.whatsapp && <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a>}
            </div>
          )}
        </div>
        <p className="mt-4 text-parchment/35">© {new Date().getFullYear()} Route 67. {t("footer.rights")}</p>
      </div>
    </footer>
  );
}
