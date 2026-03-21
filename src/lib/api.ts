import type { Property } from "@/types/property"

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? ""

// Type Next.js pour fetch avec revalidate
type NextFetchRequestInit = RequestInit & {
  next?: {
    revalidate?: number | false
    tags?: string[]
  }
}

export interface PaginatedPropertiesResponse {
  properties: Property[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Récupérer les propriétés avec pagination
 */
export async function fetchPropertiesPaginated(filters?: {
  offerType?: "louer" | "vendre"
  category?: string
  district?: string
  search?: string
  page?: number
  pageSize?: number
}): Promise<PaginatedPropertiesResponse> {
  const params = new URLSearchParams()
  if (filters?.offerType) params.set("offerType", filters.offerType)
  if (filters?.category) params.set("category", filters.category)
  if (filters?.district) params.set("district", filters.district)
  if (filters?.search) params.set("search", filters.search)
  if (filters?.page) params.set("page", String(filters.page))
  if (filters?.pageSize) params.set("pageSize", String(filters.pageSize))

  const res = await fetch(`${BASE}/api/properties?${params}`, {
    next: { revalidate: 60 },
  } as NextFetchRequestInit)

  if (!res.ok) throw new Error("Failed to fetch properties")
  return res.json()
}

/**
 * Récupérer la liste des propriétés avec filtres optionnels (backward compatible)
 */
export async function fetchProperties(filters?: {
  offerType?: "louer" | "vendre"
  category?: string
  district?: string
}): Promise<Property[]> {
  const data = await fetchPropertiesPaginated({
    ...filters,
    pageSize: 100, // Grande limite pour la compatibilité
  })
  return data.properties
}

/**
 * Récupérer une propriété par son slug
 */
export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  const res = await fetch(`${BASE}/api/properties/${encodeURIComponent(slug)}`, {
    next: { revalidate: 300 },
  } as NextFetchRequestInit)

  if (!res.ok) return null
  return res.json()
}

/**
 * Récupérer les propriétés en vedette
 */
export async function fetchFeaturedProperties(): Promise<Property[]> {
  const res = await fetch(`${BASE}/api/properties`, {
    next: { revalidate: 120 },
  } as NextFetchRequestInit)

  if (!res.ok) throw new Error("Failed to fetch featured properties")
  const data: PaginatedPropertiesResponse = await res.json()
  return data.properties.filter((p) => p.isFeatured)
}

/**
 * Envoyer un message de contact
 */
export async function submitContactForm(data: {
  name: string
  email: string
  phone?: string
  message: string
  propertyId?: string
}): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Failed to submit contact form")
  return res.json()
}
