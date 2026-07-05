import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import LocalDateTime from "@/components/LocalDateTime";
import { prisma } from "@/lib/db";

const SEEDS = ["route67-a", "route67-b", "route67-c", "route67-d", "route67-e", "route67-f"];

export default async function NewsDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const item = await prisma.newsItem.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link href="/#actualites" className="mb-6 inline-block text-sm text-rust underline">
          ← Retour à la une
        </Link>

        <div
          className="mb-6 h-48 w-full rounded-sm bg-cover bg-center sm:h-72"
          style={{
            backgroundImage: `url(${item.imageUrl || `https://picsum.photos/seed/${SEEDS[item.id.length % SEEDS.length]}/960/540`})`,
          }}
          role="img"
          aria-label={item.title}
        />

        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">
          <LocalDateTime iso={item.publishedAt.toISOString()} options={{ day: "numeric", month: "long", year: "numeric" }} />
          {item.aiGenerated && <span className="ml-2 text-charcoal/40">· Résumé généré avec assistance IA</span>}
        </p>
        <h1 className="mb-5 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">{item.title}</h1>

        <p className="whitespace-pre-line text-base leading-relaxed text-charcoal/80">{item.summary}</p>

        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-sm border border-rust/30 px-5 py-2.5 text-sm font-semibold text-rust"
          >
            Voir la source originale ↗
          </a>
        )}

        <Disclaimer variant="compact" className="mt-10" />
      </div>
    </main>
  );
}
