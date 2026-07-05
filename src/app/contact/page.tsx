import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import Disclaimer from "@/components/Disclaimer";
import { getTeamContact } from "@/lib/mailer";

export default async function ContactPage() {
  const contact = getTeamContact();
  const token = (await cookies()).get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Une question ?</p>
        <h1 className="mb-3 font-display text-2xl font-semibold text-ink sm:text-3xl">Contacter l&apos;équipe Route 67</h1>
        <p className="mb-4 max-w-2xl text-sm text-charcoal/65">
          Une question sur ton dossier, un bug sur le site, une suggestion ? Écris-nous directement —
          un membre de l&apos;équipe te répond personnellement. Regarde aussi notre <Link href="/faq" className="underline">FAQ</Link>.
        </p>
        {session && (
          <p className="mb-4 rounded-sm border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm text-charcoal">
            Tu es connecté : ce message rejoindra ton{" "}
            <Link href="/dashboard/chat" className="font-semibold text-rust underline">chat avec l&apos;équipe</Link>, accessible à tout moment depuis ton tableau de bord.
          </p>
        )}
        <Disclaimer className="mb-8" />
        <ContactForm whatsapp={contact.whatsapp} email={contact.email} />
      </div>
    </main>
  );
}
