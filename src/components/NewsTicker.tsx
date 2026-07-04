type NewsItem = { id: string; title: string; summary: string; sourceUrl: string | null; aiGenerated: boolean };

export default function NewsTicker({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return (
      <div className="border-y border-cmr-yellow/30 bg-ink px-6 py-3 text-xs text-parchment/60 md:px-10">
        Aucune actualité publiée pour le moment — l&apos;équipe Route 67 ajoute des brèves depuis l&apos;espace admin.
      </div>
    );
  }

  // Affichage statique (aucun défilement automatique) des dernières
  // actualités, avec le texte complet de chaque brève, pour que tout le
  // contenu reste lisible sans avoir à suivre un texte qui bouge.
  const latest = news.slice(0, 3);

  return (
    <div className="border-y border-cmr-yellow/30 bg-ink px-4 py-4 sm:px-6 md:px-10">
      <ul className="mx-auto max-w-5xl space-y-3">
        {latest.map((item) => (
          <li key={item.id} className="flex gap-3 text-sm text-parchment/85">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cmr-yellow" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-parchment">{item.title}</strong>
              <span className="text-parchment/70"> — {item.summary}</span>
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 whitespace-nowrap font-semibold text-cmr-yellow underline"
                >
                  Source ↗
                </a>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
