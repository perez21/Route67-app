import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

async function requireAdmin(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return null;
  return user;
}

// L'image est acceptée en URL directe ou en data URL base64 (téléversement
// depuis /admin/actualites, voir AdminNewsManager) — aucun service de
// stockage externe n'est branché dans ce MVP, donc on limite la taille pour
// ne pas alourdir la base de données outre mesure.
const MAX_IMAGE_LENGTH = 1_800_000; // ~1.3 Mo en base64

const createSchema = z.object({
  title: z.string().trim().min(3).max(180),
  summary: z.string().trim().min(3).max(2000),
  sourceUrl: z.string().trim().url().optional().or(z.literal("")),
  imageUrl: z.string().trim().max(MAX_IMAGE_LENGTH).optional().or(z.literal("")),
  aiGenerated: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const news = await prisma.newsItem.create({
    data: {
      title: parsed.data.title,
      summary: parsed.data.summary,
      sourceUrl: parsed.data.sourceUrl || undefined,
      imageUrl: parsed.data.imageUrl || undefined,
      aiGenerated: parsed.data.aiGenerated ?? false,
    },
  });

  return NextResponse.json({ news }, { status: 201 });
}
