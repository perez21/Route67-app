"use client";

import { useState } from "react";

export default function ContactForm({ whatsapp, email }: { whatsapp: string; email: string }) {
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: emailInput, subject, message }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    setSent(true);
  }

  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : null;
  const mailtoLink = `mailto:${email}`;

  if (sent) {
    return (
      <div className="rounded-sm border border-forest/20 bg-forest/5 p-6 text-sm text-forest">
        Message envoyé — notre équipe te répond généralement sous 48 heures.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-sm border border-charcoal/10 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Email</label>
            <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Sujet</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm" />
        </div>
        {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-sm bg-gold py-3 text-sm font-semibold text-ink disabled:opacity-60">
          {loading ? "Envoi…" : "Envoyer le message"}
        </button>
      </form>

      <div className="space-y-3">
        <div className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm">
          <p className="mb-2 font-semibold text-ink">Autres façons de nous joindre</p>
          <div className="space-y-2">
            <a href={mailtoLink} className="block rounded-sm border border-charcoal/15 px-3.5 py-2.5 text-center">
              ✉️ {email}
            </a>
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block rounded-sm border border-cmr-green/40 px-3.5 py-2.5 text-center text-cmr-green">
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
        <p className="text-xs text-charcoal/50">
          Réponse habituelle sous 24 à 48 heures. Pour un accompagnement individualisé et régulier,
          le forfait Premium donne accès à des rendez-vous planifiés avec l&apos;équipe.
        </p>
      </div>
    </div>
  );
}
