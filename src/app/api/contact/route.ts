import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/contact - Enregistrer un message de contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, propertyId } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      )
    }

    await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        message,
        propertyId: propertyId ?? null,
        status: "nouveau",
        createdAt: new Date(),
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/contact:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
