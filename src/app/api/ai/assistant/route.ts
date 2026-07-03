import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, isTierAtLeast, isStaff } from "@/lib/session";
import { callClaude, ASSISTANT_SYSTEM_PROMPT, AiNotConfiguredError } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rateLimit";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      })
    )
    .min(1)
    .max(20),
});

// Assistant IA réservé aux membres Premium (et à l'équipe) — 40 questions/jour.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (!isTierAtLeast(user.tier, "PREMIUM") && !isStaff(user.role)) {
    return NextResponse.json({ error: "L'assistant IA est réservé aux membres Premium." }, { status: 403 });
  }

  const limit = 40;
  const allowed = checkRateLimit(`ai-assistant:${user.id}`, limit, 24 * 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Limite quotidienne de questions à l'assistant atteinte. Réessaie demain." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Message invalide." }, { status: 400 });
  }

  try {
    const reply = await callClaude({
      system: ASSISTANT_SYSTEM_PROMPT,
      messages: parsed.data.messages,
    });
    return NextResponse.json({ reply });
  } catch (err) {
    if (err instanceof AiNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error(err);
    return NextResponse.json({ error: "L'assistant est momentanément indisponible." }, { status: 502 });
  }
}
