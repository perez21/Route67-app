import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const requests = await prisma.upgradeRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true, tier: true } } },
  });

  return NextResponse.json({ requests });
}
