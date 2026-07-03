import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { expirePremiumIfNeeded, isStaff } from "@/lib/session";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import BookingCalendar from "@/components/BookingCalendar";
import AiAssistantWidget from "@/components/AiAssistantWidget";
import Disclaimer from "@/components/Disclaimer";

export default async function RendezVousPage() {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  await expirePremiumIfNeeded(session.userId);
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { tier: true, role: true, warned: true } });
  if (!user) redirect("/login");

  const hasAccess = isStaff(user.role) || user.tier === "PREMIUM";

  if (!hasAccess) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Accompagnement</p>
          <h1 className="mb-4 font-display text-3xl font-semibold text-ink">Rendez-vous avec un admin</h1>
          <div className="mx-auto max-w-md rounded-sm border border-gold/30 bg-gold/10 p-6 text-sm text-charcoal">
            La prise de rendez-vous est réservée aux membres <strong>Premium</strong>, le forfait qui
            soutient financièrement Route 67 (hébergement, maintenance, temps de l&apos;équipe).
            <Link href="/dashboard#don" className="mt-4 block rounded-sm bg-gold px-5 py-2.5 font-semibold text-ink">
              Devenir Premium
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const appointments = await prisma.appointment.findMany({ where: { userId: session.userId }, orderBy: { slot: "desc" } });

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Accompagnement Premium</p>
        <h1 className="mb-4 font-display text-3xl font-semibold text-ink">Rendez-vous avec un admin</h1>
        <Disclaimer className="mb-8" />
        {user.warned && (
          <div className="mb-6 rounded-sm border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust">
            ⚠ Ton compte a reçu un avertissement — tu ne peux plus prendre de nouveau rendez-vous
            avec l&apos;équipe. Tes rendez-vous déjà pris restent visibles ci-dessous.
          </div>
        )}
        <BookingCalendar
          isPremium={!user.warned}
          initialAppointments={appointments.map((a: { id: string; slot: Date; status: string; note: string | null; meetingLink: string | null; adminNote: string | null }) => ({ id: a.id, slot: a.slot.toISOString(), status: a.status, note: a.note, meetingLink: a.meetingLink, adminNote: a.adminNote }))}
        />
      </div>
      <AiAssistantWidget />
    </main>
  );
}
