import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LAST_KNOWN_THRESHOLD } from "@/lib/crs";
import PrintButton from "@/components/PrintButton";
import LocalDateTime from "@/components/LocalDateTime";

export default async function PrintChecklistPage() {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const [user, profile, checklistItems] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, select: { name: true, email: true } }),
    prisma.profile.findUnique({ where: { userId: session.userId } }),
    prisma.checklistItem.findMany({ where: { userId: session.userId }, orderBy: { order: "asc" } }),
  ]);
  if (!user) redirect("/login");

  const doneCount = checklistItems.filter((i: { done: boolean }) => i.done).length;
  const pct = checklistItems.length > 0 ? Math.round((doneCount / checklistItems.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 print:px-0 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <p className="text-sm text-charcoal/60">Aperçu avant impression — utilise « Enregistrer en PDF » dans la fenêtre d&apos;impression.</p>
        <PrintButton />
      </div>

      <div className="border-b-2 border-ink pb-4">
        <p className="font-display text-2xl font-bold text-ink">Route 67 — Suivi de procédure Entrée express</p>
        <p className="mt-1 text-sm text-charcoal/60">
          Document généré le <LocalDateTime iso={new Date().toISOString()} />
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <p><strong>Candidat :</strong> {user.name}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Score CRS enregistré :</strong> {profile?.crsScore ?? 0} / 1200</p>
        <p><strong>Seuil du dernier tirage :</strong> {LAST_KNOWN_THRESHOLD}</p>
      </div>

      <div className="mt-6">
        <div className="mb-1 flex items-center justify-between text-sm font-semibold text-ink">
          <span>Avancement global</span>
          <span>{pct}% ({doneCount}/{checklistItems.length})</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-parchment2 print:border print:border-charcoal/30">
          <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <table className="mt-8 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-ink text-left">
            <th className="py-2 pr-2 font-semibold">#</th>
            <th className="py-2 pr-2 font-semibold">Étape</th>
            <th className="py-2 pr-2 font-semibold">Statut</th>
            <th className="py-2 font-semibold">Date d&apos;exécution</th>
          </tr>
        </thead>
        <tbody>
          {checklistItems.map((item: { id: string; label: string; done: boolean; completedAt: Date | null }, i: number) => (
            <tr key={item.id} className="border-b border-charcoal/15">
              <td className="py-2 pr-2 align-top font-mono text-xs text-charcoal/50">{i + 1}</td>
              <td className="py-2 pr-2 align-top">{item.label}</td>
              <td className="py-2 pr-2 align-top">{item.done ? "✓ Fait" : "En attente"}</td>
              <td className="py-2 align-top">
                {item.completedAt ? <LocalDateTime iso={item.completedAt.toISOString()} options={{ day: "numeric", month: "short", year: "numeric" }} /> : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-8 text-xs text-charcoal/50">
        Route 67 n&apos;est pas un cabinet ni un agent d&apos;immigration agréé — ce document est un
        outil de suivi personnel, pas une pièce officielle du dossier d&apos;immigration.
      </p>
    </div>
  );
}
