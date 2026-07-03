"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Slot = { id: string; date: string; startTime: string; endTime: string };
type BookedAppointment = { id: string; slot: string; userName: string };

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

function dateKey(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

export default function AdminAvailabilityManager({
  initialSlots,
  bookedAppointments,
}: {
  initialSlots: Slot[];
  bookedAppointments: BookedAppointment[];
}) {
  const router = useRouter();
  const [slots, setSlots] = useState(initialSlots);
  const [date, setDate] = useState(toDateInputValue(new Date()));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (startTime >= endTime) {
      setError("L'heure de fin doit être après l'heure de début.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, startTime, endTime }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }
    const data = await res.json();
    setSlots((prev) => [...prev, data.slot].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)));
  }

  async function remove(id: string) {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/admin/availability/${id}`, { method: "DELETE" });
    router.refresh();
  }

  // Regroupe les disponibilités ET les rendez-vous validés par date, pour
  // un vrai calendrier jour par jour plutôt qu'une liste plate.
  const days = useMemo(() => {
    const map = new Map<string, { slots: Slot[]; booked: BookedAppointment[] }>();
    for (const s of slots) {
      const key = dateKey(s.date);
      if (!map.has(key)) map.set(key, { slots: [], booked: [] });
      map.get(key)!.slots.push(s);
    }
    for (const a of bookedAppointments) {
      const key = dateKey(a.slot);
      if (!map.has(key)) map.set(key, { slots: [], booked: [] });
      map.get(key)!.booked.push(a);
    }
    return Array.from(map.entries())
      .filter(([key]) => new Date(key).getTime() >= new Date(toDateInputValue(new Date())).getTime())
      .sort(([a], [b]) => a.localeCompare(b));
  }, [slots, bookedAppointments]);

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="flex flex-wrap items-end gap-3 rounded-sm border border-charcoal/10 bg-white p-4">
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase text-charcoal/50">Date précise</label>
          <input type="date" value={date} min={toDateInputValue(new Date())} onChange={(e) => setDate(e.target.value)} className="rounded-sm border border-charcoal/15 px-2 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase text-charcoal/50">Début</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-sm border border-charcoal/15 px-2 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase text-charcoal/50">Fin</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-sm border border-charcoal/15 px-2 py-2 text-sm" />
        </div>
        <button type="submit" disabled={loading} className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">
          Ouvrir cette disponibilité
        </button>
      </form>
      {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}

      {/* Calendrier : une carte par date, avec les plages ouvertes et les
          rendez-vous déjà confirmés ce jour-là. */}
      <div className="space-y-3">
        {days.length === 0 ? (
          <p className="rounded-sm border border-charcoal/10 bg-white p-5 text-sm text-charcoal/55">
            Aucune disponibilité à venir — ajoute une date ci-dessus.
          </p>
        ) : (
          days.map(([key, { slots: daySlots, booked }]) => (
            <div key={key} className="rounded-sm border border-charcoal/10 bg-white p-4">
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                {new Date(key).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              {daySlots.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {daySlots.map((s) => (
                    <span key={s.id} className="flex items-center gap-2 rounded-full border border-cmr-green/30 bg-cmr-green/10 px-3 py-1 text-xs text-cmr-greenDeep">
                      Ouvert {s.startTime}–{s.endTime}
                      <button onClick={() => remove(s.id)} className="text-rust" title="Retirer">✕</button>
                    </span>
                  ))}
                </div>
              )}
              {booked.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {booked.map((a) => (
                    <span key={a.id} className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-charcoal">
                      ✓ Confirmé {new Date(a.slot).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} — {a.userName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
