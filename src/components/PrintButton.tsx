"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink"
    >
      Imprimer / Enregistrer en PDF
    </button>
  );
}
