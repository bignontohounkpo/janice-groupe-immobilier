import AnnoncesPage from "@/pages/AnnoncesPage"

export default function VentePage() {
  return (
    <AnnoncesPage
      forcedOfferType="vendre"
      title="Biens à vendre"
      description="Découvrez notre sélection de biens à vendre soigneusement vérifiés à Cotonou et au Bénin."
      hideOfferTypeFilter
      basePath="/vente"
    />
  )
}
