import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminOverviewPage() {
  const [userCount, premiumCount, pendingUpgrades, pendingAppointments, topicCount, drawCount, newsCount, unresolvedMessages] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: "PREMIUM" } }),
    prisma.upgradeRequest.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.forumTopic.count(),
    prisma.draw.count(),
    prisma.newsItem.count(),
    prisma.supportThread.count({ where: { resolved: false } }),
  ]);

  const cards = [
    { label: "Utilisateurs", value: userCount, href: "/admin/utilisateurs" },
    { label: "Forfaits Premium actifs", value: premiumCount, href: "/admin/utilisateurs" },
    { label: "Demandes Premium en attente", value: pendingUpgrades, href: "/admin/utilisateurs", highlight: pendingUpgrades > 0 },
    { label: "Discussions non traitées", value: unresolvedMessages, href: "/admin/chat", highlight: unresolvedMessages > 0 },
    { label: "Rendez-vous en attente", value: pendingAppointments, href: "/admin/rendez-vous", highlight: pendingAppointments > 0 },
    { label: "Sujets de forum", value: topicCount, href: "/admin/forum" },
    { label: "Tirages publiés", value: drawCount, href: "/admin/tirages" },
    { label: "Actualités publiées", value: newsCount, href: "/admin/actualites" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className={`rounded-sm border bg-white p-5 ${card.highlight ? "border-rust/40" : "border-charcoal/10"}`}
        >
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-charcoal/55">{card.label}</p>
          <p className={`font-mono text-3xl font-semibold ${card.highlight ? "text-rust" : "text-ink"}`}>{card.value}</p>
        </Link>
      ))}
    </div>
  );
}
