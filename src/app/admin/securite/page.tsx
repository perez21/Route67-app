import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import TwoFactorSetup from "@/components/admin/TwoFactorSetup";

export default async function AdminSecurityPage() {
  const token = cookies().get(SESSION_COOKIE.name)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const user = session ? await prisma.user.findUnique({ where: { id: session.userId }, select: { totpEnabled: true } }) : null;

  return (
    <div className="max-w-lg">
      <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wide text-charcoal/55">
        Double authentification (2FA)
      </h2>
      <TwoFactorSetup initialEnabled={user?.totpEnabled ?? false} />
    </div>
  );
}
