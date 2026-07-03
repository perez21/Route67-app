import Link from "next/link";
import NotificationBell from "./NotificationBell";
import AccountLink from "./AccountLink";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-30">
      <nav className="flex items-center justify-between bg-ink px-4 py-4 text-parchment sm:px-6 md:px-10">
        <Link href="/" className="font-display text-xl font-bold sm:text-2xl">
          <span className="text-cmr-green">Route</span>{" "}
          <span className="text-cmr-yellow">6</span><span className="text-cmr-red">7</span>
        </Link>
        <ul className="hidden gap-6 text-sm lg:flex">
          <li><Link href="/#actualites">Actualités</Link></li>
          <li><Link href="/procedure">Procédure</Link></li>
          <li><Link href="/#tirages">Tirages</Link></li>
          <li><Link href="/#tarifs">Soutenir le projet</Link></li>
          <li><Link href="/simulateur">Simulateur</Link></li>
          <li><Link href="/faq">FAQ</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />
          <AccountLink />
          <Link
            href="/register"
            className="rounded-sm bg-gold px-3.5 py-2 text-xs font-semibold text-ink sm:px-5 sm:text-sm"
          >
            Créer mon suivi
          </Link>
        </div>
      </nav>
      {/* Liseré tricolore Cameroun — signature visuelle discrète, pas un aplat. */}
      <div className="flex h-[3px] w-full">
        <div className="flex-1 bg-cmr-green" />
        <div className="flex-1 bg-cmr-red" />
        <div className="flex-1 bg-cmr-yellow" />
      </div>
    </div>
  );
}
