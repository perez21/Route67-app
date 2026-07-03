import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Route publique : FAQ consultable par tous, pas besoin de session.
export async function GET() {
  const items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ items });
}
