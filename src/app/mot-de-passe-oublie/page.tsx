"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { inputClasses, labelClasses, primaryButtonClasses, formCardClasses } from "@/lib/formStyles";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    const data = await res.json().catch(() => ({}));
    setMessage(data.message ?? "Si un compte existe avec cet email, un lien vient d'être envoyé.");
    setSent(true);
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-6 text-center">
          <h1 className="mb-2 font-display text-2xl font-semibold text-ink sm:text-3xl">Mot de passe oublié</h1>
          <p className="text-sm text-charcoal/65">
            <Link href="/login" className="font-semibold text-rust underline">← Retour à la connexion</Link>
          </p>
        </div>

        {sent ? (
          <p className="rounded-md border border-forest/20 bg-forest/5 p-5 text-sm text-forest shadow-sm">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className={`space-y-5 ${formCardClasses}`}>
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
            <button type="submit" disabled={loading} className={`w-full ${primaryButtonClasses}`}>
              {loading ? "Envoi…" : "Envoyer le lien de réinitialisation"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
