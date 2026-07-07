import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { expirePremiumIfNeeded, isStaff } from "@/lib/session";
import { prisma } from "@/lib/db";
import { LAST_KNOWN_THRESHOLD } from "@/lib/crs";
import { getMomoNumbers, getTeamContact } from "@/lib/mailer";
import { getPremiumPrice } from "@/lib/site";
import LogoutButton from "@/components/LogoutButton";
import ChecklistWidget from "@/components/ChecklistWidget";
import UpgradePanel from "@/components/UpgradePanel";
import AiAssistantWidget from "@/components/AiAssistantWidget";
import Disclaimer from "@/components/Disclaimer";

const TIER_LABEL: Record<string, string> = {
  FREE: "Compte gratuit",
  PREMIUM: "Soutien Premium",
};

export default async function DashboardPage() {
  const token = (await cookies()).get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  await expirePremiumIfNeeded(session.userId);

  const [user, profile, checklistItems, pendingUpgrade] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, select: { name: true, role: true, tier: true } }),
    prisma.profile.findUnique({ where: { userId: session.userId } }),
    prisma.checklistItem.findMany({ where: { userId: session.userId }, orderBy: { order: "asc" } }),
    prisma.upgradeRequest.findFirst({ where: { userId: session.userId, status: "PENDING" } }),
  ]);

  if (!user) redirect("/login");

  const score = profile?.crsScore ?? 0;
  const progressPct = Math.min(100, Math.round((score / LAST_KNOWN_THRESHOLD) * 100));
  const isPremium = user.tier === "PREMIUM";

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="flex flex-row items-center gap-6 overflow-x-auto bg-ink px-6 py-5 text-parchment md:flex-col md:items-stretch md:gap-1 md:py-7">
        <Link href="/" className="font-display text-xl font-bold md:mb-8">
          <span className="text-cmr-green">Route</span> <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
        </Link>
        <nav className="flex gap-2 text-sm md:flex-col md:gap-0.5">
          <span className="rounded-sm bg-gold2/15 px-3 py-2.5 font-semibold text-gold2">Tableau de bord</span>
          <Link href="/simulateur" className="rounded-sm px-3 py-2.5 text-parchment/70">Simulateur</Link>
          <Link href="/procedure" className="rounded-sm px-3 py-2.5 text-parchment/70">Procédure Entrée express</Link>
          <Link href="/forum" className="rounded-sm px-3 py-2.5 text-parchment/70">
            Forum
          </Link>
          <Link href="/rendez-vous" className="rounded-sm px-3 py-2.5 text-parchment/70">
            Rendez-vous {!isPremium && <span className="ml-1 text-[10px] text-gold2">Premium</span>}
          </Link>
          <Link href="/dashboard/chat" className="rounded-sm px-3 py-2.5 text-parchment/70">
            Chat {!isPremium && <span className="ml-1 text-[10px] text-gold2">Premium</span>}
          </Link>
          <Link href="/faq" className="rounded-sm px-3 py-2.5 text-parchment/70">FAQ</Link>
          {isStaff(user.role) && (
            <Link href="/admin" className="rounded-sm px-3 py-2.5 text-cmr-yellow">Espace admin</Link>
          )}
        </nav>
      </aside>

      <main className="px-6 py-8 md:px-11 md:py-9">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold">Bonjour, {user.name?.split(" ")[0] ?? "candidat"}</h1>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-charcoal/15 bg-white px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide">
              {TIER_LABEL[user.tier] ?? "Compte gratuit"}
            </span>
            <LogoutButton />
          </div>
        </div>

        {/* Communauté & accompagnement — forum ouvert à tous les membres ; rendez-vous et chat restent Premium */}
        <div className="mb-6">
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
            Communauté & accompagnement
          </h2>
          <div className="grid gap-3 rounded-sm border border-charcoal/10 bg-white p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/forum" className="flex items-center justify-between rounded-sm border border-charcoal/10 px-3.5 py-3">
              <span>Forum d&apos;entraide</span>
              <span className="text-rust">→</span>
            </Link>
            <Link href="/rendez-vous" className="flex items-center justify-between rounded-sm border border-charcoal/10 px-3.5 py-3">
              <span>
                Rencontre virtuelle avec l&apos;équipe
                {!isPremium && <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] uppercase text-gold">Premium</span>}
              </span>
              <span className="text-rust">→</span>
            </Link>
            <Link href="/dashboard/chat" className="flex items-center justify-between rounded-sm border border-charcoal/10 px-3.5 py-3">
              <span>
                Chat avec l&apos;équipe
                {!isPremium && <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] uppercase text-gold">Premium</span>}
              </span>
              <span className="text-rust">→</span>
            </Link>
            <Link href="/faq" className="flex items-center justify-between rounded-sm border border-charcoal/10 px-3.5 py-3">
              <span>FAQ</span>
              <span className="text-rust">→</span>
            </Link>
          </div>
          <p className="mt-2 text-xs text-charcoal/50">
            {isPremium || isStaff(user.role)
              ? "L'assistant IA en bas à droite répond aussi à tes questions sur l'Entrée express, 24h/24."
              : "L'assistant IA (en bas à droite) est réservé aux membres Premium."}
          </p>
        </div>

        <div className="mb-6 grid gap-5 md:grid-cols-[1.3fr_1fr]">
          <div className="rounded-sm border border-charcoal/10 bg-white p-6">
            <h2 className="mb-5 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
              Votre score CRS
            </h2>
            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-mono text-6xl font-semibold">{score}</span>
              {score > 0 && (
                <span className="rounded-full bg-forest/10 px-2.5 py-1 font-mono text-sm text-forest">
                  score enregistré
                </span>
              )}
            </div>
            {score === 0 && (
              <p className="mb-5 text-sm text-charcoal/60">
                Passe le simulateur pour calculer et enregistrer ton score.
              </p>
            )}
            <div className="h-2 overflow-hidden rounded-full bg-parchment2">
              <div className="h-full bg-gradient-to-r from-gold to-gold2" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[11px] text-charcoal/50">
              <span>0</span>
              <span>1200</span>
            </div>
            <Link href="/simulateur" className="mt-5 inline-block text-sm font-semibold text-rust underline">
              Recalculer mon score →
            </Link>
            <Disclaimer variant="compact" className="mt-4" />
          </div>

          <div className="rounded-sm border border-charcoal/10 bg-white p-6">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
                Suivi de la procédure
              </h2>
              <Link href="/dashboard/suivi/imprimer" className="text-xs font-semibold text-rust underline">
                Imprimer (PDF)
              </Link>
            </div>
            <p className="mb-4 text-xs text-charcoal/50">
              Du test de langue à l&apos;obtention du visa — coche chaque étape, la date est enregistrée automatiquement.
            </p>
            {checklistItems.length === 0 ? (
              <p className="text-sm text-charcoal/55">Aucun élément de suivi pour le moment.</p>
            ) : (
              <ChecklistWidget initialItems={checklistItems} />
            )}
          </div>
        </div>

        <div id="don" className="mb-6 scroll-mt-6">
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
            Faire un don / soutenir Route 67
          </h2>
          <UpgradePanel currentTier={user.tier} hasPending={Boolean(pendingUpgrade)} momo={getMomoNumbers()} contact={getTeamContact()} premiumPrice={getPremiumPrice()} />
        </div>

        <div className="rounded-sm border border-charcoal/10 bg-white p-6">
          <h2 className="mb-1 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
            Alertes
          </h2>
          <p className="py-6 text-center text-sm text-charcoal/50">
            Les alertes personnalisées (nouveau tirage pertinent, échéances de dossier) arrivent
            dans une prochaine itération — voir le README pour le plan d&apos;implémentation
            (email / WhatsApp).
          </p>
        </div>
      </main>

      {(isPremium || isStaff(user.role)) && <AiAssistantWidget />}
    </div>
  );
}
