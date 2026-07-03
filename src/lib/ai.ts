// Intégration IA (Claude / Anthropic) côté serveur uniquement.
// La clé n'est JAMAIS exposée au client : toutes les routes /api/ai/*
// et /api/admin/*/ai-draft passent par cette fonction depuis le serveur.
//
// Pour activer les fonctionnalités IA (assistant candidat, pré-rédaction
// d'actualités, explication de l'admissibilité), définis ANTHROPIC_API_KEY
// dans .env — voir .env.example. Sans clé, les endpoints IA répondent
// avec un message clair plutôt que de planter le reste du site.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

export class AiNotConfiguredError extends Error {
  constructor() {
    super(
      "L'assistant IA n'est pas configuré sur ce serveur (ANTHROPIC_API_KEY manquante)."
    );
    this.name = "AiNotConfiguredError";
  }
}

type AiMessage = { role: "user" | "assistant"; content: string };

export async function callClaude(params: {
  system: string;
  messages: AiMessage[];
  maxTokens?: number;
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new AiNotConfiguredError();

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: params.maxTokens ?? 700,
      system: params.system,
      messages: params.messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Appel IA échoué (${res.status}) : ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = (data.content ?? [])
    .filter((block: { type: string }) => block.type === "text")
    .map((block: { text: string }) => block.text)
    .join("\n")
    .trim();

  return text || "Je n'ai pas pu générer de réponse cette fois-ci. Réessaie dans un instant.";
}

// Prompt système partagé par l'assistant candidat (chat) : cadre le rôle,
// rappelle les limites (pas un conseil juridique) et garde les réponses
// courtes et actionnables pour un public mobile, au Cameroun et en Afrique
// centrale, qui prépare son dossier Entrée express.
export const ASSISTANT_SYSTEM_PROMPT = `Tu es l'assistant IA de Route 67, une plateforme d'information sur l'Entrée express canadienne pour les candidats du Cameroun et d'Afrique centrale.

Règles :
- Réponds toujours en français, de façon claire, chaleureuse et concise (pas plus de 200 mots sauf si la question l'exige vraiment).
- Tu expliques le fonctionnement de l'Entrée express, le score CRS, les documents requis, les délais généraux et les organismes officiels (IRCC, WES, ICAS, etc.).
- Tu n'es PAS un consultant en immigration agréé (CRCIC) ni un avocat : pour toute décision qui engage juridiquement le dossier d'une personne, rappelle-le brièvement et invite à consulter un professionnel réglementé ou le site officiel canada.ca.
- Ne donne jamais de garantie de résultat ("tu seras accepté", "ton score suffira") : parle en termes de probabilités et de tendances des tirages.
- Si la question sort du champ de l'immigration canadienne, réponds brièvement puis recentre poliment sur le sujet de la plateforme.`;
