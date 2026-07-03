"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "MODERATOR" | "ADMIN";
  tier: "FREE" | "PREMIUM";
  tierExpiresAt: string | null;
  crsScore: number | null;
  warned: boolean;
};

const ROLE_LABEL: Record<Row["role"], string> = { USER: "Utilisateur", MODERATOR: "Modérateur", ADMIN: "Administrateur" };

function daysRemaining(iso: string | null): number | null {
  if (!iso) return null;
  const diffMs = new Date(iso).getTime() - Date.now();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

export default function AdminUsersTable({ users, viewerIsAdmin, viewerId }: { users: Row[]; viewerIsAdmin: boolean; viewerId: string }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function update(userId: string, data: Partial<{ role: string; tier: string; warned: boolean; warningReason: string }>) {
    setPendingId(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...data }),
    });
    setPendingId(null);
    if (res.ok) router.refresh();
    else {
      const d = await res.json().catch(() => ({}));
      window.alert(d.error ?? "Action impossible.");
      router.refresh();
    }
  }

  async function remove(u: Row) {
    if (!window.confirm(`Supprimer définitivement le compte de ${u.name} ? Cette action est irréversible.`)) return;
    setPendingId(u.id);
    const res = await fetch(`/api/admin/users?userId=${u.id}`, { method: "DELETE" });
    setPendingId(null);
    if (res.ok) router.refresh();
    else {
      const data = await res.json().catch(() => ({}));
      window.alert(data.error ?? "Suppression impossible.");
    }
  }

  function toggleWarning(u: Row) {
    if (u.warned) {
      update(u.id, { warned: false });
      return;
    }
    const reason = window.prompt("Raison de l'avertissement (visible par l'équipe uniquement) :", "");
    if (reason === null) return;
    update(u.id, { warned: true, warningReason: reason });
  }

  async function changePassword(u: Row) {
    const newPassword = window.prompt(
      `Nouveau mot de passe pour ${u.name} (au moins 10 caractères, une majuscule, un chiffre) :`,
      ""
    );
    if (!newPassword) return;

    setPendingId(u.id);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: u.id, newPassword }),
    });
    setPendingId(null);

    if (res.ok) {
      window.alert(`Mot de passe mis à jour pour ${u.name}.`);
    } else {
      const data = await res.json().catch(() => ({}));
      window.alert(data.error ?? "Impossible de changer ce mot de passe.");
    }
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-charcoal/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-charcoal/10 text-[11px] uppercase tracking-wide text-charcoal/50">
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Score CRS</th>
            <th className="px-4 py-3 font-medium">Rôle</th>
            <th className="px-4 py-3 font-medium">Forfait</th>
            <th className="px-4 py-3 font-medium">Avertissement</th>
            <th className="px-4 py-3 font-medium">Suivi</th>
            <th className="px-4 py-3 font-medium">Mot de passe</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            // Un modérateur ne voit et ne peut effectuer AUCUNE opération
            // sur un compte administrateur : ces cellules restent vides
            // pour lui plutôt que simplement désactivées.
            const isSelf = u.id === viewerId;
            const targetIsAdmin = u.role === "ADMIN";
            const moderatorBlocked = targetIsAdmin && !viewerIsAdmin;
            const neverExpires = u.role === "ADMIN" || u.role === "MODERATOR";
            const remaining = u.tier === "PREMIUM" && !neverExpires ? daysRemaining(u.tierExpiresAt) : null;

            return (
              <tr key={u.id} className="border-b border-charcoal/5">
                <td className="px-4 py-3 font-medium text-ink">
                  {u.name}
                  {!moderatorBlocked && u.warned && <span className="ml-2 rounded-full bg-rust/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-rust">⚠ averti</span>}
                </td>
                <td className="px-4 py-3 text-charcoal/60">{u.email}</td>
                <td className="px-4 py-3 font-mono">{u.crsScore ?? "—"}</td>
                <td className="px-4 py-3">
                  {viewerIsAdmin && !(isSelf) ? (
                    <select
                      value={u.role}
                      disabled={pendingId === u.id}
                      onChange={(e) => update(u.id, { role: e.target.value })}
                      className="rounded-sm border border-charcoal/15 px-2 py-1.5 text-xs"
                    >
                      <option value="USER">Utilisateur</option>
                      <option value="MODERATOR">Modérateur</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                  ) : (
                    <span className="text-xs text-charcoal/60">{ROLE_LABEL[u.role]}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {moderatorBlocked ? (
                    <span className="text-xs text-charcoal/30">—</span>
                  ) : (
                    <>
                      <select
                        value={u.tier}
                        disabled={pendingId === u.id || (isSelf && viewerIsAdmin)}
                        onChange={(e) => update(u.id, { tier: e.target.value })}
                        className="mb-1 rounded-sm border border-charcoal/15 px-2 py-1.5 text-xs disabled:opacity-50"
                      >
                        <option value="FREE">Gratuit</option>
                        <option value="PREMIUM">Premium</option>
                      </select>
                      {u.tier === "PREMIUM" && (
                        <p className={`font-mono text-[10px] ${remaining !== null && remaining <= 5 ? "text-rust" : "text-charcoal/45"}`}>
                          {neverExpires
                            ? "n'expire jamais"
                            : u.tierExpiresAt
                            ? `expire le ${new Date(u.tierExpiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`
                            : "sans date d'expiration"}
                        </p>
                      )}
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  {moderatorBlocked ? (
                    <span className="text-xs text-charcoal/30">—</span>
                  ) : (
                    <button
                      onClick={() => toggleWarning(u)}
                      disabled={pendingId === u.id}
                      className={`rounded-sm border px-3 py-1.5 text-xs font-semibold ${
                        u.warned ? "border-rust/30 text-rust" : "border-charcoal/15 text-charcoal/60"
                      }`}
                    >
                      {u.warned ? "Retirer l'avertissement" : "Avertir"}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  {moderatorBlocked ? (
                    <span className="text-xs text-charcoal/30">—</span>
                  ) : (
                    <Link href={`/admin/utilisateurs/${u.id}`} className="text-xs font-semibold text-rust underline">
                      Voir le suivi
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3">
                  {viewerIsAdmin ? (
                    <button
                      onClick={() => changePassword(u)}
                      disabled={pendingId === u.id}
                      className="text-xs font-semibold text-charcoal/60 underline disabled:opacity-50"
                    >
                      Changer
                    </button>
                  ) : (
                    <span className="text-xs text-charcoal/30">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {!moderatorBlocked && !isSelf && (
                    <button
                      onClick={() => remove(u)}
                      disabled={pendingId === u.id}
                      className="text-xs font-semibold text-rust disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
