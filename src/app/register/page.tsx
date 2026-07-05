"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inputClasses, inputErrorClasses, labelClasses, primaryButtonClasses, formCardClasses } from "@/lib/formStyles";

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink px-10 py-16 text-parchment lg:flex lg:w-1/2 lg:flex-col lg:justify-center">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative max-w-md">
        <Link href="/" className="mb-4 block font-display text-4xl font-bold">
          <span className="text-cmr-green">Route</span> <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
        </Link>
        <p className="text-xl leading-relaxed text-parchment/85">
          Crée ton suivi personnalisé : checklist de la procédure, simulateur de score CRS, et
          alertes sur les tirages qui te concernent.
        </p>
      </div>
      <div className="relative mt-10 flex h-1 w-full max-w-md">
        <div className="flex-1 bg-cmr-green" />
        <div className="flex-1 bg-cmr-red" />
        <div className="flex-1 bg-cmr-yellow" />
      </div>
    </div>
  );
}

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
    <main className="flex min-h-screen">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center bg-parchment2/40 px-4 py-12 sm:px-6">
        <div className={`w-full max-w-sm ${formCardClasses}`}>
          <Link href="/" className="mb-6 block text-center font-display text-2xl font-bold text-ink lg:hidden">
            <span className="text-cmr-green">Route</span> <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
          </Link>
          <h1 className="mb-1 font-display text-2xl font-bold text-ink">Créer mon compte</h1>
          <p className="mb-6 text-sm text-charcoal/60">
            Déjà un compte ? <Link href="/login" className="font-semibold text-rust hover:underline">Se connecter</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="name" className={labelClasses}>Pseudo</label>
              <input
                id="name"
                type="text"
                required
                minLength={2}
                autoComplete="nickname"
                placeholder="Comment veux-tu qu'on t'appelle ?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClasses}>Mot de passe</label>
              <input
                id="password"
                type="password"
                required
                minLength={10}
                autoComplete="new-password"
                placeholder="Au moins 10 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
              />
              <p className="mt-1.5 text-xs text-charcoal/45">Au moins 10 caractères, avec une majuscule et un chiffre.</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClasses}>Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={10}
                autoComplete="new-password"
                placeholder="Retape ton mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClasses} ${passwordMismatch ? inputErrorClasses : ""}`}
              />
              {passwordMismatch && (
                <p className="mt-1.5 text-xs text-rust">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-900">
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
              <p role="alert" className="rounded-lg bg-rust/10 px-4 py-2.5 text-sm text-rust">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || passwordMismatch}
              className={`w-full ${primaryButtonClasses}`}
            >
              {loading ? "Création en cours…" : "Créer mon compte"}
            </button>

            <p className="flex items-start justify-center gap-1.5 text-xs leading-relaxed text-charcoal/45">
              <span aria-hidden>🔒</span>
              <span>Tes données personnelles sont chiffrées et ne sont jamais partagées avec des tiers.</span>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
