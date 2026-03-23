import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offerType = searchParams.get("offerType");

    const where: any = {
      status: "active",
    };

    if (offerType && offerType !== "all" && offerType !== "") {
      where.offerType = offerType;
    }

    // Récupérer les catégories utilisées par les propriétés actives
    const properties = await prisma.property.findMany({
      where,
      select: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      distinct: ["categoryId"],
    });

    const categories = properties
      .map((p) => p.category)
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories/used:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
