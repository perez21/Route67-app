import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

// Routes qui exigent simplement d'être connecté. La distinction plus fine
// (rôle ADMIN, palier PREMIUM) est revérifiée en base dans chaque page/route
// via src/lib/session.ts — le middleware ne fait qu'une première barrière
// rapide côté cookie/JWT (Edge runtime, pas d'accès direct à la base ici).
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/forum",
  "/rendez-vous",
  "/admin",
  "/api/profile",
  "/api/checklist",
  "/api/forum",
  "/api/appointments",
  "/api/subscription",
  "/api/admin",
  "/api/ai",
  "/api/account",
  "/api/chat",
];

export async function middleware(request: NextRequest) {
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/forum/:path*",
    "/rendez-vous/:path*",
    "/admin/:path*",
    "/api/profile/:path*",
    "/api/checklist/:path*",
    "/api/forum/:path*",
    "/api/appointments/:path*",
    "/api/subscription/:path*",
    "/api/admin/:path*",
    "/api/ai/:path*",
    "/api/account/:path*",
    "/api/chat/:path*",
  ],
};
