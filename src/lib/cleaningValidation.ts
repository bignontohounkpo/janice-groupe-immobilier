/** Zod schema for the cleaning quote request form */

import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  phone: z.string().trim().min(8, "Numéro de téléphone invalide").max(20),
  email: z.string().trim().email("Adresse email invalide").max(255),
  localType: z.string().min(1, "Veuillez sélectionner un type de local"),
  surface: z.string().optional(),
  frequency: z.string().optional(),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(1000),
  honeypot: z.string().max(0).optional(),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;

/** Options for the "type de local" select */
export const LOCAL_TYPE_OPTIONS = [
  "Maison / Villa",
  "Appartement",
  "Bureau / Open space",
  "Commerce / Boutique",
  "École / Établissement",
  "Salle événementielle",
  "Chantier (après travaux)",
  "Autre",
] as const;

/** Options for the "fréquence" select */
export const FREQUENCY_OPTIONS = [
  "Ponctuel (une seule fois)",
  "1x par semaine",
  "2x par semaine",
  "Quotidien (5j/7)",
  "Mensuel",
  "À définir ensemble",
] as const;
