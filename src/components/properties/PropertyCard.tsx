import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";
import { Property } from "@/types/property";
import { formatPrice, isNewProperty, cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants";
import React from "react";

interface PropertyCardProps {
  property: Property;
}

/** Individual property card with image, details, and link */
const PropertyCard = React.memo(({ property }: PropertyCardProps) => {
  const isNew = isNewProperty(property.createdAt);

  return (
    <Link
      to={`/annonces/${property.slug}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={cn(
              "text-xs font-semibold px-3 py-1 rounded-full",
              property.offerType === "louer"
                ? "bg-secondary text-secondary-foreground"
                : "bg-success text-success-foreground"
            )}
          >
            {property.offerType === "louer" ? "À louer" : "À vendre"}
          </span>
          {isNew && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent text-accent-foreground animate-pulse">
              Nouveau
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {CATEGORY_LABELS[property.category] ?? property.category}
        </span>
        <h3 className="font-heading font-semibold text-foreground mt-1 mb-2 line-clamp-2 leading-snug">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin size={14} className="shrink-0" />
          <span>{property.location}</span>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble size={14} /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={14} /> {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 size={14} /> {property.surface}m²
          </span>
        </div>

        {/* Price */}
        <div className="font-heading font-bold text-lg text-primary">
          {formatPrice(property.price)}
          {property.offerType === "louer" && (
            <span className="text-sm text-muted-foreground font-normal">/mois</span>
          )}
        </div>
      </div>
    </Link>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
