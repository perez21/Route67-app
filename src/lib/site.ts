// URL publique du site, utilisée pour construire des liens absolus (ex.
// liens de réinitialisation de mot de passe envoyés par email). En
// production, NEXT_PUBLIC_SITE_URL doit être définie sur le domaine réel ;
// le fallback ci-dessous pointe désormais vers le domaine de production
// plutôt que localhost, pour éviter que des liens cassés ne partent par
// erreur si la variable d'environnement n'est pas configurée.
export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://routentrexpress.ca").replace(/\/$/, "");
}

// Active/désactive l'envoi d'emails liés au chat direct (notification à
// l'équipe à l'ouverture d'un fil, notification à la personne quand
// l'équipe répond). Activé par défaut — mets CHAT_EMAIL_NOTIFICATIONS à
// "false" dans les variables d'environnement pour couper ces emails sans
// toucher au code (les messages restent visibles dans le chat/l'admin,
// seul l'envoi d'email est coupé). N'affecte aucun autre email du site
// (réinitialisation de mot de passe, vérification d'email, contact...).
export function chatEmailNotificationsEnabled() {
  return process.env.CHAT_EMAIL_NOTIFICATIONS !== "false";
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
