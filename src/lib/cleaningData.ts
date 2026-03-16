/** Mock data for the 6 cleaning services offered by the agency */

import type { CleaningService } from "@/types/cleaning";

export const CLEANING_SERVICES: CleaningService[] = [
  /* ── 1. Maisons & Villas ──────────────────────── */
  {
    id: "clean-1",
    slug: "nettoyage-maison-villa",
    icon: "Home",
    badge: "Forfait disponible",
    image: "/cleaning-maison.webp",
    title: "Maisons & Villas",
    heroTitle: "Nettoyage de Maisons & Villas à Cotonou",
    heroAccroche:
      "Rentrez dans une maison qui sent le propre, où chaque surface brille. Vous méritez un intérieur qui vous ressemble.",
    shortDescription:
      "Un intérieur impeccable, des surfaces brillantes. Nous prenons soin de votre maison comme si c'était la nôtre.",
    fullDescription:
      "Que ce soit pour un grand ménage ponctuel ou un entretien régulier, notre équipe intervient dans vos maisons et villas avec des produits professionnels adaptés à chaque surface. Nous accordons une attention particulière aux détails souvent oubliés : joints de carrelage, derrière les meubles, ventilateurs, fenêtres et terrasses.",
    included: [
      "Dépoussiérage complet de toutes les pièces",
      "Nettoyage des sols (carrelage, marbre, parquet)",
      "Nettoyage des vitres et fenêtres (intérieur)",
      "Nettoyage cuisine (plan de travail, évier, appareils)",
      "Nettoyage des salles de bain et WC (désinfection)",
      "Nettoyage des ventilateurs et climatiseurs (filtres)",
      "Nettoyage des terrasses et balcons",
      "Vidage et nettoyage des poubelles",
    ],
    steps: [
      { number: 1, title: "Prise de contact & évaluation", description: "Nous évaluons la superficie et vos besoins spécifiques pour établir un devis précis." },
      { number: 2, title: "Intervention de notre équipe", description: "Notre équipe arrive à l'heure convenue, équipée de tout le matériel nécessaire." },
      { number: 3, title: "Contrôle qualité", description: "Un responsable vérifie chaque pièce avant de vous remettre les clés." },
      { number: 4, title: "Votre satisfaction confirmée", description: "Vous inspectez avec nous. Si quelque chose ne vous convient pas, nous le refaisons immédiatement." },
    ],
    targetProfiles: [
      { icon: "Home", title: "Propriétaires", description: "Avant une mise en location ou après le départ d'un locataire." },
      { icon: "Users", title: "Familles", description: "Grand ménage mensuel ou préparation d'une réception." },
      { icon: "Key", title: "Expatriés & Diaspora", description: "Votre bien entretenu pendant votre absence, prêt à votre retour." },
    ],
    formulas: [
      { name: "Ponctuel", frequency: "Grand ménage unique", included: "Nettoyage complet toutes pièces", price: "Sur devis" },
      { name: "Mensuel", frequency: "1x par mois", included: "Nettoyage complet + vitres", price: "Tarif préférentiel" },
      { name: "Bihebdo", frequency: "2x par semaine", included: "Nettoyage complet régulier", price: "Tarif abonnement" },
    ],
    seo: {
      metaTitle: "Nettoyage Maisons & Villas Cotonou | GANDA Immobilier",
      metaDescription: "Service de nettoyage professionnel pour maisons et villas à Cotonou. Grand ménage, entretien régulier. Devis gratuit sous 24h.",
    },
  },

  /* ── 2. Bureaux & Espaces Pro ─────────────────── */
  {
    id: "clean-2",
    slug: "nettoyage-bureaux-espaces-pro",
    icon: "Briefcase",
    badge: "Forfait disponible",
    image: "/cleaning-bureaux.webp",
    title: "Bureaux & Espaces Professionnels",
    heroTitle: "Nettoyage de Bureaux & Espaces Professionnels",
    heroAccroche:
      "Un bureau propre booste la productivité et donne une image irréprochable à vos clients et partenaires dès leur entrée.",
    shortDescription:
      "Environnement de travail sain et motivant. Intervention tôt le matin ou en soirée selon vos horaires.",
    fullDescription:
      "Nous intervenons dans vos bureaux, open spaces, salles de réunion, espaces d'accueil et sanitaires. Discrets et efficaces, nos agents peuvent intervenir avant l'ouverture ou après la fermeture pour ne pas perturber votre activité. Devis adapté à votre surface et à votre fréquence souhaitée.",
    included: [
      "Dépoussiérage bureaux, écrans et matériel (sans déplacement)",
      "Nettoyage des sols (aspiration + lavage)",
      "Désinfection des surfaces de contact (poignées, claviers, téléphones)",
      "Nettoyage cuisine/salle de pause",
      "Nettoyage et désinfection des sanitaires",
      "Vidage des corbeilles et remplacement des sacs",
      "Nettoyage des vitres intérieures",
      "Entretien des espaces communs et couloirs",
    ],
    steps: [
      { number: 1, title: "Audit de vos locaux", description: "Visite gratuite pour évaluer la surface, le nombre de postes et vos contraintes horaires." },
      { number: 2, title: "Planification sur mesure", description: "Nous établissons un planning d'intervention adapté à vos horaires d'ouverture." },
      { number: 3, title: "Interventions régulières", description: "Nos agents interviennent selon le planning convenu, avec un cahier de passage signé." },
      { number: 4, title: "Suivi & reporting mensuel", description: "Un compte-rendu mensuel et un interlocuteur dédié pour toute demande spéciale." },
    ],
    targetProfiles: [
      { icon: "Briefcase", title: "PME & Startups", description: "Bureaux jusqu'à 500m², tarifs adaptés aux petites structures." },
      { icon: "Building2", title: "Grandes entreprises", description: "Immeubles de bureaux, plusieurs étages, équipes dédiées." },
      { icon: "Store", title: "Commerces & Boutiques", description: "Espaces de vente, vitrines et zones d'accueil clients." },
    ],
    formulas: [
      { name: "Quotidien", frequency: "5j/7", included: "Nettoyage complet bureaux + sanitaires", price: "Tarif mensuel fixe" },
      { name: "Bihebdo", frequency: "2 à 3x/semaine", included: "Nettoyage standard + vitres", price: "Tarif réduit" },
      { name: "Ponctuel", frequency: "Nettoyage unique", included: "Nettoyage complet one-shot", price: "Sur devis" },
    ],
    seo: {
      metaTitle: "Nettoyage Bureaux & Espaces Pro Cotonou | GANDA Immobilier",
      metaDescription: "Nettoyage professionnel de bureaux à Cotonou. Intervention discrète, horaires flexibles. Devis gratuit.",
    },
  },

  /* ── 3. Écoles & Établissements ───────────────── */
  {
    id: "clean-3",
    slug: "nettoyage-ecoles-etablissements",
    icon: "GraduationCap",
    badge: "Sur devis",
    image: "/cleaning-ecoles.webp",
    title: "Écoles & Établissements Scolaires",
    heroTitle: "Nettoyage d'Écoles & Établissements Scolaires",
    heroAccroche:
      "Un environnement propre favorise la concentration, la santé et le bien-être des élèves et du personnel enseignant.",
    shortDescription:
      "Salles de classe, sanitaires, cours de récréation. Un cadre sain pour les élèves et le personnel enseignant.",
    fullDescription:
      "Nous comprenons les exigences spécifiques des établissements scolaires : intervention hors temps de classe, désinfection poussée des zones sensibles, gestion des grands volumes. Maternelles, primaires, collèges, lycées et universités : notre équipe est formée aux protocoles d'hygiène adaptés à chaque niveau.",
    included: [
      "Nettoyage et désinfection des salles de classe",
      "Nettoyage des tableaux et mobilier scolaire",
      "Désinfection des sanitaires élèves et enseignants",
      "Nettoyage des couloirs, escaliers et espaces communs",
      "Entretien de la cour et des espaces extérieurs",
      "Nettoyage de la cantine / salle de restauration",
      "Désinfection des poignées, rampes et surfaces tactiles",
      "Gestion et évacuation des déchets",
    ],
    steps: [
      { number: 1, title: "Évaluation des locaux", description: "Visite de l'établissement pour cartographier les zones et définir le protocole adapté." },
      { number: 2, title: "Planning hors temps scolaire", description: "Toutes nos interventions ont lieu avant l'ouverture ou après la fermeture." },
      { number: 3, title: "Protocole d'hygiène renforcé", description: "Désinfection systématique des zones à fort contact : sanitaires, cantine, salles info." },
      { number: 4, title: "Rapport et suivi", description: "Cahier de passage, rapport hebdomadaire et interlocuteur dédié à la direction." },
    ],
    targetProfiles: [
      { icon: "School", title: "Écoles primaires & maternelles", description: "Protocole hygiène adapté aux jeunes enfants." },
      { icon: "BookOpen", title: "Collèges & Lycées", description: "Grands volumes, plusieurs bâtiments." },
      { icon: "GraduationCap", title: "Universités & Centres de formation", description: "Amphithéâtres, bibliothèques, laboratoires." },
    ],
    formulas: [
      { name: "Journalier", frequency: "Chaque jour scolaire", included: "Nettoyage standard + désinfection", price: "Forfait annuel" },
      { name: "Hebdomadaire", frequency: "1 à 2x par semaine", included: "Nettoyage complet", price: "Forfait mensuel" },
      { name: "Vacances", frequency: "Vacances scolaires", included: "Grand nettoyage approfondi", price: "Sur devis" },
    ],
    seo: {
      metaTitle: "Nettoyage Écoles & Établissements Cotonou | GANDA Immobilier",
      metaDescription: "Nettoyage professionnel d'écoles et établissements scolaires à Cotonou. Protocole hygiène renforcé, intervention hors temps de classe.",
    },
  },

  /* ── 4. Après Travaux ─────────────────────────── */
  {
    id: "clean-4",
    slug: "nettoyage-apres-travaux",
    icon: "HardHat",
    badge: "Sur devis",
    image: "/cleaning-travaux.webp",
    title: "Nettoyage après Travaux",
    heroTitle: "Nettoyage après Travaux à Cotonou",
    heroAccroche:
      "Votre chantier est terminé. Laissez-nous transformer ce chaos de poussière en espace prêt à vivre, en un temps record.",
    shortDescription:
      "Poussière de chantier, débris, résidus de peinture. Votre bien livré propre et prêt à habiter ou à commercialiser.",
    fullDescription:
      "Le nettoyage après travaux est un métier à part entière. Poussières fines incrustées, résidus de ciment, projections de peinture, copeaux et débris divers : notre équipe spécialisée dispose du matériel professionnel adapté pour remettre votre bien dans un état impeccable, prêt à être habité ou présenté à la vente ou à la location.",
    included: [
      "Évacuation des gravats et déchets de chantier légers",
      "Dépoussiérage complet murs, plafonds, boiseries",
      "Débarrassage des résidus de peinture et enduit",
      "Nettoyage approfondi des sols (carrelage, béton, parquet)",
      "Nettoyage des menuiseries (portes, fenêtres, volets)",
      "Nettoyage des sanitaires neufs (déstockage joint, silicone)",
      "Nettoyage des vitres et miroirs",
      "Aspiration et nettoyage des grilles et ventilations",
    ],
    steps: [
      { number: 1, title: "Évaluation post-chantier", description: "Visite du chantier pour évaluer l'ampleur du nettoyage et établir un devis précis." },
      { number: 2, title: "Débarrassage & gros nettoyage", description: "Évacuation des déchets légers, dépoussiérage général du sol au plafond." },
      { number: 3, title: "Nettoyage technique de précision", description: "Traitement des taches, résidus et surfaces délicates avec les bons produits." },
      { number: 4, title: "Livraison & validation", description: "Inspection finale avec le client. Le bien est propre, brillant et livrable." },
    ],
    targetProfiles: [
      { icon: "Wrench", title: "Propriétaires & Promoteurs", description: "Logement neuf ou rénové à livrer ou mettre en vente." },
      { icon: "Building2", title: "Entreprises BTP", description: "Sous-traitance nettoyage post-chantier pour vos projets clients." },
      { icon: "Home", title: "Particuliers en rénovation", description: "Cuisine, salle de bain ou logement entier après travaux." },
    ],
    formulas: null,
    formulaMessage: "Chaque chantier est unique. Contactez-nous pour un devis personnalisé sous 24h.",
    seo: {
      metaTitle: "Nettoyage après Travaux Cotonou | GANDA Immobilier",
      metaDescription: "Nettoyage professionnel après travaux à Cotonou. Poussière, résidus, débris : nous livrons votre bien propre et prêt à habiter.",
    },
  },

  /* ── 5. Événements ────────────────────────────── */
  {
    id: "clean-5",
    slug: "nettoyage-evenements",
    icon: "PartyPopper",
    badge: "Sur devis",
    image: "/cleaning-evenements.webp",
    title: "Événements & Réceptions",
    heroTitle: "Nettoyage Événementiel à Cotonou",
    heroAccroche:
      "Avant, pendant ou après votre événement : vous vous occupez de vos invités, nous nous occupons du reste.",
    shortDescription:
      "Avant, pendant et après votre événement. Mariages, conférences, cérémonies : votre salle reste impeccable du début à la fin.",
    fullDescription:
      "Mariage, baptême, conférence, séminaire, inauguration ou soirée d'entreprise : nous intervenons avant l'événement pour préparer l'espace, pendant pour maintenir la propreté en temps réel, et après pour un nettoyage complet et rapide. Vous rendez votre salle dans les délais, sans stress.",
    included: [
      "Nettoyage et préparation de la salle avant l'événement",
      "Mise en place des poubelles et zones de collecte",
      "Équipe présente pendant l'événement (discrets, en tenue)",
      "Ramassage continu des déchets pendant la réception",
      "Nettoyage complet de la salle après l'événement",
      "Évacuation de tous les déchets",
      "Nettoyage des sanitaires avant, pendant et après",
      "Remise en état des espaces extérieurs (parking, jardin)",
    ],
    steps: [
      { number: 1, title: "Brief événement", description: "Nous prenons connaissance de votre événement : type, lieu, nombre d'invités, durée." },
      { number: 2, title: "Préparation J-1", description: "Nettoyage et préparation complète de la salle la veille ou le matin de l'événement." },
      { number: 3, title: "Présence discrète pendant l'événement", description: "Notre équipe maintient la propreté sans se faire remarquer." },
      { number: 4, title: "Nettoyage post-événement", description: "La salle est rendue propre dans les délais exigés par le propriétaire des lieux." },
    ],
    targetProfiles: [
      { icon: "Heart", title: "Mariages & Cérémonies", description: "Le jour J doit être parfait, même côté propreté." },
      { icon: "Mic", title: "Conférences & Séminaires", description: "Image professionnelle maintenue tout au long." },
      { icon: "Building", title: "Entreprises & Associations", description: "Inaugurations, soirées, assemblées générales." },
    ],
    formulas: null,
    formulaMessage: "Tarif selon la durée, le type et la superficie. Devis gratuit sous 24h.",
    seo: {
      metaTitle: "Nettoyage Événementiel Cotonou | GANDA Immobilier",
      metaDescription: "Nettoyage avant, pendant et après vos événements à Cotonou. Mariages, conférences, cérémonies. Devis gratuit.",
    },
  },

  /* ── 6. Entretien Régulier & Abonnement ───────── */
  {
    id: "clean-6",
    slug: "entretien-regulier-abonnement",
    icon: "CalendarCheck",
    badge: "Forfait disponible",
    image: "/cleaning-entretien.webp",
    title: "Entretien Régulier & Abonnement",
    heroTitle: "Entretien Régulier — Abonnement Nettoyage",
    heroAccroche:
      "Fini le stress du ménage. Avec notre abonnement, votre espace est toujours propre. Automatiquement.",
    shortDescription:
      "Quotidien, hebdomadaire ou mensuel : choisissez la formule qui vous convient. Tarif préférentiel garanti.",
    fullDescription:
      "Optez pour la tranquillité d'esprit avec notre formule d'entretien régulier. Que vous soyez un particulier, une entreprise ou un établissement, nous définissons ensemble la fréquence et le périmètre d'intervention. Vous bénéficiez d'un tarif préférentiel, d'un agent attitré qui connaît vos locaux et d'une facturation mensuelle simple.",
    included: [
      "Agent(s) attitrés à vos locaux",
      "Planning fixe défini ensemble (jours & horaires)",
      "Produits et matériel fournis par nos soins",
      "Remplacement automatique en cas d'absence de l'agent",
      "Facturation mensuelle claire et sans surprise",
      "Interlocuteur dédié joignable à tout moment",
      "Rapport d'intervention après chaque passage",
      "Révision tarifaire bloquée pendant 12 mois",
    ],
    steps: [
      { number: 1, title: "Audit & devis", description: "Visite gratuite pour définir vos besoins, la surface et la fréquence optimale." },
      { number: 2, title: "Signature du contrat d'abonnement", description: "Contrat clair, sans engagement minimum abusif, résiliable avec préavis." },
      { number: 3, title: "Démarrage avec votre agent attitré", description: "Votre agent est formé à vos spécificités dès la première intervention." },
      { number: 4, title: "Suivi continu & ajustements", description: "Nous adaptons le service si vos besoins évoluent (déménagement, agrandissement...)." },
    ],
    targetProfiles: [
      { icon: "Home", title: "Particuliers actifs", description: "Plus de temps pour vous, plus de stress ménager." },
      { icon: "Briefcase", title: "TPE / PME", description: "Locaux toujours propres, coût maîtrisé." },
      { icon: "Building2", title: "Gestionnaires d'immeubles", description: "Parties communes, halls d'entrée et ascenseurs entretenus en permanence." },
    ],
    formulas: [
      { name: "Essentiel", frequency: "1x par semaine", included: "Nettoyage standard toutes pièces", price: "À partir de 35 000 XOF/mois" },
      { name: "Confort", frequency: "2x par semaine", included: "Nettoyage complet + vitres intérieures", price: "À partir de 60 000 XOF/mois", isPopular: true },
      { name: "Premium", frequency: "Quotidien (5j/7)", included: "Nettoyage complet + pressing linge de maison", price: "Sur devis" },
    ],
    seo: {
      metaTitle: "Entretien Régulier & Abonnement Nettoyage Cotonou | GANDA Immobilier",
      metaDescription: "Abonnement nettoyage à Cotonou. Entretien régulier pour particuliers et entreprises. À partir de 35 000 XOF/mois.",
    },
  },
];

/** Helper to find a service by slug */
export const getCleaningServiceBySlug = (slug: string): CleaningService | undefined =>
  CLEANING_SERVICES.find((s) => s.slug === slug);

/** Get all slugs for static generation / routing */
export const getCleaningSlugs = (): string[] =>
  CLEANING_SERVICES.map((s) => s.slug);
