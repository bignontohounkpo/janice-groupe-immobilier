"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, SearchX, AlertCircle } from "lucide-react"
import { fetchPropertiesPaginated, fetchUsedCategories, fetchUsedLocations } from "@/lib/api"
import { useDebounce } from "@/hooks/useDebounce"
import PropertyCard from "@/components/properties/PropertyCard"
import { Autocomplete } from "@/components/ui/autocomplete"
import { Loading } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import type { OfferType, PropertyCategory, Property } from "@/types/property"

interface AnnoncesPageProps {
  forcedOfferType?: OfferType
  title?: string
  description?: string
  hideOfferTypeFilter?: boolean
  basePath?: string
}

interface District {
  name: string
  city: string
}

/** Annonces page with filters and property grid */
const AnnoncesPage = ({
  forcedOfferType,
  title,
  description,
  hideOfferTypeFilter = false,
  basePath = "/annonces"
}: AnnoncesPageProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [properties, setProperties] = useState<Property[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([])
  const [dynamicDistricts, setDynamicDistricts] = useState<District[]>([])
  const [cities, setCities] = useState<string[]>([])

  const search = searchParams?.get("search") ?? ""
  const debouncedSearch = useDebounce(search)

  // Use forced offer type from props, or from URL, or undefined
  const offerType = forcedOfferType || (searchParams?.get("offerType") as OfferType) || undefined
  const category = (searchParams?.get("category") as PropertyCategory) || undefined
  const city = searchParams?.get("city") || undefined
  const district = searchParams?.get("district") || undefined

  // Districts filtrés par ville sélectionnée
  const filteredDistricts = city
    ? dynamicDistricts.filter((d: any) => d.city === city)
    : dynamicDistricts

  const updateFilter = (key: string, value: string, additionalReset?: string[]) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    if (value) params.set(key, value)
    else params.delete(key)

    // Reset district if city changes and it's not compatible
    if (key === "city") {
      params.delete("district")
    }

    // Reset to page 1 when filters change
    params.delete("page")

    // Additional resets (e.g., reset district when city changes)
    additionalReset?.forEach(k => params.delete(k))

    // Add forced offer type to params if needed
    if (forcedOfferType && key !== "offerType") {
      params.set("offerType", forcedOfferType)
    }

    router.push(`${basePath}?${params.toString()}`)
  }

  // Charger les filtres initiaux
  useEffect(() => {
    async function loadFilters() {
      try {
        const [cats, locations] = await Promise.all([
          fetchUsedCategories(offerType),
          fetchUsedLocations(offerType)
        ])
        setDynamicCategories(cats)
        // Trier les quartiers par nom
        const sortedDists = [...locations.districts].sort((a, b) => a.name.localeCompare(b.name))
        setDynamicDistricts(sortedDists.length > 0 ? sortedDists : [])

        // Extraire les villes uniques (déjà fournies par l'API)
        setCities(locations.cities.sort())
      } catch (err) {
        console.error("Error loading categories or locations:", err)
      }
    }
    loadFilters()
  }, [offerType])

  // Charger les propriétés avec pagination
  useEffect(() => {
    async function loadProperties() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPropertiesPaginated({
          offerType: forcedOfferType || offerType,
          category,
          district: district || undefined,
          city: city || undefined,
          search: debouncedSearch,
          page: currentPage,
          pageSize: 12,
        })
        setProperties(data.properties)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error("Error loading properties:", err)
        setError("Impossible de charger les propriétés")
      } finally {
        setLoading(false)
      }
    }
    loadProperties()
  }, [forcedOfferType, currentPage, category, district, city, debouncedSearch, offerType])

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    params.set("page", String(page))
    router.push(`${basePath}?${params.toString()}`)
  }

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
        <div className={`bg-card rounded-2xl shadow-card p-4 md:p-6 mb-8 gap-4 grid grid-cols-1 sm:grid-cols-2 ${hideOfferTypeFilter ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
          {/* Offer type */}
          {!hideOfferTypeFilter && (
            <select
              value={offerType ?? ""}
              onChange={(e) => updateFilter("offerType", e.target.value)}
              className="w-full py-2.5 px-3 pr-10 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
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
            {dynamicCategories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          {/* City */}
          <Autocomplete
            options={cities}
            value={city || ""}
            onChange={(value) => updateFilter("city", value, ["district"])}
            placeholder="Toutes les villes"
            ariaLabel="Ville"
            noResultsMessage="Aucune annonce disponible pour cette ville"
          />

          {/* District */}
          <Autocomplete
            options={filteredDistricts.map((d) => d.name)}
            value={district || ""}
            onChange={(value) => updateFilter("district", value)}
            placeholder="Tous les quartiers"
            ariaLabel="Quartier"
            noResultsMessage="Aucune annonce disponible pour ce quartier"
          />
        </div>
        {/* Results */}
        {loading ? (
          <div className="py-16">
            <Loading message="Chargement des annonces..." size="lg" />
          </div>
        ) : error ? (
          <EmptyState
            icon={<AlertCircle size={40} />}
            title="Une erreur est survenue"
            description={error}
          />
        ) : properties.length === 0 ? (
          <EmptyState
            icon={<SearchX size={40} />}
            title="Désolé, nous n'avons pas d'annonce disponible dans cette zone pour le moment"
            description="Essayez d'élargir votre recherche ou contactez-nous pour être notifié des nouvelles opportunités."
            action={{
              label: "Réinitialiser les filtres",
              onClick: () => router.push(basePath)
            }}
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {total} bien{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Page précédente"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg border transition-colors ${
                        currentPage === page
                          ? "bg-accent text-accent-foreground border-accent"
                          : "border-input bg-background hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Page suivante"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default AnnoncesPage
