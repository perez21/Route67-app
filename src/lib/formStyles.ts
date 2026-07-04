// Styles Tailwind partagés pour tous les champs de formulaire du site — une
// seule source de vérité pour que chaque input, select et textarea ait le
// même look (grands champs arrondis, focus doré/rust, transitions) partout :
// formulaires publics (contact, connexion, inscription...) et panneaux admin.
export const inputClasses =
  "w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3.5 text-base text-ink shadow-sm transition-all placeholder:text-charcoal/35 focus:border-rust focus:outline-none focus:ring-4 focus:ring-rust/12";

export const labelClasses = "mb-1.5 block text-sm font-semibold text-charcoal/80";

// Variante pour les champs en erreur (ex. confirmation de mot de passe qui
// ne correspond pas).
export const inputErrorClasses = "border-rust/60 focus:border-rust focus:ring-rust/20";

// Bouton d'action principal (submit), cohérent sur tous les formulaires —
// grand, arrondi, avec un léger effet d'enfoncement au clic.
export const primaryButtonClasses =
  "rounded-lg bg-gold py-3.5 text-base font-bold text-ink shadow-sm transition-all hover:brightness-95 hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:hover:brightness-100";

// Bouton secondaire (annuler, action alternative).
export const secondaryButtonClasses =
  "rounded-lg border border-charcoal/20 bg-white py-3.5 text-base font-semibold text-charcoal transition-colors hover:bg-parchment2/60";

// Carte englobant un formulaire, avec une ombre plus marquée façon "panneau
// flottant" (inspirée des formulaires de connexion grand public type Facebook).
export const formCardClasses =
  "rounded-xl border border-charcoal/10 bg-white p-6 shadow-lg sm:p-8";
