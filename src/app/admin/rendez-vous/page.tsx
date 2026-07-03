import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminAvailabilityManager from "@/components/admin/AdminAvailabilityManager";
import AdminAppointmentsManager from "@/components/admin/AdminAppointmentsManager";

export default async function AdminAppointmentsPage() {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const viewer = session ? await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } }) : null;
  const viewerIsAdmin = viewer?.role === "ADMIN";

  const [slots, appointments] = await Promise.all([
    prisma.availabilitySlot.findMany({ orderBy: [{ date: "asc" }, { startTime: "asc" }] }),
    prisma.appointment.findMany({ orderBy: { slot: "asc" }, include: { user: { select: { name: true, email: true } } } }),
  ]);

  const confirmedAppointments = appointments.filter((a: { status: string }) => a.status === "CONFIRMED");

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
          Calendrier des disponibilités
        </h2>
        <AdminAvailabilityManager
          initialSlots={slots.map((s: { id: string; date: Date; startTime: string; endTime: string }) => ({
            id: s.id,
            date: s.date.toISOString(),
            startTime: s.startTime,
            endTime: s.endTime,
          }))}
          bookedAppointments={confirmedAppointments.map((a: { id: string; slot: Date; user: { name: string } }) => ({
            id: a.id,
            slot: a.slot.toISOString(),
            userName: a.user.name,
          }))}
        />
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
          Demandes de rendez-vous
        </h2>
        <AdminAppointmentsManager
          viewerIsAdmin={viewerIsAdmin}
          initialAppointments={appointments.map((a: { id: string; slot: Date; status: string; note: string | null; meetingLink: string | null; adminNote: string | null; user: { name: string; email: string } }) => ({
            id: a.id,
            slot: a.slot.toISOString(),
            status: a.status,
            note: a.note,
            meetingLink: a.meetingLink,
            adminNote: a.adminNote,
            user: a.user,
          }))}
        />
      </section>
    </div>
  );
}
