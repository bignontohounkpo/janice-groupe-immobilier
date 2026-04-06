import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
})

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
})

export const metadata: Metadata = {
  title: {
    default: "Janice Groupe International Immobilier",
    template: "%s | Janice Immobilier",
  },
  description: "L'agence immobilière de référence à Cotonou, Bénin. Achat, vente, location et gestion de biens immobiliers de standing.",
  keywords: ["immobilier bénin", "cotonou real estate", "achat maison bénin", "location appartement cotonou", "agence immobilière bénin", "terrains à vendre", "gestion immobilière"],
  authors: [{ name: "Janice Groupe" }],
  creator: "Janice Groupe",
  publisher: "Janice Groupe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.AUTH_URL || ''),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Janice Groupe International Immobilier",
    description: "L'agence immobilière de référence à Cotonou, Bénin. Achat, vente, location et gestion de biens immobiliers de standing.",
    url: "/",
    siteName: "Janice Immobilier",
    images: [
      {
        url: "/logo.webp",
        width: 800,
        height: 600,
        alt: "Janice Groupe International Immobilier Logo",
      },
    ],
    locale: "fr_BJ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Janice Groupe International Immobilier",
    description: "L'agence immobilière de référence à Cotonou, Bénin. Achat, vente, location et gestion de biens immobiliers.",
    images: ["/logo.webp"],
  },
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${poppins.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
