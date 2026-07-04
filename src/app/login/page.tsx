"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { inputClasses, labelClasses, primaryButtonClasses, formCardClasses } from "@/lib/formStyles";

export const dynamic = "force-dynamic";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function goToNext() {
    const next = searchParams.get("next") ?? "/dashboard";
    router.push(next);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue. Réessaie.");
      return;
    }

    const data = await res.json();
    if (data.requires2FA) {
      setStep("2fa");
      return;
    }
    goToNext();
  }

  async function handleVerify2FA(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Code incorrect.");
      return;
    }

    goToNext();
  }

  if (step === "2fa") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-md border border-charcoal/10 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-2 font-display text-2xl font-semibold text-ink sm:text-3xl">Vérification en deux étapes</h1>
          <p className="mb-8 text-sm text-charcoal/65">
            Ce compte est protégé par une double authentification. Ouvre ton application
            d&apos;authentification (Google Authenticator, Authy…) et saisis le code à 6 chiffres.
          </p>
          <form onSubmit={handleVerify2FA} className="space-y-5">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="123456"
              required
              autoFocus
              className={`${inputClasses} py-3 text-center font-mono text-2xl tracking-[0.5em]`}
            />
            {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-sm bg-gold py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Vérification…" : "Valider"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-6 text-center">
        <h1 className="mb-2 font-display text-2xl font-semibold text-ink sm:text-3xl">Se connecter</h1>
        <p className="text-sm text-charcoal/65">
          Pas encore de compte ? <Link href="/register" className="font-semibold text-rust underline">Créer mon suivi</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-md border border-charcoal/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
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
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block font-mono text-xs uppercase tracking-wide text-charcoal/60">
              Mot de passe
            </label>
            <Link href="/mot-de-passe-oublie" className="text-xs text-rust underline">Mot de passe oublié ?</Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-gold py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/45">
          <span aria-hidden>🔒</span>
          <span>Connexion sécurisée — tes identifiants sont chiffrés et ne sont jamais partagés.</span>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<p className="text-center py-20 text-sm text-charcoal/60">Chargement…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
