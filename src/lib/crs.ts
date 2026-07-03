// Calcul du score CRS (Système de classement global) calqué sur la grille
// officielle d'IRCC — la même grille que reproduit l'outil de calcul
// Canadavisa (https://www.canadavisa.com/fr/comprehensive-ranking-score-calculator.html).
// Source des barèmes : Canada.ca — Entrée express : Critères du SCG
// (page « verifier-note/criteries-scg »), mise à jour du 21 août 2025 —
// notamment le retrait des points pour offre d'emploi depuis le 25 mars 2025.
//
// ⚠️ Cet outil est informatif. Route 67 n'est pas un cabinet de consultation
// en immigration agréé (voir le composant Disclaimer) : pour un résultat qui
// engage un dossier réel, vérifie toujours avec le compte Entrée express
// officiel sur canada.ca.

export type EducationLevel =
  | "LT_SECONDARY"
  | "SECONDARY"
  | "ONE_YEAR"
  | "TWO_YEAR"
  | "BACHELOR"
  | "TWO_OR_MORE"
  | "MASTER_OR_PROFESSIONAL"
  | "DOCTORATE";

// Niveaux de compétence linguistique canadiens (NCLC/CLB), par compétence,
// pour la première langue officielle déclarée.
export type FirstLangLevel = "LT4" | "L4_5" | "L6" | "L7" | "L8" | "L9" | "L10P";
// Catégories plus larges utilisées par IRCC pour la deuxième langue officielle.
export type SecondLangLevel = "LT4" | "L5_6" | "L7_8" | "L9P";

export type FourSkills<T> = { speaking: T; listening: T; reading: T; writing: T };

export type CrsInput = {
  hasSpouse: boolean;
  age: number;
  education: EducationLevel;
  firstLanguage: FourSkills<FirstLangLevel>;
  secondLanguageTested: boolean;
  secondLanguage?: FourSkills<SecondLangLevel>;
  // "Laquelle est ta première langue officielle déclarée ?" — nécessaire pour
  // appliquer correctement le bonus de bilinguisme français (section D).
  firstLanguageIsFrench: boolean;

  canadianWorkExperienceYears: 0 | 1 | 2 | 3 | 4 | 5;
  foreignWorkExperienceYears: 0 | 1 | 2 | 3;
  hasCertificateOfQualification: boolean;

  spouse?: {
    education: EducationLevel;
    firstLanguage: FourSkills<FirstLangLevel>;
    canadianWorkExperienceYears: 0 | 1 | 2 | 3 | 4 | 5;
  };

  hasSiblingInCanada: boolean;
  canadianStudy: "NONE" | "ONE_OR_TWO_YEARS" | "THREE_YEARS_PLUS";
  hasProvincialNomination: boolean;
};

export type CrsBreakdown = {
  core: { age: number; education: number; firstLanguage: number; secondLanguage: number; canadianWork: number; subtotal: number; cap: number };
  spouse: { education: number; language: number; canadianWork: number; subtotal: number; cap: number };
  transferability: { education: number; foreignExperience: number; certificate: number; subtotal: number; cap: number };
  additional: { sibling: number; french: number; canadianStudy: number; provincialNomination: number; subtotal: number; cap: number };
  total: number;
};

export const CRS_MAX_SCORE = 1200;

// --- A. Facteurs de base / capital humain -----------------------------

function agePoints(age: number, hasSpouse: boolean): number {
  const withSpouse: Record<number, number> = {
    17: 0, 18: 90, 19: 95, 30: 95, 31: 90, 32: 85, 33: 80, 34: 75, 35: 70,
    36: 65, 37: 60, 38: 55, 39: 50, 40: 45, 41: 35, 42: 25, 43: 15, 44: 5,
  };
  const withoutSpouse: Record<number, number> = {
    17: 0, 18: 99, 19: 105, 30: 105, 31: 99, 32: 94, 33: 88, 34: 83, 35: 77,
    36: 72, 37: 66, 38: 61, 39: 55, 40: 50, 41: 39, 42: 28, 43: 17, 44: 6,
  };
  const table = hasSpouse ? withSpouse : withoutSpouse;
  if (age <= 17) return 0;
  if (age >= 45) return 0;
  if (age >= 20 && age <= 29) return hasSpouse ? 100 : 110;
  return table[age] ?? 0;
}

const EDUCATION_POINTS: Record<EducationLevel, { withSpouse: number; withoutSpouse: number }> = {
  LT_SECONDARY: { withSpouse: 0, withoutSpouse: 0 },
  SECONDARY: { withSpouse: 28, withoutSpouse: 30 },
  ONE_YEAR: { withSpouse: 84, withoutSpouse: 90 },
  TWO_YEAR: { withSpouse: 91, withoutSpouse: 98 },
  BACHELOR: { withSpouse: 112, withoutSpouse: 120 },
  TWO_OR_MORE: { withSpouse: 119, withoutSpouse: 128 },
  MASTER_OR_PROFESSIONAL: { withSpouse: 126, withoutSpouse: 135 },
  DOCTORATE: { withSpouse: 140, withoutSpouse: 150 },
};

