import Navbar from "@/components/Navbar";
import EquivalenceDiplomeBody from "@/components/guides/EquivalenceDiplomeBody";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Équivalence des diplômes (EDE/ECA) pour l'Entrée express",
  description:
    "WES, ICAS, IQAS, ICES, CES : quel organisme choisir pour ton évaluation des diplômes d'études (EDE), documents à fournir, délais et validité de 5 ans.",
};

export default function EquivalenceDiplomePage() {
  return (
    <main>
      <Navbar />
      <EquivalenceDiplomeBody />
    </main>
  );
}
