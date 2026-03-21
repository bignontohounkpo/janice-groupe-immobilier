import { NextRequest, NextResponse } from "next/server"
import { uploadImageToR2 } from "@/lib/r2"
import crypto from "crypto"

// POST /api/upload - Upload an image to Cloudflare R2
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier n'a été fourni." },
        { status: 400 }
      )
    }

    // Validation (Image only, Max 5MB)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image." },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La taille de l'image ne doit pas dépasser 5 Mo." },
        { status: 400 }
      )
    }

    // Conversion en Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Générer un nom unique pour éviter les conflits
    const extension = file.name.split(".").pop() || "png"
    const uniqueFileName = `${crypto.randomUUID()}-${Date.now()}.${extension}`

    // Upload vers R2
    const publicUrl = await uploadImageToR2(buffer, uniqueFileName, file.type)

    return NextResponse.json(
      { 
        success: true, 
        url: publicUrl,
        message: "Image téléchargée avec succès." 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de l'upload:", error)
    return NextResponse.json(
      { error: "Erreur serveur lors de l'upload de l'image." },
      { status: 500 }
    )
  }
}
