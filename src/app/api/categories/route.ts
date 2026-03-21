import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let whereClause = {};
    if (search) {
      whereClause = {
        name: { contains: search, mode: "insensitive" },
      };
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
