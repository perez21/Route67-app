"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inputClasses, inputErrorClasses, labelClasses, primaryButtonClasses, formCardClasses } from "@/lib/formStyles";
import { useLanguage } from "@/contexts/LanguageContext";

function BrandPanel() {
  const { t } = useLanguage();
  return (
    <div className="relative hidden overflow-hidden bg-ink px-10 py-16 text-parchment lg:flex lg:w-1/2 lg:flex-col lg:justify-center">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative max-w-md">
        <Link href="/" className="mb-4 block font-display text-4xl font-bold">
          <span className="text-cmr-green">Route</span> <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
        </Link>
        <p className="text-xl leading-relaxed text-parchment/85">
          {t("auth.register.tagline")}
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

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError(t("auth.fillAllFields"));
      return;
    }

    if (name.trim().length < 2) {
      setError(t("auth.register.errorNameTooShort"));
      return;
    }

    if (password.length < 10) {
      setError(t("auth.register.errorPasswordTooShort"));
      return;
    }

    if (!acceptedDisclaimer) {
      setError(t("auth.register.errorDisclaimer"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.register.errorMismatch"));
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, acceptedDisclaimer }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? t("auth.genericError"));
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const passwordMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  return (
    <main className="flex min-h-screen">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center bg-parchment2/40 px-4 py-12 sm:px-6">
        <div className={`w-full max-w-sm ${formCardClasses}`}>
          <Link href="/" className="mb-6 block text-center font-display text-2xl font-bold text-ink lg:hidden">
            <span className="text-cmr-green">Route</span> <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
          </Link>
          <h1 className="mb-1 font-display text-2xl font-bold text-ink">{t("auth.register.title")}</h1>
          <p className="mb-6 text-sm text-charcoal/60">
            {t("auth.register.alreadyAccount")} <Link href="/login" className="font-semibold text-rust hover:underline">{t("auth.register.login")}</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="name" className={labelClasses}>{t("auth.register.nameLabel")}</label>
              <input
                id="name"
                type="text"
                autoComplete="nickname"
                placeholder={t("auth.register.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>{t("auth.register.emailLabel")}</label>
              <input
                id="email"
                type="text" inputMode="email"
                autoComplete="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClasses}>{t("auth.register.passwordLabel")}</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder={t("auth.register.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
              />
              <p className="mt-1.5 text-xs text-charcoal/45">{t("auth.register.passwordHint")}</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClasses}>{t("auth.register.confirmPasswordLabel")}</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder={t("auth.register.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClasses} ${passwordMismatch ? inputErrorClasses : ""}`}
              />
              {passwordMismatch && (
                <p className="mt-1.5 text-xs text-rust">{t("auth.register.passwordMismatch")}</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-900">
              <input
                type="checkbox"
                checked={acceptedDisclaimer}
                onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-shrink-0 accent-forest"
              />
              <span>
                {t("auth.register.disclaimerPre")} <strong>{t("auth.register.disclaimerBold")}</strong>{t("auth.register.disclaimerPost")}
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-rust/10 px-4 py-2.5 text-sm text-rust">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || passwordMismatch}
              className={`w-full ${primaryButtonClasses}`}
            >
              {loading ? t("auth.register.submitting") : t("auth.register.title")}
            </button>

            <p className="flex items-start justify-center gap-1.5 text-xs leading-relaxed text-charcoal/45">
              <span aria-hidden>🔒</span>
              <span>{t("auth.register.privacyNote")}</span>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
