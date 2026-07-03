"use client";

import { useEffect, useState } from "react";

type Props = {
  iso: string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
};

// Les composants serveur formatent les dates avec le fuseau horaire DU
// SERVEUR (souvent UTC en hébergement), pas celui de la personne qui
// consulte le site. Ce petit composant client reformate côté navigateur,
// avec le fuseau horaire réel du visiteur — un rendu neutre le temps de
// l'hydratation évite tout warning de contenu différent serveur/client.
export default function LocalDateTime({ iso, options, className }: Props) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    const opts: Intl.DateTimeFormatOptions = options ?? { day: "numeric", month: "long", year: "numeric" };
    setFormatted(new Date(iso).toLocaleDateString("fr-FR", opts));
  }, [iso, options]);

  return <span className={className}>{formatted ?? "…"}</span>;
}
