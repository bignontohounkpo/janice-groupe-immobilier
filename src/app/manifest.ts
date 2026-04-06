import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Janice Groupe International Immobilier',
    short_name: 'Janice Immobilier',
    description: "L'agence immobilière de référence à Cotonou, Bénin. Achat, vente, location et gestion de biens.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1A5276',
    icons: [
      {
        src: '/logo.webp',
        sizes: 'any',
        type: 'image/webp',
      },
    ],
  }
}
