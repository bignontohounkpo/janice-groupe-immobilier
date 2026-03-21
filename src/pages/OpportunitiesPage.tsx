"use client";

import { TrendingUp, MapPin, Ruler, DollarSign, Target } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_PROPERTIES } from "@/lib/mockData";
import PropertyCard from "@/components/properties/PropertyCard";
import type { Property } from "@/types/property";

const OpportunitiesPage = () => {
  // Filter only terrain properties for sale
  const terrainOpportunities = MOCK_PROPERTIES.filter(
    (property) => property.offerType === "vendre" && property.category === "terrain"
  );

  return (
    <main className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            Meilleures opportunités d'investissement
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Des terrains et projets immobiliers à fort potentiel de rentabilité. Investissements sécurisés sans regret au Bénin.
          </p>
        </div>



        {/* Properties Grid - using existing PropertyCard component */}
        {terrainOpportunities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Aucun terrain disponible pour le moment.
            </p>
          </div>
        ) : (
          <>

          
            <p className="text-sm text-muted-foreground mb-6">
              {terrainOpportunities.length} terrain{terrainOpportunities.length > 1 ? "s" : ""} disponible{terrainOpportunities.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {terrainOpportunities.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

                    {/* Hero stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-card rounded-2xl shadow-card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary mb-1">28%</p>
            <p className="text-sm text-muted-foreground">ROI moyen</p>
          </div>
          <div className="bg-card rounded-2xl shadow-card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary mb-1">{terrainOpportunities.length}</p>
            <p className="text-sm text-muted-foreground">Terrains disponibles</p>
          </div>
          <div className="bg-card rounded-2xl shadow-card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary mb-1">24h</p>
            <p className="text-sm text-muted-foreground">Réponse garantie</p>
          </div>
          <div className="bg-card rounded-2xl shadow-card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary mb-1">100%</p>
            <p className="text-sm text-muted-foreground">Sécurisé</p>
          </div>
        </div>       

          </>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-primary-foreground text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
            Prêt à investir dans un projet sans regret ?
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-6">
            Nos experts vous accompagnent à chaque étape : analyse d'investissement, financement, légalité et suivi. Contactez-nous pour une consultation gratuite.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-background text-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Consulter nos experts
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OpportunitiesPage;
