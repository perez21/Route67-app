import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import Disclaimer from "@/components/Disclaimer";
import { ContactHeader } from "@/components/ContactHeader";
import { getTeamContact } from "@/lib/mailer";

export default async function ContactPage() {
  const contact = getTeamContact();
  const token = (await cookies()).get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <ContactHeader loggedIn={!!session} />
        <Disclaimer className="mb-8" />
        <ContactForm whatsapp={contact.whatsapp} email={contact.email} />
      </div>
    </main>
  );
}
