"use client";

import { useEffect, useMemo, useState } from "react";
import { inputClasses } from "@/lib/formStyles";

type Appointment = { id: string; slot: string; status: string; note: string | null; meetingLink?: string | null; adminNote?: string | null };
type SlotInfo = { iso: string; taken: boolean };

const APPOINTMENT_DURATION_MINUTES = 30;
const MAX_APPOINTMENTS_PER_WEEK = 1;

function formatSlot(iso: string) {
  const start = new Date(iso);
  const end = new Date(start.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);
  return {
    day: start.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
    dateKey: start.toISOString().slice(0, 10),
    startTime: start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    endTime: end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
}

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Lundi de la semaine civile contenant cette date (0 = dimanche).
function weekKey(d: Date) {
  const day = d.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(monday.getDate() + offset);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

export default function BookingCalendar({ isPremium, initialAppointments }: { isPremium: boolean; initialAppointments: Appointment[] }) {
  const [allSlots, setAllSlots] = useState<SlotInfo[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(new Date()));
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/appointments/availability")
      .then((r) => r.json())
      .then((d) => setAllSlots(d.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, []);

  const availableDates = useMemo(() => {
    const days = new Set(allSlots.map((s) => formatSlot(s.iso).dateKey));
    return Array.from(days).sort();
  }, [allSlots]);

  const slotsForSelectedDate = useMemo(
    () => allSlots.filter((s) => formatSlot(s.iso).dateKey === selectedDate),
    [allSlots, selectedDate]
  );

  // Nombre de rendez-vous encore actifs (en attente/confirmés) de
  // l'utilisateur pour la semaine civile de la date sélectionnée — au-delà
  // de 2, aucun créneau de cette semaine ne peut être choisi ou compté,
  // quel que soit son statut de disponibilité par ailleurs.
  const activeCountForSelectedWeek = useMemo(() => {
    const key = weekKey(new Date(selectedDate));
    return appointments.filter((a) => (a.status === "PENDING" || a.status === "CONFIRMED") && weekKey(new Date(a.slot)) === key).length;
  }, [appointments, selectedDate]);
  const weekLimitReached = activeCountForSelectedWeek >= MAX_APPOINTMENTS_PER_WEEK;

  async function book() {
    if (!selected) return;
    setError(null);
    setLoading(true);

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot: selected, note }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 409 && data.error && !data.error.includes("semaine")) {
        setAllSlots((prev) => prev.map((s) => (s.iso === selected ? { ...s, taken: true } : s)));
        setSelected(null);
      }
      setError(data.error ?? "Impossible de réserver ce créneau.");
      return;
    }

    const data = await res.json();
    setAppointments((prev) => [data.appointment, ...prev]);
    setAllSlots((prev) => prev.map((s) => (s.iso === selected ? { ...s, taken: true } : s)));
    setSelected(null);
    setNote("");
  }

  async function cancel(id: string) {
    if (!window.confirm("Annuler ce rendez-vous ?")) return;
    setCancellingId(id);
    const res = await fetch(`/api/appointments/${id}`, { method: "PATCH" });
    setCancellingId(null);
    if (res.ok) {
      const data = await res.json();
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: data.appointment.status } : a)));
    }
  }

  return (
    <div className="space-y-8">
      {!isPremium && (
        <div className="rounded-sm border border-gold/30 bg-gold/10 p-4 text-sm text-charcoal">
          La prise de rendez-vous avec l&apos;équipe est réservée au forfait Premium. Tu peux
          voir les disponibilités ci-dessous, mais réserver nécessite de{" "}
          <a href="/dashboard#don" className="font-semibold text-rust underline">passer à ce forfait</a>.
        </div>
      )}

      <div>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
          Choisir une date
        </h2>
        {loadingSlots ? (
          <p className="text-sm text-charcoal/50">Chargement des disponibilités…</p>
        ) : (
          <>
            <input
              type="date"
              value={selectedDate}
              min={toDateInputValue(new Date())}
              onChange={(e) => { setSelectedDate(e.target.value); setSelected(null); }}
              list="route67-available-dates"
              className="rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 text-sm transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15"
            />
            <datalist id="route67-available-dates">
              {availableDates.map((d) => <option key={d} value={d} />)}
            </datalist>
            <p className="mt-1.5 text-xs text-charcoal/45">
              {availableDates.length === 0
                ? "Aucune date ouverte pour le moment — l'équipe ajoute ses disponibilités depuis l'espace admin."
                : `Dates ouvertes : ${availableDates.slice(0, 6).map((d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })).join(", ")}${availableDates.length > 6 ? "…" : ""}`}
            </p>

            {weekLimitReached && (
              <p className="mt-3 rounded-sm border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-charcoal">
                Tu as déjà {MAX_APPOINTMENTS_PER_WEEK} rendez-vous cette semaine-là. C&apos;est le
                maximum. Choisis une autre semaine, ou reviens ici si l&apos;un de tes rendez-vous est
                refusé/annulé.
              </p>
            )}

            <div className="mt-4">
              {slotsForSelectedDate.length === 0 ? (
                <p className="rounded-sm border border-charcoal/10 bg-white p-4 text-sm text-charcoal/55">
                  Aucun créneau ouvert ce jour-là. choisis une autre date.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slotsForSelectedDate.map((s) => {
                    const { startTime, endTime } = formatSlot(s.iso);
                    const isSelected = selected === s.iso;
                    const blocked = s.taken || weekLimitReached;
                    return (
                      <button
                        key={s.iso}
                        disabled={!isPremium || blocked}
                        onClick={() => setSelected(s.iso)}
                        title={s.taken ? "Déjà réservé" : weekLimitReached ? "Limite de 1 rendez-vous par semaine atteinte" : undefined}
                        className={`rounded-sm border px-3 py-2 font-mono text-sm ${
                          blocked
                            ? "cursor-not-allowed border-charcoal/10 bg-parchment2/70 text-charcoal/30 line-through"
                            : isSelected
                            ? "border-gold bg-gold/20 text-ink"
                            : "border-charcoal/15 bg-white text-charcoal disabled:opacity-40"
                        }`}
                      >
                        {startTime} – {endTime}
                        {s.taken && <span className="ml-1.5 text-[10px] uppercase">Pris</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selected && isPremium && !weekLimitReached && (
        <div className="rounded-md border border-charcoal/10 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm">
            Créneau choisi :{" "}
            <strong className="capitalize">{formatSlot(selected).day}</strong>, de{" "}
            <strong>{formatSlot(selected).startTime}</strong> à <strong>{formatSlot(selected).endTime}</strong>
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Sujet à aborder (optionnel)"
            rows={2}
            className={`mb-3 ${inputClasses} resize-y`}
          />
          {error && <p role="alert" className="mb-3 rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
          <button onClick={book} disabled={loading} className="rounded-sm bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60">
            {loading ? "Réservation…" : "Confirmer ma réservation"}
          </button>
        </div>
      )}

      <div>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">Mes rendez-vous</h2>
        {appointments.length === 0 ? (
          <p className="text-sm text-charcoal/50">Aucun rendez-vous pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {appointments.map((a) => {
              const { day, startTime, endTime } = formatSlot(a.slot);
              const canCancel = a.status === "PENDING" || a.status === "CONFIRMED";
              return (
                <li key={a.id} className="rounded-sm border border-charcoal/10 bg-white px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="capitalize">
                      {day} · {startTime} – {endTime}
                    </span>
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
                        {a.status === "PENDING" ? "En attente" : a.status === "CONFIRMED" ? "Confirmé" : a.status === "DECLINED" ? "Refusé" : "Annulé"}
                      </span>
                      {canCancel && (
                        <button
                          onClick={() => cancel(a.id)}
                          disabled={cancellingId === a.id}
                          className="text-xs font-semibold text-rust disabled:opacity-50"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                  {a.status === "CONFIRMED" && a.meetingLink && (
                    <a href={a.meetingLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-rust underline">
                      Lien de visioconférence ↗
                    </a>
                  )}
                  {(a.status === "DECLINED" || a.status === "CANCELLED") && a.adminNote && (
                    <p className="mt-2 text-xs italic text-charcoal/55">{a.adminNote}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
