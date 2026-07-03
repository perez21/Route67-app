// Limiteur de tentatives très simple, en mémoire.
// Suffisant pour un MVP mono-instance. En production avec plusieurs
// instances serveur (ce qui est courant en hébergement serverless),
// remplace ceci par un compteur partagé (ex. Redis / Upstash) sans quoi
// chaque instance aura son propre compteur et la protection sera partielle.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}
