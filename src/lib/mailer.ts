// Envoi d'email côté serveur, via l'API Resend (https://resend.com) — choisie
// pour sa simplicité (une seule clé API, pas de SMTP à configurer). Sans
// RESEND_API_KEY, sendEmail ne casse rien : il journalise l'intention et
// renvoie { sent: false } pour que l'appelant puisse quand même afficher
// l'information à l'écran (voir /api/subscription/upgrade et /api/contact).

const RESEND_URL = "https://api.resend.com/emails";

export type SendEmailResult = { sent: boolean; reason?: string };

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Route 67 <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(`[mailer] RESEND_API_KEY manquante — email non envoyé à ${params.to} : "${params.subject}"`);
    return { sent: false, reason: "not_configured" };
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to: params.to, subject: params.subject, html: params.html }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[mailer] échec d'envoi (${res.status}) : ${text.slice(0, 300)}`);
      return { sent: false, reason: "send_failed" };
    }

    return { sent: true };
  } catch (err) {
    console.error("[mailer] erreur réseau", err);
    return { sent: false, reason: "network_error" };
  }
}

// Adresse et numéro de contact de l'équipe, utilisés pour les liens
// mailto:/wa.me et comme destinataire des notifications (messages de
// contact, demandes de forfait Premium).
export function getTeamContact() {
  return {
    email: process.env.ADMIN_CONTACT_EMAIL || "contact@route67.app",
    whatsapp: process.env.ADMIN_WHATSAPP_NUMBER || "",
  };
}

export function getMomoNumbers() {
  return {
    orange: process.env.MOMO_ORANGE_NUMBER || "(à configurer — voir .env)",
    mtn: process.env.MOMO_MTN_NUMBER || "(à configurer — voir .env)",
    // Nom associé aux comptes ci-dessus, affiché pour que la personne
    // vérifie qu'elle envoie bien au bon destinataire avant de payer.
    accountName: process.env.MOMO_ACCOUNT_NAME || "(à configurer — voir .env)",
    // Lien ou adresse PayPal.me pour les dons depuis l'étranger.
    paypal: process.env.PAYPAL_LINK || "",
  };
}

// Remplace le gabarit {{name}} par le prénom du destinataire — utilisé par
// les campagnes d'emailing admin (voir /admin/campagnes) pour personnaliser
// un même message envoyé à plusieurs comptes.
export function personalizeTemplate(template: string, name: string): string {
  const firstName = name.trim().split(" ")[0] || name;
  return template.replace(/\{\{\s*name\s*\}\}/gi, firstName);
}
