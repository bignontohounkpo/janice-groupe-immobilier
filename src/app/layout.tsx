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
  title: "Janice Groupe International Immobilier",
  description: "Agence immobilière à Cotonou, Bénin - Achat, vente, location de biens immobiliers",
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
