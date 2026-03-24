import AnnoncesPage from "@/pages/AnnoncesPage"
import { Suspense } from "react"

export default function LocationPage() {
  return (
    <Suspense>
      <AnnoncesPage
        forcedOfferType="louer"
        title="Biens à louer"
        description="Découvrez notre sélection de biens à louer soigneusement vérifiés à Cotonou et au Bénin."
        hideOfferTypeFilter
        basePath="/location"
      />
    </Suspense>
  )
}
