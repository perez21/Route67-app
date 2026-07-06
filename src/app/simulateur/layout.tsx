import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur de score CRS gratuit",
  description:
    "Calcule ton score CRS (Système de classement global) complet et gratuit : capital humain, conjoint, transférabilité des compétences, points supplémentaires.",
};

export default function SimulateurLayout({ children }: { children: React.ReactNode }) {
  return children;
}