const FIRST_LANG_POINTS: Record<FirstLangLevel, { withSpouse: number; withoutSpouse: number }> = {
  LT4: { withSpouse: 0, withoutSpouse: 0 },
  L4_5: { withSpouse: 6, withoutSpouse: 6 },
  L6: { withSpouse: 8, withoutSpouse: 9 },
  L7: { withSpouse: 16, withoutSpouse: 17 },
  L8: { withSpouse: 22, withoutSpouse: 23 },
  L9: { withSpouse: 29, withoutSpouse: 31 },
  L10P: { withSpouse: 32, withoutSpouse: 34 },
};

const SECOND_LANG_POINTS: Record<SecondLangLevel, number> = { LT4: 0, L5_6: 1, L7_8: 3, L9P: 6 };

const CDN_WORK_POINTS: Record<number, { withSpouse: number; withoutSpouse: number }> = {
  0: { withSpouse: 0, withoutSpouse: 0 },
  1: { withSpouse: 35, withoutSpouse: 40 },
  2: { withSpouse: 46, withoutSpouse: 53 },
  3: { withSpouse: 56, withoutSpouse: 64 },
  4: { withSpouse: 63, withoutSpouse: 72 },
  5: { withSpouse: 70, withoutSpouse: 80 },
};

function sumFourSkills<T extends string>(skills: FourSkills<T>, table: Record<T, number>): number {
  return table[skills.speaking] + table[skills.listening] + table[skills.reading] + table[skills.writing];
}

// --- B. Facteurs liés à l'époux ou conjoint de fait --------------------

const SPOUSE_EDUCATION_POINTS: Record<EducationLevel, number> = {
  LT_SECONDARY: 0, SECONDARY: 2, ONE_YEAR: 6, TWO_YEAR: 7, BACHELOR: 8, TWO_OR_MORE: 9, MASTER_OR_PROFESSIONAL: 10, DOCTORATE: 10,
};
const SPOUSE_LANG_POINTS: Record<FirstLangLevel, number> = { LT4: 0, L4_5: 1, L6: 1, L7: 3, L8: 3, L9: 5, L10P: 5 };
const SPOUSE_WORK_POINTS: Record<number, number> = { 0: 0, 1: 5, 2: 7, 3: 8, 4: 9, 5: 10 };

// --- C. Transférabilité des compétences ---------------------------------

type EduBucket = "SECONDARY_OR_LESS" | "POSTSECONDARY_1Y_PLUS" | "TWO_OR_MORE_3Y" | "MASTER_PROFESSIONAL" | "DOCTORATE";

function educationBucket(level: EducationLevel): EduBucket {
  switch (level) {
    case "LT_SECONDARY":
    case "SECONDARY":
      return "SECONDARY_OR_LESS";
    case "ONE_YEAR":
    case "TWO_YEAR":
      return "POSTSECONDARY_1Y_PLUS";
    case "TWO_OR_MORE":
      return "TWO_OR_MORE_3Y";
    case "MASTER_OR_PROFESSIONAL":
      return "MASTER_PROFESSIONAL";
    case "DOCTORATE":
      return "DOCTORATE";
    default:
      return "SECONDARY_OR_LESS";
  }
}

const EDU_COMBO_POINTS: Record<EduBucket, { tier1: number; tier2: number }> = {
  SECONDARY_OR_LESS: { tier1: 0, tier2: 0 },
  POSTSECONDARY_1Y_PLUS: { tier1: 13, tier2: 25 },
  TWO_OR_MORE_3Y: { tier1: 25, tier2: 50 },
  MASTER_PROFESSIONAL: { tier1: 25, tier2: 50 },
  DOCTORATE: { tier1: 25, tier2: 50 },
};

function firstLangAllAtLeast(skills: FourSkills<FirstLangLevel>, min: FirstLangLevel): boolean {
  const order: FirstLangLevel[] = ["LT4", "L4_5", "L6", "L7", "L8", "L9", "L10P"];
  const rank = (l: FirstLangLevel) => order.indexOf(l);
  const minRank = rank(min);
  return (["speaking", "listening", "reading", "writing"] as const).every((k) => rank(skills[k]) >= minRank);
}

