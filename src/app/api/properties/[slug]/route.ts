import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/properties/[slug] - Récupérer une propriété par son slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const propertyRaw = await prisma.property.findFirst({
      where: { slug, status: "active" },
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
