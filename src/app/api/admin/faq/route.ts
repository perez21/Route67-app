import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

const createSchema = z.object({
  question: z.string().trim().min(3).max(300),
  answer: z.string().trim().min(3).max(3000),
  order: z.number().int().optional(),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });

  const count = await prisma.faqItem.count();
  const item = await prisma.faqItem.create({ data: { ...parsed.data, order: parsed.data.order ?? count } });
  return NextResponse.json({ item }, { status: 201 });
}
