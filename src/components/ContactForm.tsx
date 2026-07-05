"use client";

import { useState } from "react";
import { inputClasses, labelClasses, formCardClasses, primaryButtonClasses } from "@/lib/formStyles";

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
      <div className="rounded-md border border-forest/20 bg-forest/5 p-8 text-center text-sm text-forest shadow-sm">
        <p className="mb-1 text-2xl">✅</p>
        <p className="font-semibold">Message envoyé</p>
        <p className="mt-1 text-forest/80">Notre équipe te répond généralement sous 24 à 48 heures par email et, si tu es connecté, dans ton chat.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] lg:gap-10">
      <form
        onSubmit={handleSubmit}
        className={`space-y-5 ${formCardClasses}`}
      >
        <h2 className="font-display text-xl font-bold text-ink">Écris-nous un message</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ton nom" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Email</label>
            <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required placeholder="ton@email.com" className={inputClasses} />
          </div>
        </div>
        <div>
          <label className={labelClasses}>Sujet</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="En quoi peut-on t'aider ?" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} className={`${inputClasses} resize-y`} />
        </div>
        {error && <p role="alert" className="rounded-lg bg-rust/10 px-4 py-2.5 text-sm text-rust">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full sm:w-auto sm:px-10 ${primaryButtonClasses}`}
        >
          {loading ? "Envoi…" : "Envoyer le message"}
        </button>
        <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/45">
          <span aria-hidden>🔒</span>
          <span>Tes coordonnées sont chiffrées et servent uniquement à te répondre. Elles ne sont jamais partagées avec des tiers.</span>
        </p>
      </form>

      <div className="space-y-4 md:sticky md:top-24 md:self-start">
        <div className={formCardClasses}>
          <p className="mb-3 font-display text-base font-bold text-ink">Autres façons de nous joindre</p>
          <div className="space-y-2.5">
            <a
              href={mailtoLink}
              className="flex items-center gap-2 rounded-lg border border-charcoal/15 px-3.5 py-3 text-sm transition-colors hover:border-charcoal/30 hover:bg-parchment2/50"
            >
              <span aria-hidden>✉️</span> {email}
            </a>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-cmr-green/40 px-3.5 py-3 text-sm text-cmr-green transition-colors hover:bg-cmr-green/5"
              >
                <span aria-hidden>💬</span> WhatsApp
              </a>
            )}
          </div>
        </div>
        <p className="rounded-lg border border-charcoal/10 bg-parchment2/40 p-4 text-xs leading-relaxed text-charcoal/55">
          Réponse habituelle sous 24 à 48 heures. Pour un échange individualisé et régulier, devenez membre premium
          de Route67 pour accéder à des rendez-vous avec l&apos;équipe.
        </p>
      </div>
    </div>
  );
}
