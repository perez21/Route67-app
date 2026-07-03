import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isStaff } from "@/lib/session";
import Navbar from "@/components/Navbar";
import ChatWithTeam from "@/components/ChatWithTeam";
import Disclaimer from "@/components/Disclaimer";

export default async function DashboardChatPage() {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true, tier: true } });
  if (!user) redirect("/login");

  const hasAccess = isStaff(user.role) || user.tier === "PREMIUM";

  if (!hasAccess) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Chat direct</p>
          <h1 className="mb-4 font-display text-3xl font-semibold text-ink">Discuter avec l&apos;équipe</h1>
          <div className="mx-auto max-w-md rounded-sm border border-gold/30 bg-gold/10 p-6 text-sm text-charcoal">
            Le chat direct est réservé aux membres <strong>Premium</strong>. Tu peux toujours nous
            écrire via le <Link href="/contact" className="font-semibold text-rust underline">formulaire de contact</Link>.
            <Link href="/dashboard#don" className="mt-4 block rounded-sm bg-gold px-5 py-2.5 font-semibold text-ink">
              Devenir Premium
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <Link href="/dashboard" className="mb-6 inline-block text-sm text-rust underline">← Retour au tableau de bord</Link>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-rust">Chat direct</p>
        <h1 className="mb-4 font-display text-2xl font-semibold text-ink sm:text-3xl">Discuter avec l&apos;équipe</h1>
        <Disclaimer className="mb-6" />
        <ChatWithTeam />
      </div>
    </main>
  );
}
