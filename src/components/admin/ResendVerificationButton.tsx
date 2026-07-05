"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Bouton d'action groupée avec confirmation explicite — même schéma que
// AdminCampaignsManager (prévisualiser puis confirmer) pour rester cohérent
// avec le reste de l'interface admin, et éviter un envoi accidentel en un
// seul clic.
export default function ResendVerificationButton({ unverifiedCount }: { unverifiedCount: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ sentCount: number; skippedCount: number; failedCount: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/users/resend-verification", { method: "POST" });
    setLoading(false);
    setConfirming(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    const data = await res.json();
    setResult(data);
    router.refresh();
  }

  if (unverifiedCount === 0) return null;

  return (
    <div className="mb-4">
      {!confirming ? (
        <button
          type="button"
          onClick={() => { setConfirming(true); setResult(null); setError(null); }}
          className="rounded-sm border border-charcoal/15 px-3.5 py-2 text-xs font-semibold text-charcoal/70 hover:border-charcoal/30"
        >
          Renvoyer le lien de vérification aux emails non vérifiés
        </button>
      ) : (
        <div className="rounded-sm border border-gold/30 bg-gold/10 p-4">
          <p className="mb-3 text-sm text-charcoal">
            Renvoyer un lien de vérification à <strong>{unverifiedCount} compte(s)</strong> avec un
            email non vérifié ? Les comptes ayant déjà reçu un lien il y a moins de 3 jours seront
            automatiquement ignorés.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={send}
              disabled={loading}
              className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
            >
              {loading ? "Envoi en cours…" : "Confirmer l'envoi"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={loading}
              className="rounded-sm border border-charcoal/15 px-4 py-2 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {error && <p role="alert" className="mt-2 rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}

      {result && (
        <p className="mt-2 text-xs text-charcoal/60">
          {result.sentCount} email(s) envoyé(s)
          {result.skippedCount > 0 && ` · ${result.skippedCount} ignoré(s) (déjà relancé récemment)`}
          {result.failedCount > 0 && ` · ${result.failedCount} échec(s)`}
        </p>
      )}
    </div>
  );
}
