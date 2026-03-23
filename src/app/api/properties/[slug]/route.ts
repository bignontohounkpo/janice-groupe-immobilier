import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/properties/[slug] - Récupérer une propriété par son slug ou id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const searchParams = new URL(request.url).searchParams
    const status = searchParams.get("status")

    const whereClause: any = {
      OR: [{ slug }, { id: slug }]
    }
    if (status !== "all") {
      whereClause.status = "active"
    }

    const propertyRaw = await prisma.property.findFirst({
      where: whereClause,
      include: { district: true, category: true }
    })

    if (!propertyRaw) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const property = {
      ...propertyRaw,
      category: propertyRaw.categoryId || "",
      district: propertyRaw.district?.name || "",
      createdAt: propertyRaw.createdAt.toISOString(),
      updatedAt: propertyRaw.updatedAt.toISOString(),
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("GET /api/properties/[slug]:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PUT /api/properties/[id] - Modifier une propriété
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: id } = await params
    const body = await request.json()
    const { category, district, coordinates, city, ...rest } = body

    const existing = await prisma.property.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Clean up undefined fields dynamically if needed, 
    // Prisma will ignore undefined values but we make sure of explicit mappings
    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...rest,
        lat: coordinates?.lat,
        lng: coordinates?.lng,
        city: city || "Cotonou",
        category: category ? { connect: { slug: category } } : undefined,
        district: district ? { 
          connectOrCreate: { 
            where: { name_city: { name: district, city: city || "Cotonou" } },
            create: { name: district, city: city || "Cotonou" }
          } 
        } : undefined,
      }
    })

    return NextResponse.json({ id: updated.id }, { status: 200 })
  } catch (error) {
    console.error("PUT /api/properties/[slug]:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/properties/[id] - Supprimer une propriété
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: id } = await params
    
    const existing = await prisma.property.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.property.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("DELETE /api/properties/[slug]:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
