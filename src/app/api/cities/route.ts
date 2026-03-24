import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Récupérer toutes les villes uniques depuis les districts
    const districts = await prisma.district.findMany({
      select: { city: true },
      orderBy: { city: "asc" },
    });

    // Dédupliquer et trier
    const cities = Array.from(new Set(districts.map((d) => d.city))).sort();

    return NextResponse.json(cities);
  } catch (error) {
    console.error("GET /api/cities:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
