import { prisma } from "@/lib/db";
import AdminFaqManager from "@/components/admin/AdminFaqManager";

export default async function AdminFaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });

  return <AdminFaqManager initialItems={items} />;
}
