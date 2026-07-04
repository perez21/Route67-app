import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FULL_PROCESS_STEPS } from "../src/lib/checklistSteps";

const prisma = new PrismaClient();

async function main() {
  // Tirages de démonstration - à remplacer par de vraies données IRCC.
  const draws = [
    { number: 310, category: "Métiers de la santé", minScore: 432, invitations: 950, date: new Date("2026-06-14") },
    { number: 311, category: "Catégorie Francophonie", minScore: 379, invitations: 1800, date: new Date("2026-06-21") },
    { number: 312, category: "Tous les programmes", minScore: 481, invitations: 3250, date: new Date("2026-06-28") },
  ];

  for (const draw of draws) {
    await prisma.draw.upsert({
      where: { number: draw.number },
      update: draw,
      create: draw,
    });
  }

  // Compte de démonstration (forfait Gratuit) : demo@route67.app / MotDePasse123!
  const passwordHash = await bcrypt.hash("MotDePasse123!", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@route67.app" },
    update: {},
    create: {
      email: "demo@route67.app",
      passwordHash,
      name: "Adèle Demo",
      tier: "FREE",
      profile: {
        create: { age: 29, crsScore: 0 },
      },
      checklistItems: {
        create: FULL_PROCESS_STEPS.map((step, i) => ({
          label: step.label,
          description: step.description,
          order: i + 1,
          done: i < 2,
          completedAt: i < 2 ? new Date(Date.now() - (2 - i) * 20 * 24 * 60 * 60 * 1000) : null,
        })),
      },
    },
  });

  // Compte de démonstration Premium : premium@route67.app / PremiumRoute67!
  const premiumPasswordHash = await bcrypt.hash("PremiumRoute67!", 12);
  const premiumUser = await prisma.user.upsert({
    where: { email: "premium@route67.app" },
    update: { tier: "PREMIUM" },
    create: {
      email: "premium@route67.app",
      passwordHash: premiumPasswordHash,
      name: "Brice Premium",
      tier: "PREMIUM",
      profile: { create: { age: 31, crsScore: 0 } },
      checklistItems: {
        create: FULL_PROCESS_STEPS.map((step, i) => ({
          label: step.label,
          description: step.description,
          order: i + 1,
          done: i < 4,
          completedAt: i < 4 ? new Date(Date.now() - (4 - i) * 15 * 24 * 60 * 60 * 1000) : null,
        })),
      },
    },
  });

  // Compte administrateur de démonstration : admin@route67.app / AdminRoute67!
  const adminPasswordHash = await bcrypt.hash("AdminRoute67!", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@route67.app" },
    update: { role: "ADMIN", tier: "PREMIUM" },
    create: {
      email: "admin@route67.app",
      passwordHash: adminPasswordHash,
      name: "Équipe Route 67",
      role: "ADMIN",
      tier: "PREMIUM",
      profile: { create: {} },
    },
  });

  // Compte modérateur de démonstration : moderateur@route67.app / ModerateurRoute67!
  const moderatorPasswordHash = await bcrypt.hash("ModerateurRoute67!", 12);
  await prisma.user.upsert({
    where: { email: "moderateur@route67.app" },
    update: { role: "MODERATOR", tier: "PREMIUM" },
    create: {
      email: "moderateur@route67.app",
      passwordHash: moderatorPasswordHash,
      name: "Modérateur Route 67",
      role: "MODERATOR",
      tier: "PREMIUM",
      profile: { create: {} },
    },
  });

  // Actualités de démonstration.
  const news = [
    {
      title: "Nouveau tirage Catégorie Francophonie",
      summary:
        "IRCC a émis de nouvelles invitations dans la catégorie Francophonie, avec un seuil sous la moyenne générale — une opportunité pour les candidats francophones du Cameroun.",
      aiGenerated: true,
    },
    {
      title: "Rappel : validité de l'évaluation des diplômes (EDE)",
      summary:
        "Une EDE reste valide 5 ans. Pense à vérifier la date de la tienne avant de soumettre ton profil Entrée express.",
      aiGenerated: false,
    },
    {
      title: "Fin des points CRS pour l'offre d'emploi validée",
      summary:
        "Depuis mars 2025, IRCC n'attribue plus de points CRS pour une offre d'emploi arrangée, afin de prévenir la fraude. Le simulateur Route 67 est à jour sur ce point.",
      aiGenerated: false,
    },
  ];
  for (const item of news) {
    const exists = await prisma.newsItem.findFirst({ where: { title: item.title } });
    if (!exists) await prisma.newsItem.create({ data: item });
  }

  // Sujet de forum de démonstration.
  const topic = await prisma.forumTopic.findFirst({ where: { title: "Bienvenue sur le forum Route 67" } });
  if (!topic) {
    await prisma.forumTopic.create({
      data: {
        title: "Bienvenue sur le forum Route 67",
        description: "Présente-toi et partage où tu en es dans ton parcours Entrée express.",
        pinned: true,
        createdById: adminUser.id,
        posts: { create: [{ content: "Bienvenue à toutes et à tous ! N'hésitez pas à poser vos questions ici.", userId: adminUser.id }] },
      },
    });
  }

  // Disponibilités de démonstration sur des dates précises (les 3 prochains
  // jours ouvrés à partir d'aujourd'hui), plutôt qu'un jour de semaine
  // récurrent — chaque créneau correspond à une date exacte.
  function nextWeekday(fromDate: Date, isoOffsetDays: number): Date {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + isoOffsetDays);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const today = new Date();
  const defaultSlots = [
    { date: nextWeekday(today, 1), startTime: "09:00", endTime: "12:00" },
    { date: nextWeekday(today, 3), startTime: "09:00", endTime: "12:00" },
    { date: nextWeekday(today, 5), startTime: "13:00", endTime: "16:00" },
  ];
  for (const slot of defaultSlots) {
    const exists = await prisma.availabilitySlot.findFirst({ where: { date: slot.date, startTime: slot.startTime } });
    if (!exists) await prisma.availabilitySlot.create({ data: slot });
  }

  // Questions fréquentes de démonstration.
  const faqItems = [
    {
      question: "Route 67 est-il un cabinet d'immigration agréé ?",
      answer:
        "Non. Route 67 est un projet d'information indépendant, pas un cabinet ni un consultant en immigration réglementé (CRCIC : Collège des consultants en immigration et en citoyenneté). Pour un avis qui engage ton dossier, contacte un consultant agréé ou consulte le site officiel canada.ca.",
    },
    {
      question: "Le simulateur CRS remplace-t-il le calcul officiel d'IRCC ?",
      answer:
        "Non, il reproduit la grille officielle à titre indicatif. Le score qui compte réellement est celui calculé automatiquement sur ton profil Entrée express officiel.",
    },
    {
      question: "Comment devenir Premium ?",
      answer:
        "Depuis ton tableau de bord, clique sur \"Faire un don\", suis les instructions de paiement (Orange Money, MTN MoMo ou PayPal), puis confirme ta référence. L'équipe vérifie et active ton accès sous peu.",
    },
    {
      question: "Que se passe-t-il si mon compte reçoit un avertissement ?",
      answer:
        "Un compte averti ne peut plus publier sur le forum ni prendre de nouveau rendez-vous avec l'équipe. Contacte-nous par chat si tu penses qu'il y a une erreur.",
    },
  ];
  for (const item of faqItems) {
    const exists = await prisma.faqItem.findFirst({ where: { question: item.question } });
    if (!exists) await prisma.faqItem.create({ data: item });
  }

  console.log("Données de démonstration créées :", demoUser.email, "/", premiumUser.email, "/", adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
