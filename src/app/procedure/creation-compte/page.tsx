import Navbar from "@/components/Navbar";
import CreationCompteBody from "@/components/guides/CreationCompteBody";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer son compte et son profil Entrée express (GCKey)",
  description:
    "GCKey, documents à préparer, codes CNP/TEER, et ce qu'il se passe une fois ton profil Entrée express soumis, le guide complet pour créer ton compte.",
};

export default function CreationComptePage() {
  return (
    <main>
      <Navbar />
      <CreationCompteBody />
    </main>
  );
}
