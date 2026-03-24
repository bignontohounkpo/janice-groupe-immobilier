import AnnoncesPage from "@/pages/AnnoncesPage"
import { Suspense } from "react"

export default function VentePage() {
  return (
    <Suspense>
      <AnnoncesPage
        forcedOfferType="vendre"
        title="Biens à vendre"
        description="Découvrez notre sélection de biens à vendre soigneusement vérifiés à Cotonou et au Bénin."
        hideOfferTypeFilter
        basePath="/vente"
      />
    </Suspense>
  )
}
