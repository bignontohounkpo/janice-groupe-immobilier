import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    
    const limit = Number.parseInt(searchParams.get("limit") ?? "50", 10); 

    const whereClause: any = {};
    
    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }
    
    if (city) {
      whereClause.city = { contains: city, mode: "insensitive" };
    }

    const districts = await prisma.district.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      take: limit,
    });

    return NextResponse.json(districts);
  } catch (error) {
    console.error("GET /api/districts:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
