"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { inputClasses, primaryButtonClasses, formCardClasses } from "@/lib/formStyles";

export const dynamic = "force-dynamic";

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink px-10 py-16 text-parchment lg:flex lg:w-1/2 lg:flex-col lg:justify-center">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative max-w-md">
        <Link href="/" className="mb-4 block font-display text-4xl font-bold">
          <span className="text-cmr-green">Route</span> <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
        </Link>
        <p className="text-xl leading-relaxed text-parchment/85">
          La plateforme qui traduit l&apos;Entrée express canadienne en informations claires — avec
          un suivi personnalisé pour savoir exactement où tu en es.
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
      <div className={`w-full max-w-sm ${formCardClasses}`}>
        <h1 className="mb-2 font-display text-2xl font-bold text-ink">Vérification en deux étapes</h1>
        <p className="mb-6 text-sm leading-relaxed text-charcoal/60">
          Ce compte est protégé par une double authentification. Ouvre ton application
          d&apos;authentification et saisis le code à 6 chiffres.
        </p>
        <form onSubmit={handleVerify2FA} className="space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="123456"
            required
            autoFocus
            className={`${inputClasses} text-center font-mono text-2xl tracking-[0.5em]`}
          />
          {error && <p role="alert" className="rounded-lg bg-rust/10 px-4 py-2.5 text-sm text-rust">{error}</p>}
          <button type="submit" disabled={loading || code.length !== 6} className={`w-full ${primaryButtonClasses}`}>
            {loading ? "Vérification…" : "Valider"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-sm ${formCardClasses}`}>
      <Link href="/" className="mb-6 block text-center font-display text-2xl font-bold text-ink lg:hidden">
        <span className="text-cmr-green">Route</span> <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Adresse email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
        />
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Mot de passe"
          aria-label="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClasses}
        />

        {error && (
          <p role="alert" className="rounded-lg bg-rust/10 px-4 py-2.5 text-sm text-rust">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={`w-full ${primaryButtonClasses}`}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p className="text-center">
          <Link href="/mot-de-passe-oublie" className="text-sm text-rust hover:underline">Mot de passe oublié ?</Link>
        </p>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-charcoal/10" />
        <span className="text-xs font-medium uppercase tracking-wide text-charcoal/40">ou</span>
        <div className="h-px flex-1 bg-charcoal/10" />
      </div>

      <Link
        href="/register"
        className="block w-full rounded-lg bg-cmr-green py-3.5 text-center text-base font-bold text-white shadow-sm transition-all hover:brightness-95"
      >
        Créer mon compte
      </Link>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-charcoal/45">
        <span aria-hidden>🔒</span> Connexion sécurisée — tes identifiants sont chiffrés.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center bg-parchment2/40 px-4 py-12 sm:px-6">
        <Suspense fallback={<p className="text-sm text-charcoal/60">Chargement…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
