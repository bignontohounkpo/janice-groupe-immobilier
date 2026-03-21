"use client";

import { Building2, Home, TrendingUp, Hammer, Users, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const SERVICES_LIST = [
  {
    icon: Building2,
    title: "Location de qualité",
    description: "Nous proposons une sélection rigoureuse d'appartements et villas à louer, meublés ou non. Chaque bien est vérifié, inventorié et conforme à nos standards de qualité.",
    link: "/location",
    cta: "Voir les locations",
  },
  {
    icon: Home,
    title: "Achat immobilier sécurisé",
    description: "De la recherche du bien idéal à la signature chez le notaire, nous vous accompagnons à chaque étape. Vérification foncière, négociation et suivi juridique complets.",
    link: "/vente",
    cta: "Voir les ventes",
  },
  {
    icon: TrendingUp,
    title: "Vente de votre bien",
    description: "Estimation gratuite, mise en valeur professionnelle, diffusion sur nos canaux et négociation experte. Nous vendons votre bien au meilleur prix dans les meilleurs délais.",
    link: "/contact",
    cta: "Confier mon bien",
  },
  {
    icon: Hammer,
    title: "Construction & BTP",
    description: "Diaspora ou résident, nous construisons votre maison clé en main. Plans architecturaux, suivi de chantier, respect des délais et du budget.",
    link: "/contact",
    cta: "Demander un devis",
  },
  {
    icon: Users,
    title: "Gestion locative",
    description: "Nous gérons votre patrimoine immobilier : recherche de locataires, encaissement des loyers, maintenance et reporting mensuel.",
    link: "/contact",
    cta: "En savoir plus",
  },
  {
    icon: Shield,
    title: "Conseil juridique",
    description: "Notre équipe juridique vous accompagne pour toutes les questions foncières, les baux, les litiges et la régularisation de vos titres de propriété.",
    link: "/contact",
    cta: "Nous consulter",
  },
];

const ServicesPage = () => {
  return (
    <main className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Nos services
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un accompagnement complet pour tous vos projets immobiliers au Bénin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_LIST.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-secondary" />
                </div>
                <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {service.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <Link
                  href={service.link}
                  className="text-secondary font-medium text-sm hover:text-primary transition-colors"
                >
                  {service.cta} →
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default ServicesPage;
