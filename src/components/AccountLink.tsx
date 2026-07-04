"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountLink() {
  const [name, setName] = useState<string | null | undefined>(undefined); // undefined = chargement

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => {
        if (!cancelled) setName(d.user?.name ?? null);
      })
      .catch(() => {
        if (!cancelled) setName(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (name === undefined) return null; // évite un flash de contenu incorrect

  if (name) {
    return (
      <Link href="/dashboard" className="max-w-[6rem] truncate text-sm font-semibold text-parchment/80 sm:max-w-none">
        {name.split(" ")[0]}
      </Link>
    );
  }

  return (
    <Link href="/login" className="whitespace-nowrap text-sm font-semibold text-parchment/80">
      Se connecter
    </Link>
  );
}
