"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEYS = {
  news: "route67:lastSeenNewsAt",
  draws: "route67:lastSeenDrawAt",
  forum: "route67:lastSeenTopicAt",
  premium: "route67:lastSeenPremiumWarningDay",
};

type NotifItem = {
  id: string;
  kind: "news" | "draw" | "forum" | "premium";
  label: string;
  href: string;
  at: string;
};

export default function NotificationBell() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const meRes = await fetch("/api/auth/me").catch(() => null);
      const me = meRes && meRes.ok ? await meRes.json() : { user: null };
      if (cancelled || !me.user) return;
      setLoggedIn(true);

      const collected: NotifItem[] = [];
      let anyNew = false;

      // Expiration du forfait Premium — affichée dès 5 jours avant, et
      // jusqu'à l'expiration. Réapparaît chaque jour (clé datée) plutôt que
      // d'être masquée définitivement après un seul clic.
      if (me.user.tier === "PREMIUM" && me.user.tierExpiresAt) {
        const daysLeft = Math.ceil((new Date(me.user.tierExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
        if (daysLeft <= 5 && daysLeft >= 0) {
          const todayKey = new Date().toISOString().slice(0, 10);
          collected.push({
            id: "premium-expiry",
            kind: "premium",
            label:
              daysLeft === 0
                ? "Ton forfait Premium expire aujourd'hui — renouvelle-le pour garder l'accès aux rendez-vous et au chat direct."
                : `Ton forfait Premium expire dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""} — pense à le renouveler.`,
            href: "/dashboard",
            at: new Date().toISOString(),
          });
          const lastSeenDay = window.localStorage.getItem(STORAGE_KEYS.premium);
          if (lastSeenDay !== todayKey) anyNew = true;
        }
      }

      // Actualités
      const newsRes = await fetch("/api/news").catch(() => null);
      if (newsRes && newsRes.ok) {
        const data = await newsRes.json();
        const news = (data.news ?? []).slice(0, 3);
        for (const n of news) collected.push({ id: n.id, kind: "news", label: n.title, href: "/#actualites", at: n.publishedAt });
        const lastSeen = window.localStorage.getItem(STORAGE_KEYS.news);
        if (news[0] && (!lastSeen || new Date(news[0].publishedAt).getTime() > new Date(lastSeen).getTime())) anyNew = true;
      }

      // Tirages
      const drawsRes = await fetch("/api/draws").catch(() => null);
      if (drawsRes && drawsRes.ok) {
        const data = await drawsRes.json();
        const draws = (data.draws ?? []).slice(0, 2);
        for (const d of draws) collected.push({ id: d.id, kind: "draw", label: `Tirage #${d.number} — ${d.category}`, href: "/#tirages", at: d.createdAt });
        const lastSeen = window.localStorage.getItem(STORAGE_KEYS.draws);
        if (draws[0] && (!lastSeen || new Date(draws[0].createdAt).getTime() > new Date(lastSeen).getTime())) anyNew = true;
      }

      // Sujets de forum — accessible à tout membre connecté
      const forumRes = await fetch("/api/forum/topics").catch(() => null);
      if (forumRes && forumRes.ok) {
        const data = await forumRes.json();
        const topics = (data.topics ?? []).filter((t: { status: string }) => t.status === "APPROVED").slice(0, 3);
        for (const t of topics) collected.push({ id: t.id, kind: "forum", label: `Nouveau sujet : ${t.title}`, href: `/forum/${t.id}`, at: t.createdAt });
        const lastSeen = window.localStorage.getItem(STORAGE_KEYS.forum);
        if (topics[0] && (!lastSeen || new Date(topics[0].createdAt).getTime() > new Date(lastSeen).getTime())) anyNew = true;
      }

      if (cancelled) return;
      collected.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
      setItems(collected.slice(0, 8));
      setHasNew(anyNew);
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  function markAllSeen() {
    const byKind: Record<string, string> = {};
    for (const item of items) {
      if (!byKind[item.kind] || new Date(item.at).getTime() > new Date(byKind[item.kind]).getTime()) {
        byKind[item.kind] = item.at;
      }
    }
    if (byKind.news) window.localStorage.setItem(STORAGE_KEYS.news, byKind.news);
    if (byKind.draw) window.localStorage.setItem(STORAGE_KEYS.draws, byKind.draw);
    if (byKind.forum) window.localStorage.setItem(STORAGE_KEYS.forum, byKind.forum);
    if (byKind.premium) window.localStorage.setItem(STORAGE_KEYS.premium, new Date().toISOString().slice(0, 10));
    setHasNew(false);
  }

  function handleOpen() {
    setOpen((v) => !v);
    markAllSeen();
  }

  if (!loggedIn) return null;

  const ICONS: Record<NotifItem["kind"], string> = { news: "📰", draw: "🎯", forum: "💬", premium: "⏳" };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-parchment/80"
      >
        <span aria-hidden className="text-lg">🔔</span>
        {hasNew && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cmr-red" />}
      </button>

      {open && (
        <div className="absolute left-1/2 top-11 z-40 w-80 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-sm border border-charcoal/10 bg-white p-3 shadow-xl">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-charcoal/45">Notifications</p>
          {items.length === 0 ? (
            <p className="text-sm text-charcoal/50">Rien de nouveau pour le moment.</p>
          ) : (
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2 rounded-sm border-t border-charcoal/10 px-1 py-2 text-sm text-charcoal/75 first:border-t-0 hover:bg-parchment2/50"
                  >
                    <span aria-hidden>{ICONS[item.kind]}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
