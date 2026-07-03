import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { isStaff } from "@/lib/session";
import { prisma } from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";

const LINKS = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/utilisateurs", label: "Utilisateurs & forfaits" },
  { href: "/admin/chat", label: "Chat & messages" },
  { href: "/admin/actualites", label: "Actualités" },
  { href: "/admin/forum", label: "Forum" },
  { href: "/admin/rendez-vous", label: "Rendez-vous" },
  { href: "/admin/tirages", label: "Tirages Entrée express" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/campagnes", label: "Campagnes email" },
  { href: "/admin/securite", label: "Sécurité (2FA)" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { name: true, role: true } });
  if (!user || !isStaff(user.role)) redirect("/dashboard");

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="flex flex-row items-center gap-6 overflow-x-auto bg-ink px-6 py-5 text-parchment md:flex-col md:items-stretch md:gap-1 md:py-7">
        <Link href="/" className="font-display text-xl font-bold md:mb-6">
          <span className="text-cmr-green">Route</span> <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
        </Link>
        <p className="mb-2 hidden font-mono text-[10px] uppercase tracking-widest text-cmr-yellow md:block">
          Espace administrateur
        </p>
        <nav className="flex gap-2 text-sm md:flex-col md:gap-0.5">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-sm px-3 py-2.5 text-parchment/75 hover:bg-white/5">
              {link.label}
            </Link>
          ))}
          <Link href="/dashboard" className="mt-4 rounded-sm px-3 py-2.5 text-parchment/50">← Retour au site</Link>
        </nav>
      </aside>
      <main className="px-6 py-8 md:px-11 md:py-9">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold text-ink">Bonjour, {user.name?.split(" ")[0]}</h1>
          <LogoutButton />
        </div>
        {children}
      </main>
    </div>
  );
}
