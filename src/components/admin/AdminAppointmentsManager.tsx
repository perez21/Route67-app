"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Appointment = {
  id: string;
  slot: string;
  status: string;
  note: string | null;
  meetingLink: string | null;
  adminNote: string | null;
  user: { name: string; email: string };
};

const APPOINTMENT_DURATION_MINUTES = 30;

function formatSlot(iso: string) {
  const start = new Date(iso);
  const end = new Date(start.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);
  return {
    day: start.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
    startTime: start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    endTime: end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function AdminAppointmentsManager({ initialAppointments, viewerIsAdmin }: { initialAppointments: Appointment[]; viewerIsAdmin: boolean }) {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [meetingLink, setMeetingLink] = useState("");

  async function review(id: string, status: "CONFIRMED" | "DECLINED" | "CANCELLED", link?: string) {
    if (status === "CANCELLED" && !window.confirm("Annuler ce rendez-vous confirmé ? Un message d'excuse sera envoyé à la personne.")) return;
    setPendingId(id);
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, meetingLink: link || undefined }),
    });
    setPendingId(null);
    if (res.ok) {
      const data = await res.json();
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: data.appointment.status, meetingLink: data.appointment.meetingLink, adminNote: data.appointment.adminNote } : a)));
      setConfirmingId(null);
      setMeetingLink("");
    }
    router.refresh();
  }

  if (appointments.length === 0) {
    return <p className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm text-charcoal/55">Aucune demande de rendez-vous.</p>;
  }

  return (
    <div className="space-y-3">
      {appointments.map((a) => (
        <div key={a.id} className="rounded-sm border border-charcoal/10 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-semibold text-ink">{a.user.name} <span className="font-normal text-charcoal/50">({a.user.email})</span></p>
              <p className="text-charcoal/60">
                <span className="capitalize">{formatSlot(a.slot).day}</span> · {formatSlot(a.slot).startTime} – {formatSlot(a.slot).endTime}
                {a.note && <> — {a.note}</>}
              </p>
              {a.meetingLink && <p className="text-xs text-forest">Lien visio : {a.meetingLink}</p>}
              {a.adminNote && <p className="text-xs italic text-charcoal/50">Note envoyée : {a.adminNote}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                  a.status === "CONFIRMED"
                    ? "bg-forest/10 text-forest"
                    : a.status === "DECLINED" || a.status === "CANCELLED"
                    ? "bg-rust/10 text-rust"
                    : "bg-gold/15 text-gold"
                }`}
              >
                {a.status}
              </span>
              {a.status === "PENDING" && viewerIsAdmin && (
                <>
                  <button
                    onClick={() => setConfirmingId(confirmingId === a.id ? null : a.id)}
                    disabled={pendingId === a.id}
                    className="rounded-sm bg-forest px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => review(a.id, "DECLINED")}
                    disabled={pendingId === a.id}
                    className="rounded-sm border border-rust/30 px-3 py-1.5 text-xs font-semibold text-rust disabled:opacity-60"
                  >
                    Refuser
                  </button>
                </>
              )}
              {a.status === "CONFIRMED" && viewerIsAdmin && (
                <button
                  onClick={() => review(a.id, "CANCELLED")}
                  disabled={pendingId === a.id}
                  className="rounded-sm border border-rust/30 px-3 py-1.5 text-xs font-semibold text-rust disabled:opacity-60"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>

          {confirmingId === a.id && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-charcoal/10 pt-3">
              <input
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="Lien de visioconférence (Meet, WhatsApp, Zoom…) — optionnel"
                className="flex-1 min-w-[220px] rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
              />
              <button
                onClick={() => review(a.id, "CONFIRMED", meetingLink)}
                disabled={pendingId === a.id}
                className="rounded-sm bg-forest px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                Confirmer avec ce lien
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
