import { z } from "zod";

// Mot de passe : au moins 10 caractères, une majuscule, un chiffre.
// Suffisant pour un MVP ; à muscler (zxcvbn, listes de mots de passe
// compromis type HaveIBeenPwned) avant un vrai lancement public.
const passwordSchema = z
  .string()
  .min(10, "Le mot de passe doit contenir au moins 10 caractères.")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(100),
  email: z.string().trim().toLowerCase().email("Adresse email invalide."),
  password: passwordSchema,
  acceptedDisclaimer: z.literal(true, {
    errorMap: () => ({ message: "Merci de cocher la case pour confirmer que tu as compris ce point." }),
  }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

export const profileSchema = z.object({
  age: z.number().int().min(17).max(90).optional(),
  education: z.string().max(100).optional(),
  languageClb: z.number().int().min(0).max(10).optional(),
  workExperience: z.number().int().min(0).max(40).optional(),
  hasJobOffer: z.boolean().optional(),
  hasCanadianStudy: z.boolean().optional(),
});

export const checklistUpdateSchema = z.object({
  id: z.string().min(1),
  done: z.boolean(),
});
