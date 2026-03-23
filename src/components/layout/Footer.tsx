"use client"

import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { NAV_LINKS } from "@/lib/constants"
import { useSettings } from "@/context/SettingsContext"

/** Site footer with navigation, contact info and legal */
const Footer = () => {
  const { agency } = useSettings()
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">{agency.NAME}</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Votre partenaire de confiance pour tous vos projets immobiliers au Bénin.
              Location, vente, construction — depuis plus de 12 ans.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="shrink-0" />
                {agency.ADDRESS}
              </li>
              <li>
                <a href={agency.PHONE_LINK} className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Phone size={16} className="shrink-0" />
                  {agency.PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${agency.EMAIL}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Mail size={16} className="shrink-0" />
                  {agency.EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} {agency.NAME}. Tous droits réservés.</p>
          <Link href="/mentions-legales" className="hover:text-accent transition-colors">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
