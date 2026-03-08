import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MOCK_PROPERTIES } from "@/lib/mockData";
import PropertyCard from "@/components/properties/PropertyCard";

/** Featured properties grid on the homepage */
const FeaturedProperties = () => {
  const featured = MOCK_PROPERTIES.filter((p) => p.isFeatured);

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
            to="/annonces"
            className="text-secondary font-medium hover:text-primary transition-colors whitespace-nowrap"
          >
            Voir toutes les annonces →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((property, i) => (
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
