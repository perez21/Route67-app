"use client";

import { useState } from "react";

type Campaign = {
  id: string;
  subject: string;
  body: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  sentByName: string;
  createdAt: string;
};

export default function AdminCampaignsManager({ initialCampaigns, userCounts }: { initialCampaigns: Campaign[]; userCounts: { all: number; premium: number; free: number; verified: number; unverified: number } }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "premium" | "free" | "verified" | "unverified">("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const audienceCount = userCounts[audience];

  async function send() {
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, audience }),
    });

    setLoading(false);
    setConfirming(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    const data = await res.json();
    setCampaigns((prev) => [data.campaign, ...prev]);
    setSubject("");
    setBody("");
  }

  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-900">
        Utilise <code>{"{{name}}"}</code> dans le sujet ou le message pour insérer automatiquement le
        prénom de chaque destinataire.
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setConfirming(true); }}
        className="space-y-3 rounded-sm border border-charcoal/10 bg-white p-5"
      >
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">Destinataires</label>
          <select value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)} className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm sm:w-64 transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15">
            <option value="all">Tous les utilisateurs ({userCounts.all})</option>
            <option value="premium">Membres Premium ({userCounts.premium})</option>
            <option value="free">Membres Gratuits ({userCounts.free})</option>
            <option value="verified">Emails vérifiés ({userCounts.verified})</option>
            <option value="unverified">Emails non vérifiés ({userCounts.unverified})</option>
          </select>
        </div>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Objet de l'email — ex. Rencontre en ligne Route 67 le 20 juillet"
          required
          className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={"Bonjour {{name}},\n\nNous organisons..."}
          rows={7}
          required
          className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
        />
        {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}

        {!confirming ? (
          <button type="submit" disabled={loading} className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">
            Prévisualiser l&apos;envoi
          </button>
        ) : (
          <div className="rounded-sm border border-gold/30 bg-gold/10 p-4">
            <p className="mb-3 text-sm text-charcoal">
              Envoyer cet email à <strong>{audienceCount} destinataire(s)</strong> ? Cette action ne
              peut pas être annulée une fois lancée.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={send} disabled={loading} className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">
                {loading ? "Envoi en cours…" : `Envoyer à ${audienceCount} personne(s)`}
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="rounded-sm border border-charcoal/15 px-4 py-2 text-sm">
                Annuler
              </button>
            </div>
          </div>
        )}
      </form>

      <div>
        <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
          Campagnes envoyées ({campaigns.length})
        </h2>
        {campaigns.length === 0 ? (
          <p className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm text-charcoal/55">Aucune campagne envoyée pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.id} className="rounded-sm border border-charcoal/10 bg-white p-4">
                <p className="font-semibold text-ink">{c.subject}</p>
                <p className="mb-2 text-xs text-charcoal/50">
                  Envoyée par {c.sentByName} le {new Date(c.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  {" · "}{c.sentCount}/{c.recipientCount} envoyés{c.failedCount > 0 && `, ${c.failedCount} échec(s)`}
                </p>
                <p className="whitespace-pre-wrap text-sm text-charcoal/70">{c.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
