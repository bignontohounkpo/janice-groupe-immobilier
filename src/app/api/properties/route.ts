import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Property } from "@/types/property"

interface PaginatedResponse {
  properties: Property[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// GET /api/properties - Récupérer les propriétés avec pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const offerType = searchParams.get("offerType")
    const category = searchParams.get("category")
    const district = searchParams.get("district")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") ?? "1", 10)
    const pageSize = Number.parseInt(searchParams.get("pageSize") ?? "12", 10)

    const where: any = { status: "active" }

    if (offerType) where.offerType = offerType
    if (category) where.category = { slug: category }
    if (district) where.district = { name: district }
    if (search) {
      const q = search.toLowerCase()
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { district: { name: { contains: q, mode: 'insensitive' } } }
      ]
    }

    const total = await prisma.property.count({ where })
    const totalPages = Math.ceil(total / pageSize)
    const skip = (page - 1) * pageSize

    const rawProperties = await prisma.property.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { category: true, district: true }
    })

    const properties = rawProperties.map(p => ({
      ...p,
      category: p.category?.slug || "",
      district: p.district?.name || "",
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })) as unknown as Property[]

    const response: PaginatedResponse = {
      properties,
      total,
      page,
      pageSize,
      totalPages,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("GET /api/properties:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST /api/properties - Créer une nouvelle propriété
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, district, coordinates, city, ...rest } = body

    const p = await prisma.property.create({
      data: {
        ...rest,
        lat: coordinates?.lat,
        lng: coordinates?.lng,
        city: city || "Cotonou",
        status: "active",
        category: category ? { connect: { slug: category } } : undefined,
        district: district ? { connect: { name_city: { name: district, city: city || "Cotonou" } } } : undefined,
      }
    })

    return NextResponse.json({ id: p.id }, { status: 201 })
  } catch (error) {
    console.error("POST /api/properties:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
