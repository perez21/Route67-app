import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Route 67 — Suivi de l'Entrée express Canada",
  description:
    "Informations en temps réel sur l'Entrée express canadienne et suivi personnalisé pour les candidats du Cameroun et d'Afrique centrale.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
