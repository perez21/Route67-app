import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  title: "Route 67 — Suivi de l'Entrée express Canada",
  description:
    "Informations en temps réel sur l'Entrée express canadienne et suivi personnalisé pour les candidats du Cameroun et d'Afrique centrale.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const initialLocale: Locale = cookieLocale === "en" ? "en" : "fr";

  return (
    <html lang={initialLocale}>
      <body className="font-body antialiased">
        <LanguageProvider initialLocale={initialLocale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
