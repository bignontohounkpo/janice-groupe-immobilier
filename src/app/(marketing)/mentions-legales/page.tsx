"use client"

import { useSettings } from "@/context/SettingsContext"

export default function MentionsLegalesPage() {
  const { agency } = useSettings()
  return (
    <main className="section-padding">
      <div className="container-custom max-w-3xl">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-8">Mentions légales</h1>

        <div className="prose prose-lg text-foreground space-y-6">
          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground">Éditeur du site</h2>
            <p className="text-muted-foreground">
              {agency.NAME}<br />
              {agency.ADDRESS}<br />
              Téléphone : {agency.PHONE}<br />
              Email : {agency.EMAIL}
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground">Propriété intellectuelle</h2>
            <p className="text-muted-foreground">
              L'ensemble du contenu de ce site (textes, images, logos, vidéos) est protégé par le droit d'auteur.
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground">Protection des données</h2>
            <p className="text-muted-foreground">
              Les informations collectées via les formulaires de contact sont destinées exclusivement à {agency.NAME} et ne sont
              jamais transmises à des tiers. Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès,
              de modification et de suppression de vos données personnelles.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-foreground">Responsabilité</h2>
            <p className="text-muted-foreground">
              {agency.NAME} s'efforce de fournir des informations exactes et à jour sur ce site. Toutefois, nous ne pouvons
              garantir l'exhaustivité ni l'absence d'erreurs dans les contenus publiés.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