// tier1 = NCLC7+ dans les 4 compétences, dont au moins une < 9
// tier2 = NCLC9+ dans les 4 compétences
function languageTier(skills: FourSkills<FirstLangLevel>): "none" | "tier1" | "tier2" {
  if (firstLangAllAtLeast(skills, "L9")) return "tier2";
  if (firstLangAllAtLeast(skills, "L7")) return "tier1";
  return "none";
}

function educationTransferability(education: EducationLevel, firstLanguage: FourSkills<FirstLangLevel>, cdnYears: number): number {
  const bucket = educationBucket(education);
  const tier = languageTier(firstLanguage);
  const langPoints = tier === "tier2" ? EDU_COMBO_POINTS[bucket].tier2 : tier === "tier1" ? EDU_COMBO_POINTS[bucket].tier1 : 0;

  const cdnTier = cdnYears >= 2 ? "tier2" : cdnYears >= 1 ? "tier1" : "none";
  const cdnPoints = cdnTier === "tier2" ? EDU_COMBO_POINTS[bucket].tier2 : cdnTier === "tier1" ? EDU_COMBO_POINTS[bucket].tier1 : 0;

  return Math.min(50, langPoints + cdnPoints);
}

function foreignExperienceTransferability(foreignYears: number, firstLanguage: FourSkills<FirstLangLevel>, cdnYears: number): number {
  const foreignTier = foreignYears >= 3 ? "tier2" : foreignYears >= 1 ? "tier1" : "none";
  if (foreignTier === "none") return 0;

  const langTier = languageTier(firstLanguage);
  const langPointsRaw = langTier === "tier2" ? 25 : langTier === "tier1" ? 13 : 0;
  const langPoints = foreignTier === "tier2" ? (langTier === "tier2" ? 25 : langTier === "tier1" ? 13 : 0) : Math.min(13, langPointsRaw);

  const cdnTier = cdnYears >= 2 ? "tier2" : cdnYears >= 1 ? "tier1" : "none";
  const cdnPointsRaw = cdnTier === "tier2" ? 25 : cdnTier === "tier1" ? 13 : 0;
  const cdnPoints = foreignTier === "tier2" ? cdnPointsRaw : Math.min(13, cdnPointsRaw);

  return Math.min(50, langPoints + cdnPoints);
}

function certificateTransferability(hasCertificate: boolean, firstLanguage: FourSkills<FirstLangLevel>): number {
  if (!hasCertificate) return 0;
  if (firstLangAllAtLeast(firstLanguage, "L7")) return 50;
  if (firstLangAllAtLeast(firstLanguage, "L4_5")) return 25;
  return 0;
}

// --- D. Points supplémentaires ------------------------------------------

const CANADIAN_STUDY_POINTS: Record<CrsInput["canadianStudy"], number> = {
  NONE: 0,
  ONE_OR_TWO_YEARS: 15,
  THREE_YEARS_PLUS: 30,
};

function frenchBonusPoints(input: CrsInput): number {
  const frenchSkillsAllAtLeast7 = input.firstLanguageIsFrench
    ? firstLangAllAtLeast(input.firstLanguage, "L7")
    : input.secondLanguageTested && input.secondLanguage
    ? (["speaking", "listening", "reading", "writing"] as const).every((k) => input.secondLanguage![k] === "L7_8" || input.secondLanguage![k] === "L9P")
    : false;

  if (!frenchSkillsAllAtLeast7) return 0;

  if (input.firstLanguageIsFrench) {
    if (!input.secondLanguageTested || !input.secondLanguage) return 25;
    const englishAtLeastClb5 = (["speaking", "listening", "reading", "writing"] as const).every(
      (k) => input.secondLanguage![k] === "L7_8" || input.secondLanguage![k] === "L9P"
    );
    return englishAtLeastClb5 ? 50 : 25;
  }

  // Le français est la deuxième langue officielle : l'anglais est la première.
  const englishAtLeastClb5 = firstLangAllAtLeast(input.firstLanguage, "L6");
  return englishAtLeastClb5 ? 50 : 25;
}

