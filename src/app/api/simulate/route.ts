import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { calculateCrs, checkBasicEligibility, LAST_KNOWN_THRESHOLD, SIMULATOR_MAX_SCORE, CrsInput } from "@/lib/crs";

const educationEnum = z.enum([
  "LT_SECONDARY", "SECONDARY", "ONE_YEAR", "TWO_YEAR", "BACHELOR", "TWO_OR_MORE", "MASTER_OR_PROFESSIONAL", "DOCTORATE",
]);
const firstLangEnum = z.enum(["LT4", "L4_5", "L6", "L7", "L8", "L9", "L10P"]);
const secondLangEnum = z.enum(["LT4", "L5_6", "L7_8", "L9P"]);
const fourFirstSkills = z.object({ speaking: firstLangEnum, listening: firstLangEnum, reading: firstLangEnum, writing: firstLangEnum });
const fourSecondSkills = z.object({ speaking: secondLangEnum, listening: secondLangEnum, reading: secondLangEnum, writing: secondLangEnum });

const simulateSchema = z.object({
  hasSpouse: z.boolean(),
  age: z.number().int().min(16).max(90),
  education: educationEnum,
  firstLanguage: fourFirstSkills,
  firstLanguageIsFrench: z.boolean(),
  secondLanguageTested: z.boolean(),
  secondLanguage: fourSecondSkills.optional(),
  canadianWorkExperienceYears: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  foreignWorkExperienceYears: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  hasCertificateOfQualification: z.boolean(),
  spouse: z
    .object({
      education: educationEnum,
      firstLanguage: fourFirstSkills,
      canadianWorkExperienceYears: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    })
    .optional(),
  hasSiblingInCanada: z.boolean(),
  canadianStudy: z.enum(["NONE", "ONE_OR_TWO_YEARS", "THREE_YEARS_PLUS"]),
  hasProvincialNomination: z.boolean(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = simulateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  const breakdown = calculateCrs(parsed.data as CrsInput);
  const eligibility = checkBasicEligibility(parsed.data as CrsInput);

  // Si l'utilisateur est connecté, on enregistre le score et le détail des
  // réponses (crsInput) pour qu'il retrouve et corrige sa simulation.
  const token = request.cookies.get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (session) {
    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { age: parsed.data.age, crsScore: breakdown.total, crsInput: parsed.data },
      create: { userId: session.userId, age: parsed.data.age, crsScore: breakdown.total, crsInput: parsed.data },
    });
  }

  return NextResponse.json({
    score: breakdown.total,
    breakdown,
    eligibility,
    maxScore: SIMULATOR_MAX_SCORE,
    threshold: LAST_KNOWN_THRESHOLD,
    saved: Boolean(session),
  });
}
