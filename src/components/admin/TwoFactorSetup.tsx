"use client";

import { useState } from "react";

export default function TwoFactorSetup({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [step, setStep] = useState<"idle" | "scanning" | "disabling">("idle");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startSetup() {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/account/2fa/setup", { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      setError("Impossible de démarrer la configuration.");
      return;
    }
    const data = await res.json();
    setQrCodeDataUrl(data.qrCodeDataUrl);
    setSecret(data.secret);
    setStep("scanning");
  }

  async function confirmEnable(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/account/2fa/enable", {
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
    setEnabled(true);
    setStep("idle");
    setCode("");
  }

  async function confirmDisable(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/account/2fa/disable", {
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
    setEnabled(false);
    setStep("idle");
    setCode("");
  }

  if (enabled && step !== "disabling") {
    return (
      <div className="rounded-sm border border-forest/20 bg-forest/5 p-5 text-sm">
        <p className="mb-3 text-forest">✓ La double authentification est active sur ce compte.</p>
        <button onClick={() => setStep("disabling")} className="rounded-sm border border-rust/30 px-4 py-2 text-xs font-semibold text-rust">
          Désactiver
        </button>
      </div>
    );
  }

  if (step === "disabling") {
    return (
      <form onSubmit={confirmDisable} className="space-y-3 rounded-sm border border-rust/20 bg-rust/5 p-5">
        <p className="text-sm text-charcoal/70">Saisis un code de ton application d&apos;authentification pour confirmer la désactivation.</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          placeholder="123456"
          className="w-40 rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-center font-mono text-lg tracking-widest transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
        />
        {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={loading || code.length !== 6} className="rounded-sm bg-rust px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">
            Confirmer la désactivation
          </button>
          <button type="button" onClick={() => { setStep("idle"); setCode(""); }} className="rounded-sm border border-charcoal/15 px-4 py-2 text-xs">
            Annuler
          </button>
        </div>
      </form>
    );
  }

  if (step === "scanning") {
    return (
      <form onSubmit={confirmEnable} className="space-y-4 rounded-sm border border-gold/30 bg-gold/5 p-5">
        <p className="text-sm text-charcoal/70">
          Scanne ce QR code avec Google Authenticator, Microsoft Authenticator ou Authy, puis saisis
          le code à 6 chiffres généré pour confirmer.
        </p>
        {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="QR code de configuration 2FA" className="h-40 w-40" />}
        <p className="font-mono text-xs text-charcoal/50">Clé manuelle : {secret}</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          placeholder="123456"
          className="w-40 rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-center font-mono text-lg tracking-widest transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
        />
        {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={loading || code.length !== 6} className="rounded-sm bg-gold px-4 py-2 text-xs font-semibold text-ink disabled:opacity-60">
            Activer la 2FA
          </button>
          <button type="button" onClick={() => setStep("idle")} className="rounded-sm border border-charcoal/15 px-4 py-2 text-xs">
            Annuler
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm">
      <p className="mb-3 text-charcoal/70">
        La double authentification protège ce compte avec un code temporaire en plus du mot de
        passe, généré par une application comme Google Authenticator.
      </p>
      {error && <p role="alert" className="mb-3 rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
      <button onClick={startSetup} disabled={loading} className="rounded-sm bg-gold px-4 py-2 text-xs font-semibold text-ink disabled:opacity-60">
        {loading ? "Préparation…" : "Activer la double authentification"}
      </button>
    </div>
  );
}
