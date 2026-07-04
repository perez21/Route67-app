"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptedDisclaimer) {
      setError("Merci de cocher la case pour confirmer que tu as compris ce point avant de continuer.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, acceptedDisclaimer }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue. Réessaie.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-md px-6 py-20">
        <h1 className="mb-2 font-display text-3xl font-semibold">Créer mon suivi</h1>
        <p className="mb-8 text-sm text-charcoal/65">
          Déjà un compte ? <Link href="/login" className="text-rust underline">Se connecter</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-charcoal/60">
              Pseudo
            </label>
            <input
              id="name"
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-charcoal/60">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-charcoal/60">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm"
            />
            <p className="mt-1.5 text-xs text-charcoal/50">
              Au moins 10 caractères, avec une majuscule et un chiffre.
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-charcoal/60">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={10}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-sm border px-3 py-2.5 text-sm ${
                confirmPassword && confirmPassword !== password ? "border-rust/50" : "border-charcoal/15"
              }`}
            />
            {confirmPassword && confirmPassword !== password && (
              <p className="mt-1.5 text-xs text-rust">Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          <label className="flex items-start gap-2.5 rounded-sm border border-blue-200 bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-900">
            <input
              type="checkbox"
              checked={acceptedDisclaimer}
              onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-forest"
            />
            <span>
              Je reconnais que Route 67 <strong>n&apos;est pas un cabinet ni un consultant en
              immigration agréé</strong>, et que je crée ce compte uniquement pour m&apos;informer
              sur l&apos;Entrée express — pas pour recevoir un avis juridique individualisé.
            </span>
          </label>

          {error && (
            <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || (confirmPassword.length > 0 && confirmPassword !== password)}
            className="w-full rounded-sm bg-gold py-3 text-sm font-semibold text-ink disabled:opacity-60"
          >
            {loading ? "Création en cours…" : "Créer mon compte"}
          </button>

          <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/50">
            <span aria-hidden>🔒</span>
            <span>
              Tes données personnelles sont chiffrées et ne sont jamais partagées avec des tiers.
              Elles servent uniquement à faire fonctionner ton suivi Route 67.
            </span>
          </p>
        </form>
      </div>
    </main>
  );
}
