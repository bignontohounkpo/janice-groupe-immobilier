"use client";

import { motion } from "framer-motion";
import { fetchFeaturedProperties } from "@/lib/api";
import PropertyCard from "@/components/properties/PropertyCard";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Property } from "@/types/property";

/** Featured properties grid on the homepage */
const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await fetchFeaturedProperties();
        setProperties(data.slice(0, 6)); // Max 6 sur la homepage
      } catch (error) {
        console.error("Error loading featured properties:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  if (loading) {
    return null; // Ou un skeleton
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">
              Biens à la une
            </h2>
            <p className="text-muted-foreground text-lg">
              Notre sélection de biens soigneusement vérifiés
            </p>
          </div>
          <Link
            href="/annonces"
            className="text-secondary font-medium hover:text-primary transition-colors whitespace-nowrap"
          >
            Voir toutes les annonces →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
