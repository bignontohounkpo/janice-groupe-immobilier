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
  city?: string
  search?: string
  page?: number
  pageSize?: number
}): Promise<PaginatedPropertiesResponse> {
  const params = new URLSearchParams()
  if (filters?.offerType) params.set("offerType", filters.offerType)
  if (filters?.category) params.set("category", filters.category)
  if (filters?.district) params.set("district", filters.district)
  if (filters?.city) params.set("city", filters.city)
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

/**
 * ADMIN: Créer une propriété
 */
export async function createProperty(data: any): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/api/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create property")
  return res.json()
}

/**
 * ADMIN: Modifier une propriété
 */
export async function updateProperty(id: string, data: any): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/api/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update property")
  return res.json()
}

/**
 * ADMIN: Supprimer une propriété
 */
export async function deleteProperty(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/api/properties/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete property")
  return res.json()
}

/**
 * ADMIN: Récupérer toutes les catégories
 */
export async function fetchCategories(): Promise<any[]> {
  const res = await fetch(`${BASE}/api/categories`, {
    next: { revalidate: 60 },
  } as NextFetchRequestInit)
  if (!res.ok) throw new Error("Failed to fetch categories")
  return res.json()
}

/**
 * ADMIN: Créer une catégorie
 */
export async function createCategory(name: string): Promise<any> {
  const res = await fetch(`${BASE}/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error("Failed to create category")
  return res.json()
}

/**
 * ADMIN: Modifier une catégorie
 */
export async function updateCategory(id: string, name: string): Promise<any> {
  const res = await fetch(`${BASE}/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error("Failed to update category")
  return res.json()
}

/**
 * ADMIN: Supprimer une catégorie
 */
export async function deleteCategory(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/api/categories/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete category")
  return res.json()
}
/**
 * ADMIN: Récupérer tous les quartiers
 */
export async function fetchDistricts(): Promise<any[]> {
  const res = await fetch(`${BASE}/api/districts`, {
    next: { revalidate: 60 },
  } as NextFetchRequestInit)
  if (!res.ok) throw new Error("Failed to fetch districts")
  return res.json()
}

/**
 * Récupérer les villes et quartiers utilisés par les propriétés actives
 */
export async function fetchUsedLocations(offerType?: string): Promise<{ cities: string[], districts: { name: string, city: string }[] }> {
  const params = new URLSearchParams()
  if (offerType) params.set("offerType", offerType)

  const res = await fetch(`${BASE}/api/properties/used-locations?${params}`, {
    next: { revalidate: 300 },
  } as NextFetchRequestInit)

  if (!res.ok) throw new Error("Failed to fetch used locations")
  return res.json()
}

/**
 * Récupérer les catégories utilisées par les propriétés actives
 */
export async function fetchUsedCategories(offerType?: string): Promise<Array<{ id: string, name: string, slug: string }>> {
  const params = new URLSearchParams()
  if (offerType) params.set("offerType", offerType)

  const res = await fetch(`${BASE}/api/categories/used?${params}`, {
    next: { revalidate: 300 },
  } as NextFetchRequestInit)

  if (!res.ok) throw new Error("Failed to fetch used categories")
  return res.json()
}

/**
 * Récupérer tous les paramètres de l'agence
 */
export async function fetchSettings(): Promise<Record<string, string>> {
  const res = await fetch(`${BASE}/api/settings`, {
    next: { revalidate: 60 }, // Cache pour 1 minute
  } as NextFetchRequestInit)

  if (!res.ok) throw new Error("Failed to fetch settings")
  return res.json()
}
/**
 * ADMIN: Mettre à jour les paramètres de l'agence
 */
export async function updateSettings(data: Record<string, string>): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/api/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update settings")
  return res.json()
}

/**
 * Récupérer toutes les villes uniques
 */
export async function fetchCities(): Promise<string[]> {
  const res = await fetch(`${BASE}/api/cities`, {
    next: { revalidate: 60 },
  } as NextFetchRequestInit)
  if (!res.ok) throw new Error("Failed to fetch cities")
  return res.json()
}

/**
 * Rechercher des districts dynamiquement
 */
export async function searchDistricts(query: string, city?: string): Promise<string[]> {
  const params = new URLSearchParams()
  if (query) params.set("search", query)
  if (city) params.set("city", city)
  params.set("limit", "50")

  const res = await fetch(`${BASE}/api/districts?${params}`)
  if (!res.ok) throw new Error("Failed to search districts")
  const data = await res.json()
  return data.map((d: any) => d.name)
}
