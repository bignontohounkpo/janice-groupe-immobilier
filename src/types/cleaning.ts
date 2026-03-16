/** TypeScript types for the cleaning services section */

/** Pricing formula for a cleaning service */
export interface CleaningFormula {
  name: string;
  frequency: string;
  included: string;
  price: string;
  isPopular?: boolean;
}

/** Step in the intervention process timeline */
export interface CleaningStep {
  number: number;
  title: string;
  description: string;
}

/** Target audience profile */
export interface CleaningProfile {
  icon: string;
  title: string;
  description: string;
}

/** SEO metadata for a cleaning service page */
export interface CleaningSeo {
  metaTitle: string;
  metaDescription: string;
}

/** Full cleaning service definition */
export interface CleaningService {
  id: string;
  slug: string;
  title: string;
  heroTitle: string;
  heroAccroche: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  badge: "Sur devis" | "Forfait disponible";
  included: string[];
  steps: CleaningStep[];
  targetProfiles: CleaningProfile[];
  formulas: CleaningFormula[] | null;
  formulaMessage?: string;
  seo: CleaningSeo;
}
