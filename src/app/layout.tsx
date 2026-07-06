import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  metadataBase: new URL("https://routentrexpress.ca"),
  title: {
    default: "Route 67 — Suivi de l'Entrée express Canada",
    template: "%s | Route 67",
  },
  description:
    "Informations en temps réel sur l'Entrée express canadienne et suivi personnalisé pour les candidats du Cameroun et d'Afrique centrale.",
  openGraph: {
    type: "website",
    siteName: "Route 67",
    locale: "fr_FR",
    title: "Route 67 — Suivi de l'Entrée express Canada",
    description:
      "Informations en temps réel sur l'Entrée express canadienne et suivi personnalisé pour les candidats du Cameroun et d'Afrique centrale.",
  },
  twitter: {
    card: "summary",
    title: "Route 67 — Suivi de l'Entrée express Canada",
    description:
      "Informations en temps réel sur l'Entrée express canadienne et suivi personnalisé pour les candidats du Cameroun et d'Afrique centrale.",
  },
  verification: {
    google: "pHmNfxtamP0g-jdrj1nbz1jpQQEBKuejYJ4rEgSmBpU",
  },
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
