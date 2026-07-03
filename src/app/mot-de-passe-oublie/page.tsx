"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
      <div className="mx-auto max-w-md px-6 py-20">
        <h1 className="mb-2 font-display text-3xl font-semibold">Mot de passe oublié</h1>
        <p className="mb-8 text-sm text-charcoal/65">
          <Link href="/login" className="text-rust underline">← Retour à la connexion</Link>
        </p>

        {sent ? (
          <p className="rounded-sm border border-forest/20 bg-forest/5 p-4 text-sm text-forest">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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
            <button type="submit" disabled={loading} className="w-full rounded-sm bg-gold py-3 text-sm font-semibold text-ink disabled:opacity-60">
              {loading ? "Envoi…" : "Envoyer le lien de réinitialisation"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
