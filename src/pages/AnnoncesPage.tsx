"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchPropertiesPaginated } from "@/lib/api"
import { CATEGORY_LABELS, DISTRICTS } from "@/lib/constants"
import { useDebounce } from "@/hooks/useDebounce"
import PropertyCard from "@/components/properties/PropertyCard"
import type { OfferType, PropertyCategory, Property } from "@/types/property"

interface AnnoncesPageProps {
  forcedOfferType?: OfferType
  title?: string
  description?: string
  hideOfferTypeFilter?: boolean
  basePath?: string
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

    // Reset to page 1 when filters change
    params.delete("page")

    // Add forced offer type to params if needed
    if (forcedOfferType && key !== "type") {
      params.set("type", forcedOfferType)
    }

    router.push(`${basePath}?${params.toString()}`)
  }

  // Charger les propriétés avec pagination
  useEffect(() => {
    async function loadProperties() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPropertiesPaginated({
          offerType: forcedOfferType,
          category,
          district,
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
  }, [forcedOfferType, currentPage, category, district, debouncedSearch])



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
        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Chargement...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Aucun bien ne correspond à votre recherche.
            </p>
          </div>
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
