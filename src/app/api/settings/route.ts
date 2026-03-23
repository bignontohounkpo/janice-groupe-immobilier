import { NextRequest, NextResponse } from "next/server";
import { SettingService } from "@/services/SettingService";
import { auth } from "@/auth";
import { UserRole } from "@/types/user";

/**
 * GET /api/settings
 * Récupère tous les paramètres (ou un spécifique via query param ?key=...)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const value = await SettingService.get(key);
      return NextResponse.json({ [key]: value });
    }

    const settings = await SettingService.getAll();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/settings:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * PATCH /api/settings
 * Met à jour un ou plusieurs paramètres
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    // Protection : seuls les admins peuvent modifier les paramètres
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await SettingService.set(key, value);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/settings:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
