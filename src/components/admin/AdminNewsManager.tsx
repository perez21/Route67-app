"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type News = { id: string; title: string; summary: string; sourceUrl: string | null; imageUrl: string | null; aiGenerated: boolean; publishedAt: string };

const MAX_IMAGE_BYTES = 1_300_000; // ~1.3 Mo, cohérent avec la limite serveur

export default function AdminNewsManager({ initialNews }: { initialNews: News[] }) {
  const router = useRouter();
  const [news, setNews] = useState(initialNews);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiTopic, setAiTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [wasAiDrafted, setWasAiDrafted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageError(null);
    if (!file) {
      setImageDataUrl("");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image trop lourde (max ~1,3 Mo) — compresse-la avant de l'ajouter.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function generateDraft() {
    if (!aiTopic.trim()) return;
    setError(null);
    setAiLoading(true);
    const res = await fetch("/api/admin/news/ai-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: aiTopic }),
    });
    setAiLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Impossible de générer la brève.");
      return;
    }

    const data = await res.json();
    setTitle(data.draft.title ?? "");
    setSummary(data.draft.summary ?? "");
    setWasAiDrafted(true);
  }

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, summary, sourceUrl: sourceUrl || undefined, imageUrl: imageDataUrl || undefined, aiGenerated: wasAiDrafted }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    const data = await res.json();
    setNews((prev) => [data.news, ...prev]);
    setTitle("");
    setSummary("");
    setSourceUrl("");
    setImageDataUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setAiTopic("");
    setWasAiDrafted(false);
  }

  async function remove(id: string) {
    await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    setNews((prev) => prev.filter((n) => n.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-gold2/30 bg-gold2/10 p-5">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-charcoal/60">
          Pré-rédaction par l&apos;assistant IA (à relire avant publication)
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="Ex. Nouveau tirage Catégorie Francophonie du 28 juin"
            className="flex-1 min-w-[220px] rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={generateDraft}
            disabled={aiLoading}
            className="rounded-sm bg-ink px-4 py-2.5 text-sm font-semibold text-parchment disabled:opacity-60"
          >
            {aiLoading ? "Rédaction…" : "Générer un brouillon"}
          </button>
        </div>
      </div>

      <form onSubmit={publish} className="space-y-3 rounded-sm border border-charcoal/10 bg-white p-5">
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setWasAiDrafted(false); }}
          placeholder="Titre"
          required
          className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm"
        />
        <textarea
          value={summary}
          onChange={(e) => { setSummary(e.target.value); setWasAiDrafted(false); }}
          placeholder="Résumé"
          rows={3}
          required
          className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm"
        />
        <input
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="Lien source (optionnel, ex. canada.ca)"
          className="w-full rounded-sm border border-charcoal/15 px-3 py-2.5 text-sm"
        />
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-charcoal/55">
            Image (optionnelle)
          </label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
          {imageError && <p className="mt-1 text-xs text-rust">{imageError}</p>}
          {imageDataUrl && (
            <div className="mt-2 flex items-center gap-3">
              <img src={imageDataUrl} alt="Aperçu" className="h-16 w-24 rounded-sm object-cover" />
              <button type="button" onClick={() => { setImageDataUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-xs font-semibold text-rust">
                Retirer l&apos;image
              </button>
            </div>
          )}
        </div>
        {wasAiDrafted && <p className="text-xs text-gold">Brouillon généré par IA — relis-le avant de publier.</p>}
        {error && <p role="alert" className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">
          {loading ? "Publication…" : "Publier"}
        </button>
      </form>

      <div className="space-y-3">
        {news.map((n) => (
          <div key={n.id} className="flex items-start justify-between gap-4 rounded-sm border border-charcoal/10 bg-white p-4">
            <div className="flex gap-3">
              {n.imageUrl && <img src={n.imageUrl} alt="" className="h-14 w-20 flex-shrink-0 rounded-sm object-cover" />}
              <div>
                <p className="font-semibold text-ink">{n.title}</p>
                <p className="text-sm text-charcoal/60">{n.summary}</p>
              </div>
            </div>
            <button onClick={() => remove(n.id)} className="flex-shrink-0 text-xs font-semibold text-rust">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
