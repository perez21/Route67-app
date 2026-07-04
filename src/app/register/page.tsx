"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const inputClasses =
  "w-full rounded-sm border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15";
const labelClasses = "mb-1.5 block font-mono text-xs uppercase tracking-wide text-charcoal/60";

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

  const passwordMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-6 text-center">
          <h1 className="mb-2 font-display text-2xl font-semibold text-ink sm:text-3xl">Créer mon suivi</h1>
          <p className="text-sm text-charcoal/65">
            Déjà un compte ? <Link href="/login" className="font-semibold text-rust underline">Se connecter</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-md border border-charcoal/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
          <div>
            <label htmlFor="name" className={labelClasses}>
              Pseudo
            </label>
            <input
              id="name"
              type="text"
              required
              minLength={2}
              autoComplete="nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClasses}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
            />
            <p className="mt-1.5 text-xs text-charcoal/50">
              Au moins 10 caractères, avec une majuscule et un chiffre.
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClasses}>
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputClasses} ${passwordMismatch ? "border-rust/50 focus:border-rust focus:ring-rust/20" : ""}`}
            />
            {passwordMismatch && (
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
            disabled={loading || passwordMismatch}
            className="w-full rounded-sm bg-gold py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Création en cours…" : "Créer mon compte"}
          </button>

          <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/45">
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
