import "server-only"
import { prisma } from "@/lib/prisma"
import type { Property } from "@/types/property"

export type CreatePropertyData = Omit<Property, "id" | "createdAt" | "updatedAt">
export type UpdatePropertyData = Partial<CreatePropertyData>

/**
 * Service CRUD pour les propriétés via Prisma PostgreSQL
 */
export class PropertyService {
  static async getAll(filters?: {
    offerType?: "louer" | "vendre"
    category?: string
    district?: string
    city?: string
    status?: "active" | "rented" | "sold"
  }): Promise<Property[]> {
    const where: any = {}

    if (filters?.status) {
      where.status = filters.status
    } else {
      where.status = "active"
    }

    if (filters?.offerType) where.offerType = filters.offerType
    if (filters?.category) where.category = { slug: filters.category }
    if (filters?.district) where.district = { name: filters.district }
    if (filters?.city) where.city = filters.city

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        district: true,
        category: true,
      }
    })

    return properties.map(p => ({
      ...p,
      category: p.category?.slug || "",
      district: p.district?.name || "",
      coordinates: (p.lat && p.lng) ? { lat: p.lat, lng: p.lng } : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    })) as unknown as Property[]
  }

  static async getById(id: string): Promise<Property | null> {
    const p = await prisma.property.findUnique({ 
      where: { id },
      include: { district: true, category: true }
    })
    if (!p) return null
    return {
      ...p,
      category: p.category?.slug || "",
      district: p.district?.name || "",
      coordinates: (p.lat && p.lng) ? { lat: p.lat, lng: p.lng } : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    } as unknown as Property
  }

  static async getBySlug(slug: string): Promise<Property | null> {
    const p = await prisma.property.findUnique({ 
      where: { slug },
      include: { district: true, category: true }
    })
    if (!p) return null
    return {
      ...p,
      category: p.category?.slug || "",
      district: p.district?.name || "",
      coordinates: (p.lat && p.lng) ? { lat: p.lat, lng: p.lng } : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    } as unknown as Property
  }

  static async create(data: CreatePropertyData): Promise<string> {
    // We separate relationships from rest of the object
    const { category, district, coordinates, city, ...rest } = data as any;

    const p = await prisma.property.create({
      data: {
        ...rest,
        lat: coordinates?.lat,
        lng: coordinates?.lng,
        city: city || "Cotonou",
        status: data.status || "active",
        category: category ? { connect: { slug: category } } : undefined,
        district: district ? { connect: { name_city: { name: district, city: city || "Cotonou" } } } : undefined,
      }
    })
    return p.id
  }

  static async update(id: string, data: UpdatePropertyData): Promise<void> {
    const { category, district, coordinates, city, ...rest } = data as any;
    
    await prisma.property.update({
      where: { id },
      data: {
        ...rest,
        lat: coordinates ? coordinates.lat : undefined,
        lng: coordinates ? coordinates.lng : undefined,
        city: city !== undefined ? city : undefined,
        category: category ? { connect: { slug: category } } : undefined,
        district: district ? { connect: { name_city: { name: district, city: city || "Cotonou" } } } : undefined,
      },
    })
  }

  static async delete(id: string): Promise<void> {
    await prisma.property.delete({
      where: { id },
    })
  }

  static async updateStatus(id: string, status: "rented" | "sold" | "active"): Promise<void> {
    await prisma.property.update({
      where: { id },
      data: { status, isAvailable: status === "active" }
    })
  }

  static async getFeatured(): Promise<Property[]> {
    const p = await prisma.property.findMany({
      where: { status: "active", isFeatured: true },
      orderBy: { createdAt: "desc" },
      include: { district: true, category: true }
    })
    return p.map(p => ({
      ...p,
      category: p.category?.slug || "",
      district: p.district?.name || "",
      coordinates: (p.lat && p.lng) ? { lat: p.lat, lng: p.lng } : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    })) as unknown as Property[]
  }

  static async search(query: string): Promise<Property[]> {
    const q = query.toLowerCase()
    const p = await prisma.property.findMany({
      where: {
        status: "active",
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { district: { name: { contains: q, mode: 'insensitive' } } },
        ]
      },
      orderBy: { createdAt: "desc" },
      include: { district: true, category: true }
    })
    return p.map(p => ({
      ...p,
      category: p.category?.slug || "",
      district: p.district?.name || "",
      coordinates: (p.lat && p.lng) ? { lat: p.lat, lng: p.lng } : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    })) as unknown as Property[]
  }

  static async getUsedLocations(offerType?: string): Promise<{ cities: string[], districts: { name: string, city: string }[] }> {
    const where: any = { status: "active" };
    if (offerType) {
      where.offerType = offerType;
    }

    const distinctCities = await prisma.property.findMany({
      where,
      select: { city: true },
      distinct: ["city"],
    });

    const distinctDistricts = await prisma.property.findMany({
      where: { 
        ...where,
        districtId: { not: null }
      },
      select: { 
        district: {
          select: {
            name: true,
            city: true
          }
        }
      },
      distinct: ["districtId"],
    });

    return {
      cities: distinctCities.map(c => c.city).sort(),
      districts: distinctDistricts
        .map(d => d.district as { name: string, city: string })
        .filter(d => !!d && !!d.name)
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }
}
