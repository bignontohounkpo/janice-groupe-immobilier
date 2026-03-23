import { NextRequest, NextResponse } from "next/server";
import { PropertyService } from "@/services/PropertyService";

/**
 * GET /api/properties/used-locations
 * 
 * Retourne la liste des villes et quartiers (districts) utilisés par les propriétés actives.
 * Utile pour alimenter les filtres de recherche dans le frontend.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offerType = searchParams.get("offerType");

    // Utiliser le service pour récupérer les localisations filtrées
    const data = await PropertyService.getUsedLocations(offerType || undefined);

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/properties/used-locations:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la récupération des localisations" }, { status: 500 });
  }
}
