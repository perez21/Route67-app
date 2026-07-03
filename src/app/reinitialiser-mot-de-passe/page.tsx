"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (!token) {
      setError("Lien de réinitialisation invalide — redemande un lien.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-md px-6 py-20">
        <h1 className="mb-2 font-display text-3xl font-semibold">Nouveau mot de passe</h1>
        <p className="mb-8 text-sm text-charcoal/65">
          <Link href="/login" className="text-rust underline">← Retour à la connexion</Link>
        </p>

        {done ? (
          <p className="rounded-sm border border-forest/20 bg-forest/5 p-4 text-sm text-forest">
            Mot de passe mis à jour — redirection vers la connexion…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-charcoal/60">Nouveau mot de passe</label>
              <input type="password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm" />
              <p className="mt-1.5 text-xs text-charcoal/50">Au moins 10 caractères, avec une majuscule et un chiffre.</p>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-charcoal/60">Confirmer</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm" />
            </div>
            {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-sm bg-gold py-3 text-sm font-semibold text-ink disabled:opacity-60">
              {loading ? "Enregistrement…" : "Réinitialiser le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
