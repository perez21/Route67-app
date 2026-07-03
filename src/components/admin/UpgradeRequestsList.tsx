"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  requestedTier: string;
  momoOperator: string | null;
  momoReference: string | null;
  momoName: string | null;
  createdAt: string;
  user: { name: string; email: string };
};

export default function UpgradeRequestsList({ requests }: { requests: Row[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function review(id: string, approve: boolean) {
    setPendingId(id);
    await fetch(`/api/admin/upgrade-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approve }),
    });
    setPendingId(null);
    router.refresh();
  }

  if (requests.length === 0) {
    return <p className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm text-charcoal/55">Aucune demande en attente.</p>;
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-charcoal/10 bg-white p-4">
          <div className="text-sm">
            <p className="font-semibold text-ink">{r.user.name} <span className="font-normal text-charcoal/50">({r.user.email})</span></p>
            <p className="text-charcoal/60">
              Demande : <strong>{r.requestedTier}</strong> —{" "}
              {r.momoOperator === "orange_money" ? "Orange Money" : r.momoOperator === "paypal" ? "PayPal" : "MTN MoMo"} —{" "}
              réf. <code className="rounded bg-parchment2 px-1.5 py-0.5">{r.momoReference || "non renseignée"}</code>
              {r.momoName && <> — nom : <strong>{r.momoName}</strong></>}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => review(r.id, true)}
              disabled={pendingId === r.id}
              className="rounded-sm bg-forest px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              Confirmer le paiement
            </button>
            <button
              onClick={() => review(r.id, false)}
              disabled={pendingId === r.id}
              className="rounded-sm border border-rust/30 px-3 py-1.5 text-xs font-semibold text-rust disabled:opacity-60"
            >
              Rejeter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
