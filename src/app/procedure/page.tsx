import Navbar from "@/components/Navbar";
import ProcedureBody from "@/components/ProcedureBody";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procédure Entrée express : toutes les étapes vers le visa",
  description:
    "Test de langue, équivalence des diplômes, création du profil, tirages, ITA, biométrie... la procédure complète de l'Entrée express canadienne expliquée étape par étape.",
};

export default function ProcedurePage() {
  return (
    <main>
      <Navbar />
      <ProcedureBody />
    </main>
  );
}
