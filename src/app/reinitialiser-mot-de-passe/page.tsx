"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { inputClasses, labelClasses, primaryButtonClasses, formCardClasses, inputErrorClasses } from "@/lib/formStyles";

export const dynamic = "force-dynamic";

function ResetPasswordForm() {
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
    if (!password.trim() || !confirm.trim()) {
      setError("Merci de remplir les deux champs.");
      return;
    }
    if (password.length < 10) {
      setError("Ton mot de passe doit contenir au moins 10 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (!token) {
      setError("Lien de réinitialisation invalide, redemande un lien.");
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

  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-6 text-center">
        <h1 className="mb-2 font-display text-2xl font-semibold text-ink sm:text-3xl">Nouveau mot de passe</h1>
        <p className="text-sm text-charcoal/65">
          <Link href="/login" className="font-semibold text-rust underline">← Retour à la connexion</Link>
        </p>
      </div>
      {done ? (
        <p className="rounded-md border border-forest/20 bg-forest/5 p-5 text-sm text-forest shadow-sm">
          Mot de passe mis à jour — redirection vers la connexion…
        </p>
      ) : (
        <form onSubmit={handleSubmit} className={`space-y-5 ${formCardClasses}`}>
          <div>
            <label className={labelClasses}>Nouveau mot de passe</label>
            <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} />
            <p className="mt-1.5 text-xs text-charcoal/50">Au moins 10 caractères, avec une majuscule et un chiffre.</p>
          </div>
          <div>
            <label className={labelClasses}>Confirmer</label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`${inputClasses} ${mismatch ? inputErrorClasses : ""}`}
            />
            {mismatch && <p className="mt-1.5 text-xs text-rust">Les mots de passe ne correspondent pas.</p>}
          </div>
          {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
          <button type="submit" disabled={loading} className={`w-full ${primaryButtonClasses}`}>
            {loading ? "Enregistrement…" : "Réinitialiser le mot de passe"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<p className="text-center py-20 text-sm text-charcoal/60">Chargement…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
