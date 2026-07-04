import Link from "next/link";
import Navbar from "@/components/Navbar";
import FaqAccordion from "@/components/FaqAccordion";
import Disclaimer from "@/components/Disclaimer";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

export const revalidate = 300;

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Questions fréquentes</p>
        <h1 className="mb-3 font-display text-2xl font-semibold text-ink sm:text-3xl">FAQ</h1>
        <p className="mb-4 max-w-2xl text-sm text-charcoal/65">
          Les questions qui reviennent le plus souvent sur l&apos;Entrée express et sur Route 67.
        </p>
        <Disclaimer className="mb-8" />

        <FaqAccordion items={items.map((i: { id: string; question: string; answer: string }) => ({ id: i.id, question: i.question, answer: i.answer }))} />

        <div className="mt-8 rounded-sm border border-charcoal/10 bg-white p-6 text-sm">
          <p className="mb-3 text-charcoal/70">Tu ne trouves pas ta réponse ?</p>
          <Link href="/contact" className="inline-block rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-ink">
            Contacter l&apos;équipe
          </Link>
        </div>
      </div>
    </main>
  );
}
