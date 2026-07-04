// Styles Tailwind partagés pour tous les champs de formulaire du site — une
// seule source de vérité pour que chaque input, select et textarea ait le
// même look (bordure, focus doré/rust, transitions) partout : formulaires
// publics (contact, connexion, inscription...) et panneaux admin.
export const inputClasses =
  "w-full rounded-sm border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/15";

export const labelClasses = "mb-1.5 block font-mono text-xs uppercase tracking-wide text-charcoal/60";

// Variante pour les champs en erreur (ex. confirmation de mot de passe qui
// ne correspond pas).
export const inputErrorClasses = "border-rust/50 focus:border-rust focus:ring-rust/20";

// Bouton d'action principal (submit), cohérent sur tous les formulaires.
export const primaryButtonClasses =
  "rounded-sm bg-gold py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60";

// Carte englobant un formulaire, avec une légère ombre qui s'accentue au survol.
export const formCardClasses =
  "rounded-md border border-charcoal/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8";
