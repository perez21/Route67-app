import Navbar from "@/components/Navbar";
import FaqAccordion from "@/components/FaqAccordion";
import Disclaimer from "@/components/Disclaimer";
import { FaqHeader, FaqContactCta } from "@/components/FaqHeader";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes sur l'Entrée express",
  description: "Les réponses aux questions les plus fréquentes sur l'Entrée express canadienne et sur Route 67.",
};

export const dynamic = "force-dynamic";

export const revalidate = 300;

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <FaqHeader />
        <Disclaimer className="mb-8" />

        <FaqAccordion items={items.map((i: { id: string; question: string; answer: string }) => ({ id: i.id, question: i.question, answer: i.answer }))} />

        <FaqContactCta />
      </div>
    </main>
  );
}
