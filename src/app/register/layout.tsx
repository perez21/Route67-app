import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer mon compte gratuit",
  description: "Crée ton compte Route 67 gratuit : checklist de la procédure, simulateur de score CRS, et alertes sur les tirages Entrée express.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
