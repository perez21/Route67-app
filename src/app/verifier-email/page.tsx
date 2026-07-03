"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setError("Lien de vérification manquant.");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus("ok");
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus("error");
          setError(data.error ?? "Impossible de vérifier cet email.");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("Une erreur est survenue.");
      });
  }, [searchParams]);

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        {status === "loading" && <p className="text-sm text-charcoal/60">Vérification en cours…</p>}
        {status === "ok" && (
          <>
            <h1 className="mb-3 font-display text-2xl font-semibold text-forest">Email confirmé ✓</h1>
            <p className="mb-6 text-sm text-charcoal/65">Merci, ton adresse email est maintenant vérifiée.</p>
            <Link href="/dashboard" className="rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-ink">
              Aller à mon tableau de bord
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="mb-3 font-display text-2xl font-semibold text-rust">Lien invalide</h1>
            <p className="text-sm text-charcoal/65">{error}</p>
          </>
        )}
      </div>
    </main>
  );
}