export function calculateCrs(input: CrsInput): CrsBreakdown {
  const spouseKey = input.hasSpouse ? "withSpouse" : "withoutSpouse";
  const age = agePoints(input.age, input.hasSpouse);
  const education = EDUCATION_POINTS[input.education][spouseKey];
  const firstLanguage = sumFourSkills(input.firstLanguage, {
    LT4: FIRST_LANG_POINTS.LT4[spouseKey],
    L4_5: FIRST_LANG_POINTS.L4_5[spouseKey],
    L6: FIRST_LANG_POINTS.L6[spouseKey],
    L7: FIRST_LANG_POINTS.L7[spouseKey],
    L8: FIRST_LANG_POINTS.L8[spouseKey],
    L9: FIRST_LANG_POINTS.L9[spouseKey],
    L10P: FIRST_LANG_POINTS.L10P[spouseKey],
  });
  const secondLanguageRaw = input.secondLanguageTested && input.secondLanguage ? sumFourSkills(input.secondLanguage, SECOND_LANG_POINTS) : 0;
  const secondLanguage = Math.min(input.hasSpouse ? 22 : 24, secondLanguageRaw);
  const canadianWork = CDN_WORK_POINTS[input.canadianWorkExperienceYears][spouseKey];

  const coreCap = input.hasSpouse ? 460 : 500;
  const coreSubtotalRaw = age + education + firstLanguage + secondLanguage + canadianWork;
  const coreSubtotal = Math.min(coreCap, coreSubtotalRaw);

  let spouseEducation = 0;
  let spouseLanguage = 0;
  let spouseCanadianWork = 0;
  if (input.hasSpouse && input.spouse) {
    spouseEducation = SPOUSE_EDUCATION_POINTS[input.spouse.education];
    spouseLanguage = sumFourSkills(input.spouse.firstLanguage, SPOUSE_LANG_POINTS);
    spouseCanadianWork = SPOUSE_WORK_POINTS[input.spouse.canadianWorkExperienceYears];
  }
  const spouseSubtotal = Math.min(40, spouseEducation + spouseLanguage + spouseCanadianWork);

  const eduTransfer = educationTransferability(input.education, input.firstLanguage, input.canadianWorkExperienceYears);
  const foreignTransfer = foreignExperienceTransferability(input.foreignWorkExperienceYears, input.firstLanguage, input.canadianWorkExperienceYears);
  const certTransfer = certificateTransferability(input.hasCertificateOfQualification, input.firstLanguage);
  const transferSubtotal = Math.min(100, eduTransfer + foreignTransfer + certTransfer);

  const sibling = input.hasSiblingInCanada ? 15 : 0;
  const french = frenchBonusPoints(input);
  const canadianStudy = CANADIAN_STUDY_POINTS[input.canadianStudy];
  const pn = input.hasProvincialNomination ? 600 : 0;
  const additionalSubtotal = Math.min(600, sibling + french + canadianStudy + pn);

  const total = Math.min(CRS_MAX_SCORE, coreSubtotal + spouseSubtotal + transferSubtotal + additionalSubtotal);

  return {
    core: { age, education, firstLanguage, secondLanguage, canadianWork, subtotal: coreSubtotal, cap: coreCap },
    spouse: { education: spouseEducation, language: spouseLanguage, canadianWork: spouseCanadianWork, subtotal: spouseSubtotal, cap: 40 },
    transferability: { education: eduTransfer, foreignExperience: foreignTransfer, certificate: certTransfer, subtotal: transferSubtotal, cap: 100 },
    additional: { sibling, french, canadianStudy, provincialNomination: pn, subtotal: additionalSubtotal, cap: 600 },
    total,
  };
}

// Dernier seuil général connu (à resynchroniser avec le dernier tirage
// publié sur le tableau de bord — voir Draw en base).
export const LAST_KNOWN_THRESHOLD = 481;
export const SIMULATOR_MAX_SCORE = CRS_MAX_SCORE;

// --- Signal d'admissibilité de base (indicatif, pas une décision légale) --

export type EligibilityCheck = {
  eligible: boolean;
  reasons: string[];
};

// Vérifie quelques critères plancher communs aux trois programmes fédéraux
// d'Entrée express (PTQF, PTMS, CEC). Ce n'est PAS une évaluation légale
// complète (grille des 67 points du PTQF, exigences précises par TEER,
// candidatures provinciales, etc.) : seulement un signal d'alerte quand un
// profil est manifestement sous les seuils plancher les plus courants.
export function checkBasicEligibility(input: CrsInput): EligibilityCheck {
  const reasons: string[] = [];

  const allSkillsBelow4 = (["speaking", "listening", "reading", "writing"] as const).every(
    (k) => input.firstLanguage[k] === "LT4"
  );
  if (allSkillsBelow4) {
    reasons.push(
      "Ton résultat linguistique est sous le seuil minimal (NCLC/CLB 4) requis pour tout programme d'Entrée express."
    );
  }

  const hasAnyWorkExperience =
    input.canadianWorkExperienceYears > 0 || input.foreignWorkExperienceYears > 0 || input.hasCertificateOfQualification;
  if (!hasAnyWorkExperience) {
    reasons.push(
      "Aucune expérience de travail (canadienne, étrangère ou certificat de compétence) déclarée : les trois programmes fédéraux de base (travailleurs qualifiés, métiers spécialisés, expérience canadienne) exigent au moins une année d'expérience qualifiante — sauf en cas de désignation provinciale (PCP)."
    );
  }

  return { eligible: reasons.length === 0, reasons };
}
