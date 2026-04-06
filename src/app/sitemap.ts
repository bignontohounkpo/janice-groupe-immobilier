import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.AUTH_URL || 'https://horizon-benin-properties.com'

  // Routes statiques principales
  const routes = [
    '',
    '/annonces',
    '/services',
    '/location',
    '/vente',
    '/nettoyage',
    '/contact',
    '/mentions-legales',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...routes]
}
