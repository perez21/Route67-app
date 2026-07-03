type Variant = "default" | "compact" | "dark";

const MESSAGES: Record<string, string> = {
  default:
    "Route 67 n'est pas un cabinet ni un agent d'immigration agréé. Notre projet vise uniquement à rendre l'information officielle plus accessible — pour un avis qui engage ton dossier, consulte un consultant réglementé (CRCIC) ou le site officiel canada.ca.",
  compact: "Rappel : Route 67 informe, mais n'est pas un agent d'immigration agréé.",
  procedure:
    "Ce guide est une vulgarisation à but informatif, rédigée pour rendre la procédure plus claire. Route 67 n'est pas un cabinet d'immigration agréé : vérifie toujours l'information à jour sur canada.ca avant toute démarche officielle.",
};

// Palette "info" bleue — standard d'interface actuel pour une note
// contextuelle neutre (le jaune/orange est généralement réservé aux
// avertissements actifs), avec un bon contraste texte/fond.
export default function Disclaimer({
  variant = "default",
  className = "",
}: {
  variant?: Variant | "procedure";
  className?: string;
}) {
  const text = MESSAGES[variant] ?? MESSAGES.default;

  if (variant === "compact") {
    return <p className={`text-xs text-blue-900/70 ${className}`}>ℹ️ {text}</p>;
  }

  return (
    <div className={`rounded-sm border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-900 ${className}`}>
      <strong className="text-blue-950">À savoir — </strong>
      {text}
    </div>
  );
}
