"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { MapPin, BedDouble, Bath, Maximize2, ArrowLeft, Check } from "lucide-react"
import { fetchProperties } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import { CATEGORY_LABELS, AGENCY } from "@/lib/constants"
import PropertyCard from "@/components/properties/PropertyCard"
import { useState, useEffect } from "react"
import type { Property } from "@/types/property"

/** Property detail page */
const PropertyDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [similar, setSimilar] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    async function loadProperty() {
      if (!slug) return

      setLoading(true)
      try {
        const all = await fetchProperties()
        const found = all.find((p) => p.slug === slug)

        if (found) {
          setProperty(found)
          // Biens similaires (même type d'offre)
          setSimilar(
            all
              .filter((p) => p.id !== found.id && p.offerType === found.offerType)
              .slice(0, 3)
          )
        }
      } catch (error) {
        console.error("Error loading property:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProperty()
  }, [slug])

  if (loading) {
    return (
      <main className="section-padding">
        <div className="container-custom text-center">
          <p className="text-muted-foreground text-lg">Chargement...</p>
        </div>
      </main>
    )
  }

  if (!property) {
    return (
      <main className="section-padding">
        <div className="container-custom text-center">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-4">Bien non trouvé</h1>
          <Link href="/annonces" className="text-secondary hover:underline">
            ← Retour aux annonces
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="section-padding ">
      <div className="container-custom">
        <Link href="/annonces" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6">
          <ArrowLeft size={18} />
          Retour aux annonces
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: images + details */}
          <div className="lg:col-span-2">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/10]">
              <img
                src={property.images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex gap-3 mb-8">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? "border-accent" : "border-transparent"
                    }`}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Info */}
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {CATEGORY_LABELS[property.category]}
            </span>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mt-1 mb-3">
              {property.title}
            </h1>
            <div className="flex items-center gap-1 text-muted-foreground mb-4">
              <MapPin size={16} />
              <span>{property.location}</span>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6 py-4 border-y border-border">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1.5"><BedDouble size={16} /> {property.bedrooms} chambre{property.bedrooms > 1 ? "s" : ""}</span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1.5"><Bath size={16} /> {property.bathrooms} sdb</span>
              )}
              <span className="flex items-center gap-1.5"><Maximize2 size={16} /> {property.surface}m²</span>
            </div>

            <p className="text-foreground leading-relaxed mb-8">{property.description}</p>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Équipements</h2>
                <div className="flex flex-wrap gap-3">
                  {property.amenities.map((a) => (
                    <span key={a} className="flex items-center gap-1.5 text-sm bg-muted px-3 py-1.5 rounded-full text-foreground">
                      <Check size={14} className="text-success" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Price card */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="font-heading font-bold text-2xl text-primary mb-1">
                {formatPrice(property.price)}
                {property.offerType === "louer" && (
                  <span className="text-base text-muted-foreground font-normal">/mois</span>
                )}
              </div>
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2 ${
                property.isAvailable ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
              }`}>
                {property.isAvailable ? "Disponible" : "Indisponible"}
              </span>

              <a
                href={AGENCY.PHONE_LINK}
                className="flex items-center justify-center gap-2 w-full mt-6 bg-accent text-accent-foreground font-semibold py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Appeler maintenant
              </a>
              <a
                href={AGENCY.WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-3 border-2 border-success text-success font-semibold py-3 rounded-full hover:bg-success/10 transition-colors"
              >
                WhatsApp
              </a>
            </div>

          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
              Biens similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: property.title,
            description: property.description,
            url: `https://votreagence.com/annonces/${property.slug}`,
            price: property.price,
            priceCurrency: "XOF",
            address: {
              "@type": "PostalAddress",
              addressLocality: property.city,
              addressCountry: "BJ",
            },
          }),
        }}
      />
    </main>
  )
}

export default PropertyDetailPage
