"use client";

import { useParams } from "next/navigation"
import Link from "next/link"
import { MapPin, BedDouble, Bath, Maximize2, ArrowLeft, Check } from "lucide-react"
import { fetchProperties } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import { CATEGORY_LABELS } from "@/lib/constants"
import PropertyCard from "@/components/properties/PropertyCard"
import { useState, useEffect } from "react"
import type { Property } from "@/types/property"
import { getPropertyWhatsAppMessage } from "@/lib/whatsapp"
import { useSettings } from "@/context/SettingsContext"

/** Property detail page */
const PropertyDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { agency } = useSettings()
  const [property, setProperty] = useState<Property | null>(null)
  const [similar, setSimilar] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    async function loadData() {
      if (!slug) return

      setLoading(true)
      try {
        const data = await fetchProperties()
        const found = data.find((p) => p.slug === slug)

        if (found) {
          setProperty(found)
          // Similar properties in same category
          const related = data
            .filter((p) => p.category === found.category && p.id !== found.id)
            .slice(0, 3)
          setSimilar(related)
        }
      } catch (err) {
        console.error("Error loading property detail:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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
                href={agency.PHONE_LINK}
                className="flex items-center justify-center gap-2 w-full mt-6 bg-accent text-accent-foreground font-semibold py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Appeler maintenant
              </a>
              <a
                href={`${agency.WHATSAPP}?text=${encodeURIComponent(
                  getPropertyWhatsAppMessage(property.title, property.slug, property.price, property.location)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-success text-success-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
              >
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1">
                  <svg viewBox="0 0 24 24" className="fill-success">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                Discuter sur WhatsApp
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
