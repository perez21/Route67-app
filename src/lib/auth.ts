import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "route67_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 jours

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET manquant ou trop court. Définis une valeur forte dans .env (voir .env.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  email: string;
};

// Crée un jeton signé contenant l'identité de l'utilisateur.
// Le jeton ne contient jamais le mot de passe ni son empreinte.
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

// Vérifie la signature et l'expiration du jeton. Renvoie null si invalide,
// plutôt que de lever une exception, pour que les appelants gèrent
// simplement le cas "non connecté".
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.userId === "string" && typeof payload.email === "string") {
      return { userId: payload.userId, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = {
  name: COOKIE_NAME,
  maxAge: SESSION_DURATION_SECONDS,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
};

// --- Double authentification (2FA) --------------------------------------
// Après un mot de passe valide sur un compte avec 2FA activée, on n'émet PAS
// tout de suite le vrai cookie de session : un jeton temporaire (5 min),
// distinct et de portée volontairement restreinte (juste l'identité, pas
// d'accès), est posé le temps de saisir le code TOTP. Voir
// /api/auth/verify-2fa.
const PENDING_2FA_COOKIE_NAME = "route67_2fa_pending";
const PENDING_2FA_DURATION_SECONDS = 60 * 5;

export async function createPendingTwoFactorToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload, pending2fa: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${PENDING_2FA_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyPendingTwoFactorToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.pending2fa === true && typeof payload.userId === "string" && typeof payload.email === "string") {
      return { userId: payload.userId, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}

export const PENDING_2FA_COOKIE = {
  name: PENDING_2FA_COOKIE_NAME,
  maxAge: PENDING_2FA_DURATION_SECONDS,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
};
