"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { MOCK_PROPERTIES } from "@/lib/mockData"
import { CATEGORY_LABELS, DISTRICTS } from "@/lib/constants"
import { useDebounce } from "@/hooks/useDebounce"
import PropertyCard from "@/components/properties/PropertyCard"
import type { OfferType, PropertyCategory } from "@/types/property"

interface AnnoncesPageProps {
  forcedOfferType?: OfferType
  title?: string
  description?: string
  hideOfferTypeFilter?: boolean
  basePath?: string
}

/** Annonces page with filters and property grid */
const AnnoncesPage = ({ forcedOfferType, title, description, hideOfferTypeFilter = false, basePath = "/annonces" }: AnnoncesPageProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams?.get("search") ?? ""
  const debouncedSearch = useDebounce(search)

  // Use forced offer type from props, or from URL, or undefined
  const offerType = forcedOfferType || (searchParams?.get("type") as OfferType) || undefined
  const category = (searchParams?.get("category") as PropertyCategory) || undefined
  const district = searchParams?.get("district") || undefined

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    if (value) params.set(key, value)
    else params.delete(key)

    // Add forced offer type to params if needed
    if (forcedOfferType && key !== "type") {
      params.set("type", forcedOfferType)
    }

    router.push(`${basePath}?${params.toString()}`)
  }

  const filtered = useMemo(() => {
    return MOCK_PROPERTIES.filter((p) => {
      if (offerType && p.offerType !== offerType) return false
      if (category && p.category !== category) return false
      if (district && p.district !== district) return false
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [offerType, category, district, debouncedSearch])

  return (
    <main className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            {title || "Toutes nos annonces immobilières"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description || "Découvrez notre sélection de biens soigneusement vérifiés à Cotonou et au Bénin."}
          </p>
        </div>

        {/* Filters */}
        <div className={`bg-card rounded-2xl shadow-card p-4 md:p-6 mb-8 gap-4 ${hideOfferTypeFilter ? "grid grid-cols-1 sm:grid-cols-2" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {/* Offer type */}
          {!hideOfferTypeFilter && (
            <select
              value={offerType ?? ""}
              onChange={(e) => updateFilter("type", e.target.value)}
              className="w-full py-2.5 px-3 pr-10 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none bg-no-repeat bg-right-4"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em'
              }}
              aria-label="Type d'offre"
            >
              <option value="">Louer / Vendre</option>
              <option value="louer">À louer</option>
              <option value="vendre">À vendre</option>
            </select>
          )}

          {/* Category */}
          <select
            value={category ?? ""}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full py-2.5 px-3 pr-10 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5em 1.5em'
            }}
            aria-label="Catégorie"
          >
            <option value="">Toutes catégories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* District */}
          <select
            value={district ?? ""}
            onChange={(e) => updateFilter("district", e.target.value)}
            className="w-full py-2.5 px-3 pr-10 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5em 1.5em'
            }}
            aria-label="Quartier"
          >
            <option value="">Tous quartiers</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Aucun bien ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {filtered.length} bien{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default AnnoncesPage
