"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PremiumCtaButton() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => {
        if (!cancelled) setLoggedIn(Boolean(d.user));
      })
      .catch(() => {
        if (!cancelled) setLoggedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loggedIn === null) {
    // Évite un flash : rendu neutre le temps de savoir si la personne est connectée.
    return <span className="inline-block h-[46px] w-full rounded-sm bg-gold/40" aria-hidden />;
  }

  if (loggedIn) {
    return (
      <Link href="/dashboard#don" className="block rounded-sm bg-gold py-3 text-center text-sm font-semibold text-ink">
        Devenir Premium
      </Link>
    );
  }

  return (
    <Link href="/register" className="block rounded-sm bg-gold py-3 text-center text-sm font-semibold text-ink">
      Créer mon compte
    </Link>
  );
}
