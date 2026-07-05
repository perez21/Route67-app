"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputClasses } from "@/lib/formStyles";

export default function NewTopicForm({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [submittedPending, setSubmittedPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/forum/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, pinned }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    const data = await res.json();
    setTitle("");
    setDescription("");
    setPinned(false);
    setOpen(false);
    if (data.pendingApproval) {
      setSubmittedPending(true);
      setTimeout(() => setSubmittedPending(false), 6000);
    }
    router.refresh();
  }

  if (submittedPending) {
    return (
      <div className="rounded-sm border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm text-charcoal">
        Sujet envoyé. Il sera visible de tous une fois validé par l&apos;équipe.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-sm bg-cmr-green px-4 py-2 text-sm font-semibold text-white"
      >
        {isAdmin ? "+ Nouveau sujet" : "+ Proposer un sujet"}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-charcoal/10 bg-white p-5 shadow-sm">
      {!isAdmin && (
        <p className="rounded-sm bg-parchment2 px-3 py-2 text-xs text-charcoal/60">
          Ton sujet sera visible de tous une fois validé par l&apos;équipe.
        </p>
      )}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre du sujet"
        required
        className={inputClasses}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optionnelle)"
        rows={2}
        className={`${inputClasses} resize-y`}
      />
      {isAdmin && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="h-4 w-4 accent-forest" />
          Épingler en haut du forum
        </label>
      )}
      {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60">
          {loading ? "Envoi…" : isAdmin ? "Publier le sujet" : "Proposer le sujet"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-sm border border-charcoal/15 px-4 py-2 text-sm transition-colors hover:bg-parchment2/50">
          Annuler
        </button>
      </div>
    </form>
  );
}
