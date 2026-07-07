import Navbar from "@/components/Navbar";
import TestDeLangueBody from "@/components/guides/TestDeLangueBody";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test de langue IELTS, CELPIP, TEF : comment choisir et convertir en CLB/NCLC",
  description:
    "IELTS, CELPIP, TEF Canada, TCF Canada : quel test choisir, comment convertir ton score en niveau CLB/NCLC, et l'astuce du bonus bilingue pour ton score CRS.",
};

export default function TestDeLanguePage() {
  return (
    <main>
      <Navbar />
      <TestDeLangueBody />
    </main>
  );
}
