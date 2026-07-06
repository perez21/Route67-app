"use client";

import { useState } from "react";
import { inputClasses, primaryButtonClasses, formCardClasses } from "@/lib/formStyles";

type Tier = "FREE" | "PREMIUM";

type MomoInfo = { orange: string; mtn: string; accountName: string; paypal: string };
type ContactInfo = { email: string; whatsapp: string };

export default function UpgradePanel({
  currentTier,
  hasPending,
  momo,
  contact,
}: {
  currentTier: Tier;
  hasPending: boolean;
  momo: MomoInfo;
  contact: ContactInfo;
}) {
  // "instructions" ne crée RIEN en base — c'est un simple affichage local.
  // Seul l'envoi du formulaire (submitReference) crée la demande.
  const [step, setStep] = useState<"idle" | "instructions" | "confirmed">(hasPending ? "confirmed" : "idle");
  const [operator, setOperator] = useState<"orange_money" | "mtn_momo" | "paypal">("orange_money");
  const [reference, setReference] = useState("");
  const [senderName, setSenderName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitReference(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!reference.trim()) {
      setError("Renseigne la référence de ta transaction avant d'envoyer.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/subscription/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ momoOperator: operator, momoReference: reference, momoName: senderName || undefined }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    setStep("confirmed");
  }

  if (currentTier === "PREMIUM") {
    return (
      <div className="rounded-sm border border-forest/20 bg-forest/5 p-5 text-sm text-forest">
        Merci pour ton don. Ton accès Premium est actif 🙏
      </div>
    );
  }

  const confirmationText = "Bonjour, je viens de faire un don à Route 67. Voici ma preuve en capture d'écran : ";
  const whatsappLink = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(confirmationText)}`
    : null;
  const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent("Confirmation de don : Route 67")}&body=${encodeURIComponent(confirmationText)}`;

  return (
    <div className={`space-y-4 ${formCardClasses}`}>
      <p className="text-sm leading-relaxed text-charcoal/70">
        Ce don anonyme (15 000 FCFA ou équivalent/mois) sert à couvrir les frais réels du projet :
        l&apos;hébergement du site pour qu&apos;il reste disponible, la maintenance pour suivre les
        tirages et actualités en temps réel, et un peu de quoi faire vivre l&apos;équipe qui s&apos;en
        occupe. Ce n&apos;est pas un paiement pour un service individualisé de consultation en
        immigration. C&apos;est un soutien volontaire au projet qui, en retour, débloque pendant 1
        mois les rendez-vous avec l&apos;équipe.
      </p>

      {step === "idle" && (
        <button onClick={() => setStep("instructions")} className={`w-full ${primaryButtonClasses}`}>
          Faire un don
        </button>
      )}

      {step === "instructions" && (
        <div className="space-y-4">
          <div className="rounded-sm border border-gold/30 bg-gold/10 p-4 text-sm text-charcoal">
            <p className="mb-2 font-semibold">Comment faire ton don :</p>
            <ul className="mb-2 space-y-1">
              <li>Orange Money : <strong>{momo.orange}</strong></li>
              <li>MTN MoMo : <strong>{momo.mtn}</strong></li>
              <li>Nom Mobile Money : <strong>{momo.accountName}</strong></li>
              {momo.paypal && <li>PayPal : <strong>{momo.paypal}</strong></li>}
            </ul>
            <p className="text-xs text-charcoal/60">
              Rien n&apos;est encore envoyé à l&apos;équipe. Remplis le formulaire ci-dessous une fois le
              don effectué pour valider ta demande.
            </p>
          </div>

          <form onSubmit={submitReference} className="space-y-3">
            <p className="text-sm font-semibold text-ink">Une fois le don fait, confirme ici :</p>
            <select value={operator} onChange={(e) => setOperator(e.target.value as "orange_money" | "mtn_momo" | "paypal")} className={inputClasses}>
              <option value="orange_money">Orange Money</option>
              <option value="mtn_momo">MTN MoMo</option>
              {momo.paypal && <option value="paypal">PayPal</option>}
            </select>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Référence de la transaction (SMS ou reçu PayPal)"
              required
              className={inputClasses}
            />
            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Nom sur ton compte de paiement (optionnel, aide à retrouver le don)"
              className={inputClasses}
            />
            {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className={`flex-1 ${primaryButtonClasses}`}>
                {loading ? "Envoi…" : "Envoyer ma demande"}
              </button>
              <button type="button" onClick={() => setStep("idle")} className="rounded-sm border border-charcoal/15 px-4 py-2.5 text-sm transition-colors hover:bg-parchment2/50">
                Annuler
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-charcoal/50">— ou confirme directement, sans formulaire —</p>
          <div className="flex gap-2">
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-sm border border-cmr-green/40 py-2 text-center text-xs font-semibold text-cmr-green">
                Par WhatsApp
              </a>
            )}
            <a href={mailtoLink} className="flex-1 rounded-sm border border-charcoal/20 py-2 text-center text-xs font-semibold text-charcoal">
              Par email
            </a>
          </div>
        </div>
      )}

      {step === "confirmed" && (
        <div className="rounded-sm border border-forest/20 bg-forest/5 p-4 text-sm text-forest">
          Demande envoyée. Notre équipe vérifie ton don et active ton accès sous peu.
        </div>
      )}
    </div>
  );
}
