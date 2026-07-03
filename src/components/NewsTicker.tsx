type NewsItem = { id: string; title: string; summary: string; sourceUrl: string | null; aiGenerated: boolean };

export default function NewsTicker({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return (
      <div className="border-y border-cmr-yellow/30 bg-ink px-6 py-3 text-xs text-parchment/60 md:px-10">
        Aucune actualité publiée pour le moment — l&apos;équipe Route 67 ajoute des brèves depuis l&apos;espace admin.
      </div>
    );
  }

  // Limité aux 3 actualités les plus récentes, dupliquées pour un défilement
  // continu sans "trou" visuel quand l'animation boucle (translateX -50%).
  const latest = news.slice(0, 3);
  const loop = [...latest, ...latest];

  return (
    <div className="group relative overflow-hidden border-y border-cmr-yellow/30 bg-ink py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap group-hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <span key={`${item.id}-${i}`} className="flex items-center gap-3 text-sm text-parchment/85">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cmr-yellow" />
            <strong className="font-semibold text-parchment">{item.title}</strong>
            <span className="text-parchment/55">— {item.summary}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
