// URL publique du site, utilisée pour construire des liens absolus (ex.
// liens de réinitialisation de mot de passe envoyés par email). En
// production, NEXT_PUBLIC_SITE_URL doit être définie sur le domaine réel ;
// le fallback ci-dessous pointe désormais vers le domaine de production
// plutôt que localhost, pour éviter que des liens cassés ne partent par
// erreur si la variable d'environnement n'est pas configurée.
export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://routentrexpress.ca").replace(/\/$/, "");
}

// Liens vers les réseaux sociaux affichés en pied de page. Toutes les
// variables sont optionnelles : un réseau sans URL configurée n'est
// simplement pas affiché plutôt que de pointer vers un lien mort.
export function getSocialLinks() {
  return {
    facebook: process.env.SOCIAL_FACEBOOK_URL || "",
    instagram: process.env.SOCIAL_INSTAGRAM_URL || "",
    linkedin: process.env.SOCIAL_LINKEDIN_URL || "",
    tiktok: process.env.SOCIAL_TIKTOK_URL || "",
    whatsapp: process.env.ADMIN_WHATSAPP_NUMBER
      ? `https://wa.me/${process.env.ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`
      : "",
  };
}
