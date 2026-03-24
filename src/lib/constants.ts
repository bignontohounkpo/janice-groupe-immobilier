/** Global constants for the real estate agency website */

export const AGENCY = {
  NAME: process.env.NEXT_PUBLIC_AGENCY_NAME || "JANICE GROUPE IMMOBILIER",
  PHONE: process.env.NEXT_PUBLIC_AGENCY_PHONE || "+229 97507052",
  PHONE_LINK: `tel:${(process.env.NEXT_PUBLIC_AGENCY_PHONE || "+229 97507052").replace(/\s+/g, "")}`,
  EMAIL: process.env.NEXT_PUBLIC_AGENCY_EMAIL || "contact@gji-immobilier-benin.com",
  ADDRESS: process.env.NEXT_PUBLIC_AGENCY_ADDRESS || "Cotonou, Bénin",
  WHATSAPP: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22997507052"}`,
} as const;

export const NAV_LINKS = [
    { label: "Accueil", href: "/" },
  { label: "Location", href: "/location" },
  { label: "Vente", href: "/vente" },
  { label: "Annonces", href: "/annonces" },
  { label: "Services", href: "/services" },
  { label: "Nettoyage", href: "/nettoyage" },
] as const;

export const HERO = {
  TITLE: "Trouvez le bien immobilier de vos rêves au Bénin",
  SUBTITLE: "Appartements, villas et terrains à Cotonou et environs. Notre équipe vous accompagne de la recherche à la signature.",
  CTA_PRIMARY: "Rechercher",
  CTA_SECONDARY: "Nos Opportunittés",
  BADGE: "+250 biens disponibles · Cotonou · Calavi · Abomey-Calavi",
} as const;

export const SERVICES = {
  TITLE: "Tout ce dont vous avez besoin, en un seul endroit",
  SUBTITLE: "De la recherche à la remise des clés, nous gérons tout pour vous.",
  ITEMS: [
    {
      icon: "Building2" as const,
      title: "Location de qualité",
      text: "Appartements meublés ou non, villas de standing. Sélection stricte, inventaire détaillé.",
      link: "Voir les locations →",
      href: "/location",
    },
    {
      icon: "Home" as const,
      title: "Achat immobilier sécurisé",
      text: "Terrains, maisons, appartements. Accompagnement juridique et foncier inclus.",
      link: "Voir les ventes →",
      href: "/vente",
    },
    {
      icon: "TrendingUp" as const,
      title: "Vendez au meilleur prix",
      text: "Estimation gratuite, diffusion large, négociation professionnelle. Résultat garanti.",
      link: "Confier mon bien →",
      href: "/contact",
    },
    {
      icon: "Hammer" as const,
      title: "Construction & BTP",
      text: "Vous êtes de la diaspora ou résident ? Nous construisons votre maison clé en main.",
      link: "En savoir plus →",
      href: "/services",
    },
  ],
} as const;

export const STATS = [
  { value: "250+", label: "Biens disponibles" },
  { value: "12+", label: "Années d'expérience" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "24h", label: "Délai de réponse moyen" },
] as const;

export const PROCESS = {
  TITLE: "Comment ça marche ?",
  STEPS: [
    {
      step: 1,
      title: "Parlez-nous de votre projet",
      text: "Budget, localisation, surface souhaitée : nous étudions chaque détail pour cerner exactement vos besoins.",
    },
    {
      step: 2,
      title: "Nous trouvons les meilleurs biens",
      text: "Notre réseau et notre expérience nous permettent de vous proposer une sélection ciblée qui respecte vos critères.",
    },
    {
      step: 3,
      title: "Visite, négociation et signature",
      text: "De la première visite jusqu'à la remise des clés, nous restons à vos côtés à chaque étape.",
    },
  ],
} as const;

export const TESTIMONIALS = {
  TITLE: "Ils nous ont fait confiance",
  ITEMS: [
    {
      name: "Sophie M.",
      text: "Appartement trouvé en 3 jours. Une équipe réactive et vraiment à l'écoute. Je recommande vivement !",
      rating: 5,
      tag: "Location Cotonou",
    },
    {
      name: "Rodrigue A.",
      text: "Investissement réalisé depuis la France sans stress. Tout s'est passé exactement comme prévu. Merci GANDA !",
      rating: 5,
      tag: "Achat diaspora",
    },
    {
      name: "Fatou K.",
      text: "Villa meublée parfaite pour mon séjour professionnel. Photos conformes, quartier calme. Très satisfaite.",
      rating: 5,
      tag: "Villa meublée",
    },
  ],
} as const;

export const CTA_SECTION = {
  TITLE: "Vous avez un projet immobilier ?",
  TEXT: "Ne perdez plus de temps à chercher seul. Nos conseillers sont disponibles 6j/7 pour vous accompagner et répondre à toutes vos questions gratuitement.",
  BUTTON: "Nous contacter maintenant",
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  "appartement-meuble": "Appartement meublé",
  "appartement-non-meuble": "Appartement non meublé",
  "villa-meublee": "Villa meublée",
  "villa-non-meublee": "Villa non meublée",
  "terrain": "Terrain",
  "bureau": "Bureau",
};

export const DISTRICTS = [
  "Fidjrossè",
  "Cadjehoun",
  "Akpakpa",
  "Haie Vive",
  "Cocotiers",
  "Calavi",
  "Abomey-Calavi",
  "Ganhi",
  "Zogbohouè",
] as const;
