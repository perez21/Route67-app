// Les 13 étapes de la procédure Entrée express, du test de langue à
// l'obtention du statut de résident permanent. Utilisées comme checklist
// par défaut à l'inscription (voir /api/auth/register) et dans le seed de
// démonstration (voir prisma/seed.ts) — une seule source de vérité pour
// ne jamais désynchroniser les deux.
export const FULL_PROCESS_STEPS: { label: string; description: string }[] = [
  { label: "Test de langue officiel (IELTS, CELPIP, TEF Canada ou TCF Canada)", description: "Résultat valide 2 ans, dans les 4 compétences." },
  { label: "Évaluation des diplômes d'études (EDE / ECA)", description: "Par un organisme désigné par IRCC (Immigration, Réfugiés et Citoyenneté Canada) — WES, ICAS, IQAS, ICES ou CES." },
  { label: "Création du profil Entrée express sur IRCC", description: "Compte GCKey ou partenaire de connexion, informations de profil complètes." },
  { label: "Calcul et amélioration du score CRS (Comprehensive Ranking System, le système de classement global)", description: "Utilise le simulateur Route 67 pour situer ton score face aux derniers tirages." },
  { label: "Entrée dans le bassin de candidats", description: "Le profil est actif pour 1 an, renouvelable." },
  { label: "Réception d'une invitation à présenter une demande (ITA)", description: "Reçue lors d'un tirage où ton score dépasse le seuil." },
  { label: "Dépôt de la demande complète de résidence permanente", description: "Délai de 60 jours après l'ITA pour soumettre tous les documents." },
  { label: "Données biométriques (photo et empreintes digitales)", description: "À fournir dans les 30 jours suivant la demande de biométrie." },
  { label: "Visite médicale auprès d'un médecin agréé IRCC", description: "Valide 12 mois ; à faire dès que possible après l'ITA." },
  { label: "Certificat de police / vérification des antécédents", description: "Pour chaque pays de résidence de 6 mois ou plus depuis l'âge de 18 ans." },
  { label: "Vérification de sécurité et d'admissibilité par IRCC", description: "Étape interne à IRCC — aucune action requise, seulement de la patience." },
  { label: "Réception de la Confirmation de résidence permanente (CRP)", description: "Document + visa de résident permanent si ta nationalité l'exige." },
  { label: "Entrée au Canada et obtention du statut de résident permanent", description: "Présentation de la CRP à un agent frontalier lors du \"landing\"." },
];
