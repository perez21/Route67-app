import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, isStaff } from "@/lib/session";
import { callClaude, AiNotConfiguredError } from "@/lib/ai";

const draftSchema = z.object({
  topic: z.string().trim().min(3).max(300),
});

const NEWS_SYSTEM_PROMPT = `Tu rédiges de courtes brèves d'actualité pour le site Route 67, qui informe des candidats camerounais et d'Afrique centrale sur l'Entrée express canadienne.
Réponds STRICTEMENT en JSON, sans texte autour, avec ce format exact :
{"title": "titre court et factuel (max 90 caractères)", "summary": "2 à 4 phrases neutres et factuelles, sans exagération ni promesse de résultat (max 500 caractères)"}
N'invente jamais de chiffres précis (scores, quotas, dates) si tu n'es pas certain : reste général plutôt que de risquer une fausse information. Cette brève sera relue par un administrateur humain avant publication.`;

// Pré-rédaction IA d'une actualité, à partir d'un sujet donné par l'admin
// (ex. "annonce du plafond 2026 des admissions"). Le texte généré est
// TOUJOURS soumis à relecture humaine avant publication (voir /admin/actualites) :
// aucune brève IA n'est publiée automatiquement sans validation.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = draftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Sujet invalide." }, { status: 400 });
  }

  try {
    const raw = await callClaude({
      system: NEWS_SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Sujet de la brève : ${parsed.data.topic}` }],
      maxTokens: 400,
    });
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const draft = JSON.parse(cleaned);
    return NextResponse.json({ draft });
  } catch (err) {
    if (err instanceof AiNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error(err);
    return NextResponse.json({ error: "Impossible de générer la brève pour le moment." }, { status: 502 });
  }
}
