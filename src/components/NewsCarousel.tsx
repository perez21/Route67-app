import LocalDateTime from "@/components/LocalDateTime";

type NewsItem = { id: string; title: string; summary: string; sourceUrl: string | null; imageUrl?: string | null; aiGenerated: boolean; publishedAt: Date };

// Images d'illustration génériques (Lorem Picsum, libres d'usage pour du
// contenu de démonstration) — une image par carte, seed fixe par position
// pour un rendu stable entre les rendus serveur.
const SEEDS = ["route67-a", "route67-b", "route67-c", "route67-d", "route67-e", "route67-f"];

export default function NewsCarousel({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null;

  return (
    <section id="actualites" className="bg-parchment2/60 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between px-1">
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">À la une</h2>
          <span className="rounded-full bg-cmr-red px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
            En direct
          </span>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
          {news.slice(0, 6).map((item, i) => (
            <article
              key={item.id}
              className="w-[78%] flex-shrink-0 snap-start overflow-hidden rounded-sm border border-charcoal/10 bg-white shadow-sm sm:w-[340px]"
            >
              <div
                className="h-36 w-full bg-cover bg-center sm:h-40"
                style={{ backgroundImage: `url(${item.imageUrl || `https://picsum.photos/seed/${SEEDS[i % SEEDS.length]}/640/420`})` }}
                role="img"
                aria-label={item.title}
              />
              <div className="p-4">
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-rust">
                  <LocalDateTime iso={item.publishedAt.toISOString()} options={{ day: "numeric", month: "short" }} />
                </p>
                <h3 className="mb-1.5 font-display text-base font-semibold leading-snug text-ink">{item.title}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-charcoal/65">{item.summary}</p>
                {item.sourceUrl && (
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-rust underline">
                    Source ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-2 px-1 text-[11px] text-charcoal/40 sm:hidden">← fais glisser pour voir plus →</p>
      </div>
    </section>
  );
}
